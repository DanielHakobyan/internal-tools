import { NextRequest, NextResponse } from "next/server";
import { IntegrationPayload, IntegrationResult } from "@/lib/types";

const MOCK_DELAY = 1500;

async function mockSuccess(platform: string): Promise<IntegrationResult> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY));
  return {
    success: true,
    message: `Task sent to ${platform} successfully (mock mode)`,
    mock: true,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: IntegrationPayload = await request.json();
    const { actionItem, meetingTitle } = payload;

    if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_CHANNEL_ID) {
      const result = await mockSuccess("Slack");
      return NextResponse.json(result);
    }

    const priorityEmoji =
      actionItem.priority === "high" ? "🔴" : actionItem.priority === "medium" ? "🟡" : "🟢";

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📋 New Action Item from: ${meetingTitle}`,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Task:*\n${actionItem.task}` },
          { type: "mrkdwn", text: `*Owner:*\n${actionItem.owner}` },
          {
            type: "mrkdwn",
            text: `*Deadline:*\n${actionItem.deadline || "No deadline"}`,
          },
          {
            type: "mrkdwn",
            text: `*Priority:*\n${priorityEmoji} ${actionItem.priority.toUpperCase()}`,
          },
        ],
      },
    ];

    if (actionItem.notes) {
      blocks.push({
        type: "section",
        fields: [{ type: "mrkdwn", text: `*Notes:*\n${actionItem.notes}` }],
      } as never);
    }

    const slackResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: process.env.SLACK_CHANNEL_ID,
        blocks,
        text: `Action item: ${actionItem.task}`,
      }),
    });

    const slackData = await slackResponse.json();

    if (!slackData.ok) {
      throw new Error(slackData.error || "Slack API error");
    }

    return NextResponse.json({
      success: true,
      message: "Task sent to Slack successfully",
      url: `https://slack.com/archives/${process.env.SLACK_CHANNEL_ID}`,
    } as IntegrationResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Slack integration failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

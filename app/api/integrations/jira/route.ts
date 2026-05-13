import { NextRequest, NextResponse } from "next/server";
import { IntegrationPayload, IntegrationResult } from "@/lib/types";

const MOCK_DELAY = 1500;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: IntegrationPayload = await request.json();
    const { actionItem, meetingTitle } = payload;

    const baseUrl = process.env.JIRA_BASE_URL;
    const projectKey = process.env.JIRA_PROJECT_KEY;
    const email = process.env.JIRA_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;

    if (!baseUrl || !projectKey || !email || !apiToken) {
      await new Promise((r) => setTimeout(r, MOCK_DELAY));
      return NextResponse.json({
        success: true,
        message: "Task sent to Jira successfully (mock mode)",
        mock: true,
      });
    }

    const priorityMap: Record<string, string> = {
      high: "Highest",
      medium: "Medium",
      low: "Low",
    };

    let description = `Created from meeting: ${meetingTitle}\n\n*Owner:* ${actionItem.owner}\n*Department:* ${actionItem.department}`;
    if (actionItem.notes) {
      description += `\n\n*Notes:*\n${actionItem.notes}`;
    }
    if (actionItem.deadline) {
      description += `\n\n*Deadline:* ${actionItem.deadline}`;
    }

    const body = {
      fields: {
        project: {
          key: projectKey,
        },
        summary: actionItem.task,
        description: description,
        issuetype: {
          name: "Task",
        },
        priority: {
          name: priorityMap[actionItem.priority] || "Medium",
        },
      },
    };

    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");
    
    const response = await fetch(`${baseUrl}/rest/api/2/issue`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Task created in Jira",
      url: `${baseUrl}/browse/${data.key}`,
    } as IntegrationResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Jira integration failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { IntegrationPayload, IntegrationResult } from "@/lib/types";

const MOCK_DELAY = 1500;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: IntegrationPayload = await request.json();
    const { actionItem, meetingTitle } = payload;

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      await new Promise((r) => setTimeout(r, MOCK_DELAY));
      return NextResponse.json({
        success: true,
        message: "Task sent to Notion successfully (mock mode)",
        mock: true,
      });
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const priorityColors: Record<string, string> = {
      high: "red",
      medium: "yellow",
      low: "green",
    };

    const properties: any = {
      Name: {
        title: [
          {
            text: {
              content: actionItem.task,
            },
          },
        ],
      },
      Owner: {
        rich_text: [
          {
            text: {
              content: actionItem.owner,
            },
          },
        ],
      },
      Status: {
        status: {
          name: "Not started",
        },
      },
      Priority: {
        select: {
          name: actionItem.priority.charAt(0).toUpperCase() + actionItem.priority.slice(1),
          color: priorityColors[actionItem.priority] || "default",
        },
      },
      Source: {
        rich_text: [
          {
            text: {
              content: meetingTitle,
            },
          },
        ],
      },
    };

    if (actionItem.deadline) {
      properties.Deadline = {
        date: {
          start: actionItem.deadline,
        },
      };
    }

    if (actionItem.department) {
      properties.Department = {
        select: {
          name: actionItem.department.charAt(0).toUpperCase() + actionItem.department.slice(1),
        },
      };
    }

    const children = [];
    if (actionItem.notes) {
      children.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: `Notes: ${actionItem.notes}`,
              },
            },
          ],
        },
      });
    }

    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties,
      children: children as any,
    });

    return NextResponse.json({
      success: true,
      message: "Task created in Notion",
      url: (response as any).url,
    } as IntegrationResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Notion integration failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "@/lib/constants";
import { MeetingExtraction } from "@/lib/types";

export async function POST(request: NextRequest) {
  let transcript: string | undefined;

  try {
    const body = await request.json();
    transcript = body.transcript;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      // Demo mode: return mock data
      await new Promise((r) => setTimeout(r, 2500));
      return NextResponse.json({ data: getMockExtraction(transcript), mock: true });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract action items from this transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    const parsed: MeetingExtraction = JSON.parse(content);

    return NextResponse.json({ data: parsed });
  } catch (error: unknown) {
    console.error("Extraction error:", error);

    // Fallback to mock data if API key is invalid or request fails
    if (transcript) {
      console.log("Falling back to mock data due to extraction error");
      return NextResponse.json({ data: getMockExtraction(transcript), mock: true });
    }

    const message = error instanceof Error ? error.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function getMockExtraction(transcript: string): MeetingExtraction {
  const wordCount = transcript.trim().split(/\s+/).length;
  const isLong = wordCount > 200;

  return {
    meeting_title: "Q3 Product Roadmap Sync",
    meeting_date: "2024-07-15",
    duration_estimate: isLong ? "1.5 hours" : "45 minutes",
    attendees: [
      { name: "Sarah Chen", role: "Product Manager" },
      { name: "Marcus Johnson", role: "Engineering Lead" },
      { name: "Priya Patel", role: "Design Lead" },
      { name: "Tom Williams", role: "Marketing Director" },
      { name: "Alex Rivera", role: "DevOps" },
      { name: "Jordan Lee", role: "Sales Lead" },
    ],
    summary:
      "The team aligned on Q3 priorities with SSO moved to week 1 replacing the analytics dashboard, driven by enterprise client retention risk. Infrastructure scaling and a security audit are critical blockers before the v2.0 launch. Multiple cross-functional action items were assigned with clear owners and deadlines.",
    action_items: [
      {
        id: "1",
        task: "Reach out to legal team for data handling compliance sign-off",
        owner: "Sarah Chen",
        deadline: "2024-07-15",
        priority: "high",
        department: "legal",
        notes: "Blocking API gateway production deployment",
        status: "pending",
      },
      {
        id: "2",
        task: "Hold marketing materials until legal clearance is received",
        owner: "Tom Williams",
        deadline: "2024-07-15",
        priority: "high",
        department: "marketing",
        notes: "v2.0 press release and campaign materials on hold",
        status: "pending",
      },
      {
        id: "3",
        task: "Confirm feature list for v2.0 and share with marketing team",
        owner: "Sarah Chen",
        deadline: "2024-07-17",
        priority: "high",
        department: "engineering",
        notes: "Tom's team needs this by Wednesday for press release copy",
        status: "pending",
      },
      {
        id: "4",
        task: "Review Priya's component library and design tokens",
        owner: "Marcus Johnson",
        deadline: "2024-07-18",
        priority: "high",
        department: "engineering",
        notes: "Thursday afternoon review session scheduled",
        status: "pending",
      },
      {
        id: "5",
        task: "Assign David to mobile responsive dashboard fixes",
        owner: "Marcus Johnson",
        deadline: "2024-07-22",
        priority: "high",
        department: "engineering",
        notes: "Affects 30% of users, estimated 3 days of work",
        status: "pending",
      },
      {
        id: "6",
        task: "Prepare infrastructure cost estimate for database cluster scaling",
        owner: "Alex Rivera",
        deadline: "2024-07-16",
        priority: "high",
        department: "devops",
        notes: "Required for Thursday leadership presentation",
        status: "pending",
      },
      {
        id: "7",
        task: "Update sprint plan and move SSO to week 1, notify team",
        owner: "Marcus Johnson",
        deadline: "2024-07-15",
        priority: "high",
        department: "engineering",
        notes: "Analytics dashboard deprioritized; 3 enterprise clients at risk of churning",
        status: "pending",
      },
      {
        id: "8",
        task: "Communicate updated SSO timeline to enterprise clients",
        owner: "Jordan Lee",
        deadline: "2024-07-19",
        priority: "high",
        department: "sales",
        notes: "Two clients at churn risk; SSO was promised in Q2",
        status: "pending",
      },
      {
        id: "9",
        task: "Set up recruitment campaign for user interviews (onboarding flow)",
        owner: "Tom Williams",
        deadline: "2024-07-22",
        priority: "medium",
        department: "marketing",
        notes: "Emily to contact customer success list; 10 interviews needed",
        status: "pending",
      },
      {
        id: "10",
        task: "Conduct 10 user interviews for onboarding flow redesign",
        owner: "Priya Patel",
        deadline: "2024-07-29",
        priority: "medium",
        department: "design",
        notes: "Dependent on marketing recruitment campaign",
        status: "pending",
      },
      {
        id: "11",
        task: "Scale up database clusters before v2.0 launch",
        owner: "Alex Rivera",
        deadline: "2024-08-01",
        priority: "high",
        department: "devops",
        notes: "~40 hours of work; current infra won't handle launch load",
        status: "pending",
      },
      {
        id: "12",
        task: "Set up new monitoring dashboards",
        owner: "Alex Rivera",
        deadline: "2024-07-26",
        priority: "medium",
        department: "devops",
        notes: null,
        status: "pending",
      },
      {
        id: "13",
        task: "Block last week of July in release calendar (senior engineer vacations)",
        owner: "Alex Rivera",
        deadline: "2024-07-16",
        priority: "medium",
        department: "devops",
        notes: "Two senior engineers on vacation; no critical releases that week",
        status: "pending",
      },
      {
        id: "14",
        task: "Connect Alex Rivera with Lisa from Finance for AWS contract renewal",
        owner: "Sarah Chen",
        deadline: "2024-07-16",
        priority: "high",
        department: "finance",
        notes: "AWS contract expires Aug 15; finance needs to approve budget by Aug 1",
        status: "pending",
      },
      {
        id: "15",
        task: "Prepare client retention report for leadership meeting",
        owner: "Jordan Lee",
        deadline: "2024-07-22",
        priority: "medium",
        department: "sales",
        notes: null,
        status: "pending",
      },
    ],
    key_decisions: [
      "SSO feature moved to week 1 of Q3, replacing analytics dashboard, due to enterprise client churn risk",
      "v2.0 press release and marketing materials on hold until legal compliance sign-off",
      "Media briefing tentatively scheduled for August 5th",
      "Design review for onboarding flow scheduled for July 26th at 2pm",
    ],
    blockers: [
      "Legal compliance sign-off required before API gateway goes to production",
      "Infrastructure not ready for v2.0 launch load — scaling required",
      "Senior engineer vacation last week of July limits capacity",
    ],
    follow_up_meeting: "July 22, 2024 at 10am",
  };
}

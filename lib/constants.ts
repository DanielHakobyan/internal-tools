export const SAMPLE_TRANSCRIPT = `Q3 Product Roadmap Sync - July 15, 2024

Attendees: Sarah Chen (Product Manager), Marcus Johnson (Engineering Lead), Priya Patel (Design Lead), Tom Williams (Marketing Director), Alex Rivera (DevOps), Jordan Lee (Sales Lead)

Sarah: Alright everyone, let's get started. We have a lot to cover for Q3. Marcus, can you give us the engineering update first?

Marcus: Sure. So we're about 60% done with the new API gateway. The main blocker right now is that we need the security audit completed before we can push to production. I need someone from legal to sign off on the data handling compliance docs by end of this week.

Sarah: Got it. I'll reach out to the legal team today. Tom, can you make sure your team's marketing materials don't go live until we get that clearance?

Tom: Absolutely. I was actually going to bring up that we need to finalize the press release for the v2.0 launch. My team needs the feature list confirmed by Wednesday so we can write the copy. Also, we need to schedule a media briefing - I'm thinking August 5th.

Priya: I have the new design system 80% complete. I need Marcus's team to review the component library by Friday so we can finalize the tokens. Also, I noticed we haven't assigned anyone to the mobile responsive fixes for the dashboard - that's a critical issue affecting about 30% of our users.

Marcus: I'll get David on the mobile fixes starting Monday. That should take about 3 days. And I'll personally review Priya's components Thursday afternoon.

Alex: I need to flag that our current infrastructure won't handle the expected load for the v2.0 launch. We need to scale up the database clusters before August 1st. I'm estimating about 40 hours of work. Also, we should set up the new monitoring dashboards - I can do that by end of next week.

Sarah: Alex, can you put together a cost estimate for the infrastructure scaling by tomorrow EOD? We need to present it to leadership on Thursday.

Jordan: From the sales side, we have 3 enterprise clients waiting on the SSO feature. They've been waiting since Q2 and two of them are at risk of churning. We need to prioritize that above everything.

Marcus: SSO is on the roadmap for week 3 of Q3. We can't move it earlier without dropping something else.

Sarah: Let's make a decision here - we'll deprioritize the analytics dashboard feature and move SSO to week 1. Marcus, does that work?

Marcus: Yes, that works. I'll update the sprint plan and notify the team today.

Sarah: Great. Jordan, can you communicate the updated timeline to those enterprise clients by end of week?

Jordan: Will do. I'll also prepare a client retention report for the next leadership meeting.

Priya: One more thing - we still haven't conducted user research for the onboarding flow redesign. I'd like to get at least 10 user interviews done in the next two weeks. Can someone from marketing help recruit participants?

Tom: I can have Emily from my team set up the recruitment campaign. She'll reach out to our customer success list.

Sarah: Perfect. Let's also make sure we schedule a design review for the onboarding flow - let's say July 26th at 2pm. 

Marcus: Before we close, I want to flag that two of our senior engineers are going on vacation the last week of July. We need to make sure we don't have any critical releases planned for that period.

Sarah: Noted. Alex, please block that week off in the release calendar. 

Alex: Done. Also a reminder that we need to renew our AWS contract - it expires August 15th. Finance needs to approve the budget by August 1st.

Sarah: I'll connect Alex with Lisa from finance today. 

Alright, let's wrap up. Next sync is July 22nd at 10am. Everyone please update your tasks in Jira before then.`;

export const SYSTEM_PROMPT = `You are an expert meeting analyst. Extract ALL action items, decisions, and commitments from meeting transcripts.
Return ONLY valid JSON, no markdown, no backticks, no explanation. Use this exact structure:
{
  "meeting_title": "inferred title",
  "meeting_date": "YYYY-MM-DD or null",
  "duration_estimate": "X hours",
  "attendees": [{ "name": "Full Name", "role": "role if mentioned" }],
  "summary": "2-3 sentence executive summary",
  "action_items": [
    {
      "id": "1",
      "task": "clear specific actionable task",
      "owner": "Full Name",
      "deadline": "YYYY-MM-DD or null",
      "priority": "high|medium|low",
      "department": "engineering|design|marketing|sales|ops|devops|hr|finance|legal",
      "notes": "context or dependencies or null",
      "status": "pending"
    }
  ],
  "key_decisions": ["decision 1", "decision 2"],
  "blockers": ["blocker 1"],
  "follow_up_meeting": "date/time if mentioned or null"
}

Priority rules:
high = blocker/executive ask/due this week
medium = important/next 2 weeks
low = nice-to-have/no hard deadline

Extract every implicit commitment too, not just explicit ones.`;

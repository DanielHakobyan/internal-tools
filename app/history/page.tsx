"use client";

import { ArrowLeft, Clock, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const MOCK_HISTORY = [
  {
    id: "1",
    title: "Q3 Product Roadmap Sync",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    actions: 15,
  },
  {
    id: "2",
    title: "Weekly Marketing Standup",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    actions: 8,
  },
  {
    id: "3",
    title: "Design System Review",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    actions: 4,
  },
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            Meeting History
          </h1>
          <p className="text-muted-foreground mt-2">
            View your past transcripts and extracted action items.
          </p>
        </div>

        <div className="grid gap-4">
          {MOCK_HISTORY.map((meeting) => (
            <Link
              key={meeting.id}
              href="/"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {meeting.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Extracted {formatDistanceToNow(new Date(meeting.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-border pt-4 sm:pt-0">
                <div className="text-center">
                  <div className="text-xl font-bold">{meeting.actions}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Actions
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { MeetingExtraction, ActionItem } from "@/lib/types";
import { estimateMinutesSaved, formatDate } from "@/lib/utils";
import ActionItemCard from "./ActionItemCard";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle2, Zap } from "lucide-react";

interface DashboardProps {
  data: MeetingExtraction;
  onReset: () => void;
}

export default function Dashboard({ data, onReset }: DashboardProps) {
  const [items, setItems] = useState<ActionItem[]>(data.action_items);

  const highPriorityCount = items.filter((i) => i.priority === "high").length;
  const uniqueOwners = new Set(items.map((i) => i.owner)).size;
  const minutesSaved = estimateMinutesSaved(items.length);

  const handleUpdateStatus = (id: string, status: ActionItem["status"]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleMarkPushed = (id: string, platform: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const pushedTo = item.pushed_to || [];
          if (!pushedTo.includes(platform)) {
            return { ...item, pushed_to: [...pushedTo, platform] };
          }
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Input
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{data.meeting_title}</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {data.summary}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <Calendar className="h-4 w-4" />
                {formatDate(data.meeting_date)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <Clock className="h-4 w-4" />
                {data.duration_estimate}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <Users className="h-4 w-4" />
                {data.attendees.length} Attendees
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Action Items ({items.length})
              </h2>
            </div>
            <div className="grid gap-4">
              {items.map((item) => (
                <ActionItemCard
                  key={item.id}
                  item={item}
                  meetingTitle={data.meeting_title}
                  onUpdateStatus={handleUpdateStatus}
                  onMarkPushed={handleMarkPushed}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Extraction Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {items.length}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                  Total Tasks
                </div>
              </div>
              <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400">
                  {highPriorityCount}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                  High Priority
                </div>
              </div>
              <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {uniqueOwners}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                  Owners
                </div>
              </div>
              <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  ~{minutesSaved}m
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                  Saved
                </div>
              </div>
            </div>

            {data.key_decisions.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                  Key Decisions
                </h3>
                <ul className="space-y-2">
                  {data.key_decisions.map((decision, i) => (
                    <li
                      key={i}
                      className="text-sm bg-muted/20 border border-border/30 rounded-md p-2.5 leading-snug"
                    >
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.blockers.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3 text-sm text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Blockers
                </h3>
                <ul className="space-y-2">
                  {data.blockers.map((blocker, i) => (
                    <li
                      key={i}
                      className="text-sm text-red-400/90 bg-red-500/10 border border-red-500/20 rounded-md p-2.5 leading-snug"
                    >
                      {blocker}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

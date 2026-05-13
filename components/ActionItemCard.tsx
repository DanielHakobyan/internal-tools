"use client";

import { useState } from "react";
import { ActionItem } from "@/lib/types";
import {
  formatDeadline,
  getAvatarColor,
  getDepartmentColor,
  getInitials,
  getPriorityColor,
  getStatusConfig,
} from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
  Send,
} from "lucide-react";

interface ActionItemCardProps {
  item: ActionItem;
  meetingTitle: string;
  onUpdateStatus: (id: string, status: ActionItem["status"]) => void;
  onMarkPushed: (id: string, platform: string) => void;
}

export default function ActionItemCard({
  item,
  meetingTitle,
  onUpdateStatus,
  onMarkPushed,
}: ActionItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPushing, setIsPushing] = useState<string | null>(null);

  const pColor = getPriorityColor(item.priority);
  const statusConfig = getStatusConfig(item.status);
  const deptColor = getDepartmentColor(item.department);

  const handlePush = async (platform: string) => {
    setIsPushing(platform);
    try {
      const res = await fetch(`/api/integrations/${platform.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionItem: item, meetingTitle }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to push");

      onMarkPushed(item.id, platform);

      if (data.mock) {
        toast.info(`Sent to ${platform} (Mock Mode)`);
      } else {
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-medium">Pushed to {platform}</span>
            {data.url && (
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline text-primary"
              >
                View task
              </a>
            )}
          </div>
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Integration failed");
    } finally {
      setIsPushing(null);
    }
  };

  const integrations = ["Slack", "Notion", "Jira"];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${pColor.bg} ${pColor.text} ${pColor.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${pColor.dot}`} />
                {item.priority}
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${deptColor}`}
              >
                {item.department}
              </span>
            </div>

            <h3 className="font-semibold text-lg leading-tight">{item.task}</h3>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${getAvatarColor(
                    item.owner
                  )}`}
                >
                  {getInitials(item.owner)}
                </div>
                <span className="font-medium text-foreground">{item.owner}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 opacity-70" />
                <span className={item.deadline ? "text-foreground" : ""}>
                  {formatDeadline(item.deadline)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
            <select
              value={item.status}
              onChange={(e) => onUpdateStatus(item.id, e.target.value as ActionItem["status"])}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer appearance-none ${statusConfig.bg} ${statusConfig.color}`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {item.notes && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {expanded ? "Hide Notes" : "View Notes"}
            </button>
            {expanded && (
              <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50 animate-in fade-in slide-in-from-top-2">
                {item.notes}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-muted/20 border-t border-border px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Push to:
        </span>
        <div className="flex items-center gap-2">
          {integrations.map((platform) => {
            const isPushed = item.pushed_to?.includes(platform);
            const isPushingThis = isPushing === platform;

            return (
              <button
                key={platform}
                onClick={() => handlePush(platform)}
                disabled={isPushed || isPushing !== null}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all ${
                  isPushed
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {isPushingThis ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : isPushed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Send className="h-3 w-3 opacity-70" />
                )}
                {platform}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

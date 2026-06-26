import React from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { getCountdownString } from "../../lib/scheduler";

interface SchedulePanelProps {
  status: "draft" | "published" | "scheduled" | "private";
  onChangeStatus: (status: "draft" | "published" | "scheduled" | "private") => void;
  scheduledAt: string; // ISO String format
  onChangeScheduledAt: (dateIso: string) => void;
}

export const SchedulePanel: React.FC<SchedulePanelProps> = ({
  status,
  onChangeStatus,
  scheduledAt,
  onChangeScheduledAt,
}) => {
  // Convert now to local ISO string for datetime-local minimums
  const nowStr = new Date().toISOString().substring(0, 16);

  const countdown = status === "scheduled" && scheduledAt ? getCountdownString(scheduledAt) : null;

  return (
    <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4 font-sans select-none">
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-200/50 dark:border-zinc-805 pb-1.5">
        <Clock className="h-3.5 w-3.5 text-indigo-500" />
        <span>Publication Controls</span>
      </div>

      {/* Select Box */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Post Status</label>
        <select
          value={status}
          onChange={(e) => onChangeStatus(e.target.value as any)}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="draft">Draft (Unsaved/In Progress)</option>
          <option value="published">Published / Public (Live to Garden)</option>
          <option value="scheduled">Scheduled (Delayed Launch)</option>
          <option value="private">Private (Only Admin Can View)</option>
        </select>
      </div>

      {/* Conditional datetime picker */}
      {status === "scheduled" && (
        <div className="space-y-3 pt-2.5 border-t border-dashed border-zinc-250 dark:border-zinc-800 animate-slide-down">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                <span>Publish Date & Time</span>
              </label>
              
              {countdown && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-mono">
                  {countdown}
                </span>
              )}
            </div>

            <input
              type="datetime-local"
              value={scheduledAt ? scheduledAt.substring(0, 16) : ""}
              min={nowStr}
              onChange={(e) => {
                const selected = e.target.value;
                if (selected) {
                  onChangeScheduledAt(new Date(selected).toISOString());
                }
              }}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2 p-2.5 border border-amber-100 dark:border-amber-950/20 rounded-lg bg-amber-50/50 dark:bg-amber-950/5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Scheduled posts remain invisible to public readers until release. Our system checks and publishes them upon visits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

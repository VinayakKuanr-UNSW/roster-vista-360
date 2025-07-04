
import { EVENT_META } from "./auditTrailMeta";
import type { AuditEvent } from "@/api/models/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";

export default function AuditTrailItem({ event }: { event: AuditEvent }) {
  const meta = EVENT_META[event.status];

  return (
    <li className="flex justify-between">
      {/* icon + labels */}
      <div className="flex gap-4">
        <meta.Icon
          aria-hidden
          size={22}
          strokeWidth={2.3}
          className={cn(meta.color, "audit-trail-icon")}
        />

        <div>
          <p className="text-sm font-medium">{meta.label}</p>
          <p className="text-xs text-slate-400">{meta.sub}</p>
        </div>
      </div>

      {/* semantic time, hidden from screen‑readers to avoid duplication */}
      <time
        aria-hidden="true"
        dateTime={new Date(event.at).toISOString()}
        className="text-xs text-slate-500"
      >
        {formatDistanceToNowStrict(new Date(event.at), { addSuffix: true })}
      </time>
    </li>
  );
}

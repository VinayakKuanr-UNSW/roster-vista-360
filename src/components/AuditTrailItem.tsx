import { EVENT_META } from "./auditTrailMeta";
import type { AuditEvent } from "./AuditTrail";
import { cn } from "@/lib/cn";
import { formatDistanceToNowStrict } from "date-fns";

export default function AuditTrailItem({ event }: { event: AuditEvent }) {
  const meta = EVENT_META[event.status];

  return (
    /* key on the <li> itself for React diffing */
    <li key={event.id} className="flex justify-between">
      {/* icon + labels */}
      <div className="flex gap-4">
        <meta.Icon
          aria-hidden
          size={22}
          strokeWidth={2.3}
          absoluteStrokeWidth
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

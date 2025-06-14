import {
  Plus, Check, FileClock, Users2, UserPlus, Loader2, RotateCcw, Clock,
  Pause, Pencil, Repeat, RotateCw, XCircle, AlertTriangle, Trash2,
  ShieldCheck,
} from "lucide-react";
import type { FC } from "react";

/*───────────────────────────────────────────────────────────*\
 ░█▀▄░█░█░█▀▄░█▀█░█▄█░▀█▀░█░░
 ░█▀▄░█░█░█▀▄░█░█░█░█░░█░░█░░
 ░▀▀░░▀▀▀░▀░▀░▀▀▀░▀░▀░▀▀▀░▀▀▀   All audit‑trail states
\*───────────────────────────────────────────────────────────*/

export type AuditStatus =
  // 1⃣ Creation
  | "created_draft" | "created_final" | "generated_auto"
  // 2⃣ Assignment & bidding
  | "unassigned" | "assigned"
  | "offered_for_bidding" | "bid_pending" | "bid_confirmed"
  // 3⃣ Employee response
  | "accepted" | "declined" | "no_response"
  // 4⃣ Live / in‑shift
  | "confirmed" | "in_progress" | "on_break" | "completed"
  // 5⃣ Edits & reassign
  | "edited_time" | "edited_details" | "reassigned"
  // 6⃣ Swap flow
  | "swap_requested" | "swap_pending" | "swap_approved"
  | "swap_rejected" | "swap_cancelled"
  // 7⃣ Cancellation & no‑show
  | "cancelled_by_employee" | "cancelled_by_admin" | "late_cancellation"
  | "no_show"
  // 8⃣ Deletion
  | "deleted"
  // 9⃣ Post‑shift audit
  | "under_review" | "disputed"
  | "approved_timesheet" | "rejected_timesheet";

/* A11Y colours – AA contrast checked on #131516 background */
const blue400  = "text-sky-400";
const blue500  = "text-sky-500";
const indigo400= "text-indigo-400";
const slGray   = "text-slate-400";
const purple   = "text-violet-400";
const teal400  = "text-teal-400";
const teal500  = "text-teal-500";
const green500 = "text-emerald-500";
const yellow400= "text-amber-400";
const red400   = "text-rose-400";
const red500   = "text-rose-500";
const orange   = "text-orange-400";

export const EVENT_META: Record<
  AuditStatus,
  { label: string; sub: string; color: string; Icon: FC<any> }
> = {
  /* 1 ── Creation ───────────────────────────────────────── */
  created_draft:    { label: "Draft created",   sub: "Template/manual",  color: blue400,  Icon: Plus },
  created_final:    { label: "Shift finalised", sub: "Ready for roster", color: blue500,  Icon: Check },
  generated_auto:   { label: "Auto‑generated",  sub: "Predictive engine",color: blue500,  Icon: FileClock },

  /* 2 ── Assignment & bidding ───────────────────────────── */
  unassigned:       { label: "Unassigned",      sub: "Awaiting assignee",color: slGray,   Icon: Users2 },
  assigned:         { label: "Assigned",        sub: "By manager/system",color: blue500,  Icon: UserPlus },

  offered_for_bidding:{label:"Bidding opened",  sub:"Open shift",        color: yellow400,Icon: RotateCcw },
  bid_pending:      { label: "Bid pending",     sub:"Awaiting approval", color: yellow400,Icon: Loader2 },
  bid_confirmed:    { label: "Bid confirmed",   sub:"Employee assigned", color: green500, Icon: Check },

  /* 3 ── Employee response ─────────────────────────────── */
  accepted:         { label: "Shift accepted",  sub:"By employee",       color: green500, Icon: Check },
  declined:         { label: "Shift declined",  sub:"By employee",       color: red400,   Icon: XCircle },
  no_response:      { label: "No response",     sub:"Bid expired",       color: orange,   Icon: AlertTriangle },

  /* 4 ── Live status ───────────────────────────────────── */
  confirmed:        { label: "Shift confirmed", sub:"Final lock‑in",     color: green500, Icon: ShieldCheck },
  in_progress:      { label: "In progress",     sub:"Clock‑in recorded", color: indigo400,Icon: Clock },
  on_break:         { label: "On break",        sub:"Break clocked",     color: yellow400,Icon: Pause },
  completed:        { label: "Completed",       sub:"Clock‑out done",    color: green500, Icon: Check },

  /* 5 ── Edits & reassign ───────────────────────────────── */
  edited_time:      { label: "Time edited",     sub:"Start/end changed", color: purple,   Icon: Pencil },
  edited_details:   { label: "Details edited",  sub:"Metadata updated",  color: purple,   Icon: Pencil },
  reassigned:       { label: "Re‑assigned",     sub:"New employee",      color: purple,   Icon: Users2 },

  /* 6 ── Swaps ─────────────────────────────────────────── */
  swap_requested:   { label: "Swap requested",  sub:"Employee initiated",color: teal400,  Icon: Repeat },
  swap_pending:     { label: "Swap pending",    sub:"Awaiting accept",   color: teal400,  Icon: Loader2 },
  swap_approved:    { label: "Swap approved",   sub:"Manager/system",    color: teal500,  Icon: Check },
  swap_rejected:    { label: "Swap rejected",   sub:"Declined",          color: teal400,  Icon: XCircle },
  swap_cancelled:   { label: "Swap cancelled",  sub:"Withdrawn",         color: teal400,  Icon: RotateCw },

  /* 7 ── Cancellation & no‑show ────────────────────────── */
  cancelled_by_employee:{label:"Cancelled (emp.)",sub:"Employee",      color: red400,   Icon: XCircle },
  cancelled_by_admin:   {label:"Cancelled (admin)",sub:"Manager/system",color: red400,   Icon: XCircle },
  late_cancellation: { label: "Late cancellation",  sub:"Penalty window",color: red400,   Icon: AlertTriangle },
  no_show:           { label: "No‑show",            sub:"Did not attend",color: red400,   Icon: AlertTriangle },

  /* 8 ── Deletion ─────────────────────────────────────── */
  deleted:           { label: "Shift deleted",      sub:"Removed/archived",color:red500,   Icon: Trash2 },

  /* 9 ── Post‑shift audit ─────────────────────────────── */
  under_review:     { label: "Under review",        sub:"Audit flagged",   color: orange,  Icon: AlertTriangle },
  disputed:         { label: "Disputed",            sub:"Raised by emp.",  color: orange,  Icon: AlertTriangle },
  approved_timesheet:{label:"Timesheet approved",   sub:"Finance/payroll", color: green500,Icon: Check },
  rejected_timesheet:{label:"Timesheet rejected",   sub:"Needs correction",color: red400,  Icon: XCircle },
};

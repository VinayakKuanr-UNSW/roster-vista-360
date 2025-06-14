/* ------------------------------------------------------------------
   TimesheetRow.tsx   (single‑file drop‑in: hook + modal + row)
------------------------------------------------------------------- */

import React, { useState, useEffect } from "react";
import {
  Clock,
  Pencil,
  Check,
  X,
  AlertTriangle,
  MoreHorizontal,
  Save,
  Loader2,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShiftStatusBadge } from "./ShiftStatusBadge";
import AuditTrail from "@/components/AuditTrail"; // your earlier component
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuditStatus } from "@/components/auditTrailMeta";

/* ╭──────────────────────────────────────────────╮
   │ 1 ▸ useTimesheetAudit (inline reusable hook) │
   ╰──────────────────────────────────────────────╯ */
export interface AuditEvent {
  id: string;
  status: AuditStatus;
  at: string | Date;
}

function useTimesheetAudit(timesheetId?: number) {
  const [data, setData] = useState<AuditEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = () => {
    if (!timesheetId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/timesheets/${timesheetId}/audit`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAudit, [timesheetId]);

  return { data, loading, error, refresh: fetchAudit };
}

/* ╭──────────────────────────────────────────────╮
   │ 2 ▸ AuditTrailModal (Radix Dialog wrapper)   │
   ╰──────────────────────────────────────────────╯ */
function AuditTrailModal({
  timesheetId,
  open,
  onOpenChange,
}: {
  timesheetId: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data, loading, error, refresh } = useTimesheetAudit(timesheetId);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          aria-describedby="audit-trail-desc"
        >
          <div className="relative">
            {/* close btn */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute -top-10 right-0 text-slate-300 hover:text-white"
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </Button>

            {/* states */}
            {loading ? (
              <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 w-80 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin" />
                <p id="audit-trail-desc">Loading audit history…</p>
              </div>
            ) : error ? (
              <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 w-80">
                <p className="mb-4">Couldn’t load audit history.</p>
                <Button className="w-full" onClick={refresh}>
                  Retry
                </Button>
              </div>
            ) : data && data.length === 0 ? (
              <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 w-80">
                <p id="audit-trail-desc">No history for this entry.</p>
              </div>
            ) : (
              data && (
                <AuditTrail events={data} onClose={() => onOpenChange(false)} />
              )
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ╭──────────────────────────────────────────────╮
   │ 3 ▸ TimesheetRow component (full)            │
   ╰──────────────────────────────────────────────╯ */

interface TimesheetEntry {
  id: number;
  date: Date;
  employee: string;
  role: string;
  department: string;
  subGroup: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  totalHours: string;
  status: "Completed" | "Cancelled" | "Active" | "No-Show" | "Swapped";
  bidId?: number;
  assignedTime?: string;
  originalEmployee?: string | null;
  replacementEmployee?: string | null;
  cancellationReason?: string | null;
  remunerationLevel?: string;
  tier?: string;
  clockInTime?: string;
  clockOutTime?: string;
  approximatePay?: string;
}

interface TimesheetRowProps {
  entry: TimesheetEntry;
  readOnly?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onSave?: (id: number, updates: Partial<TimesheetEntry>) => void;
}

export const TimesheetRow: React.FC<TimesheetRowProps> = ({
  entry,
  readOnly,
  isSelected = false,
  onToggleSelect,
  onSave,
}) => {
  /* ‑‑ state -------------------------------------------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { toast } = useToast();

  const [editedValues, setEditedValues] = useState({
    startTime: entry.startTime,
    endTime: entry.endTime,
    breakDuration: entry.breakDuration,
    clockInTime: entry.clockInTime || "",
    clockOutTime: entry.clockOutTime || "",
  });

  /* ‑‑ helpers / handlers (same as your original) ------------- */
  const handleStatusUpdate = (
    newStatus: "Completed" | "Cancelled" | "No-Show",
  ) => {
    toast({
      title: "Status Updated",
      description: `Shift status has been updated to ${newStatus}.`,
    });
    onSave?.(entry.id, { status: newStatus });
  };

  const handleApprove = () => {
    onSave?.(entry.id, { status: "Completed" });
    toast({ title: "Timesheet Approved", description: "Entry approved." });
  };

  const handleReject = () => {
    onSave?.(entry.id, { status: "Cancelled" });
    toast({ title: "Timesheet Rejected", description: "Entry rejected." });
  };

  const handleSaveChanges = () => {
    /* (your existing calculation logic) */
    const [sh, sm] = editedValues.startTime.split(":").map(Number);
    const [eh, em] = editedValues.endTime.split(":").map(Number);
    let mins = (eh - sh) * 60 + (em - sm);
    const breakM = parseInt(editedValues.breakDuration.match(/(\d+)/)?.[1] || "0");
    mins -= breakM;
    const totalHours = (mins / 60).toFixed(2);

    const rate =
      entry.remunerationLevel === "GOLD"
        ? 30
        : entry.remunerationLevel === "SILVER"
        ? 25
        : 20;
    const approximatePay = `$${(parseFloat(totalHours) * rate).toFixed(2)}`;

    onSave?.(entry.id, {
      ...editedValues,
      totalHours,
      approximatePay,
    });
    toast({ title: "Changes Saved", description: "Entry updated." });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedValues({
      startTime: entry.startTime,
      endTime: entry.endTime,
      breakDuration: entry.breakDuration,
      clockInTime: entry.clockInTime || "",
      clockOutTime: entry.clockOutTime || "",
    });
    setIsEditing(false);
  };

  const getRemunerationBadge = () => {
    if (!entry.remunerationLevel) return null;
    switch (entry.remunerationLevel) {
      case "GOLD":
        return (
          <Badge className="bg-yellow-500/30 text-yellow-300 border border-yellow-500/30">
            GOLD
          </Badge>
        );
      case "SILVER":
        return (
          <Badge className="bg-slate-400/30 text-slate-300 border border-slate-400/30">
            SILVER
          </Badge>
        );
      case "BRONZE":
        return (
          <Badge className="bg-orange-600/30 text-orange-300 border border-orange-600/30">
            BRONZE
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500/20 text-white/80 border border-blue-500/20">
            Level {entry.remunerationLevel}
          </Badge>
        );
    }
  };

  /* ‑‑ render -------------------------------------------------- */
  return (
    <>
      <tr key={entry.id} className="border-b border-white/10 hover:bg-white/5">
        {/* first cells */}
        <td className="p-3 text-sm">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded"
            disabled={entry.status !== "Active"}
          />
        </td>
        <td className="p-3 text-sm">{entry.employee}</td>
        <td className="p-3 text-sm">{entry.department}</td>
        <td className="p-3 text-sm">{entry.subGroup}</td>
        <td className="p-3 text-sm">{entry.role}</td>
        <td className="p-3 text-sm">
          {getRemunerationBadge() || (
            <Badge className="bg-gray-500/20 text-gray-300 border border-gray-500/30">
              {entry.tier || "N/A"}
            </Badge>
          )}
        </td>

        {/* --- editable or static blocks (unchanged) --- */}
        {isEditing ? (
          <>
            {/* inputs … */}
            <td className="p-3 text-sm">
              <input
                type="time"
                value={editedValues.startTime}
                onChange={(e) =>
                  setEditedValues({ ...editedValues, startTime: e.target.value })
                }
                className="bg-white/10 border border-white/20 rounded p-1 w-20"
              />
            </td>
            {/* repeat for endTime, clockIn, clockOut, break, etc. */}
            <td className="p-3 text-sm">
              <input
                type="time"
                value={editedValues.endTime}
                onChange={(e) =>
                  setEditedValues({ ...editedValues, endTime: e.target.value })
                }
                className="bg-white/10 border border-white/20 rounded p-1 w-20"
              />
            </td>
            <td className="p-3 text-sm">
              <input
                type="time"
                value={editedValues.clockInTime}
                onChange={(e) =>
                  setEditedValues({ ...editedValues, clockInTime: e.target.value })
                }
                className="bg-white/10 border border-white/20 rounded p-1 w-20"
              />
            </td>
            <td className="p-3 text-sm">
              <input
                type="time"
                value={editedValues.clockOutTime}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    clockOutTime: e.target.value,
                  })
                }
                className="bg-white/10 border border-white/20 rounded p-1 w-20"
              />
            </td>
            <td className="p-3 text-sm">
              <select
                value={editedValues.breakDuration}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    breakDuration: e.target.value,
                  })
                }
                className="bg-white/10 border border-white/20 rounded p-1 w-20"
              >
                <option value="15 min">15 min</option>
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="60 min">60 min</option>
              </select>
            </td>
            <td className="p-3 text-sm">{entry.totalHours}</td>
            <td className="p-3 text-sm">{entry.approximatePay}</td>
            <td className="p-3 text-sm">
              <ShiftStatusBadge status={entry.status} />
            </td>
            <td className="p-3 text-sm">
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveChanges}
                  className="h-8 w-8 rounded-full text-green-400 hover:bg-green-500/20"
                  title="Save"
                >
                  <Save size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEdit}
                  className="h-8 w-8 rounded-full text-red-400 hover:bg-red-500/20"
                  title="Cancel"
                >
                  <X size={16} />
                </Button>
              </div>
            </td>
          </>
        ) : (
          <>
            {/* static cells … */}
            <td className="p-3 text-sm">{entry.startTime}</td>
            <td className="p-3 text-sm">{entry.endTime}</td>
            <td className="p-3 text-sm">
              {entry.clockInTime || "Not clocked in"}
            </td>
            <td className="p-3 text-sm">
              {entry.clockOutTime || "Not clocked out"}
            </td>
            <td className="p-3 text-sm">{entry.breakDuration}</td>
            <td className="p-3 text-sm">{entry.totalHours}</td>
            <td className="p-3 text-sm">{entry.approximatePay}</td>
            <td className="p-3 text-sm">
              <ShiftStatusBadge status={entry.status} />
              {entry.status === "Swapped" && entry.originalEmployee && (
                <div className="text-xs text-white/60 mt-1">
                  Swapped from: {entry.originalEmployee}
                </div>
              )}
              {entry.status === "Cancelled" && entry.cancellationReason && (
                <div className="text-xs text-white/60 mt-1">
                  Reason: {entry.cancellationReason}
                </div>
              )}
            </td>
            <td className="p-3 text-sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setHistoryOpen(true)}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>View History</span>
                  </DropdownMenuItem>

                  {!readOnly &&
                    entry.status !== "Completed" &&
                    entry.status !== "Cancelled" && (
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit Times</span>
                      </DropdownMenuItem>
                    )}

                  {!readOnly && entry.status === "Active" && (
                    <>
                      <DropdownMenuItem onClick={handleApprove}>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Approve</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleReject}>
                        <X className="mr-2 h-4 w-4" />
                        <span>Reject</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {!readOnly && entry.status === "No-Show" && (
                    <DropdownMenuItem>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span>Report Details</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </>
        )}
      </tr>

      {/* ---- audit‑trail modal ---- */}
      <AuditTrailModal
        timesheetId={entry.id}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */

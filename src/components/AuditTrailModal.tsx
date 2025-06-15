
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";
import AuditTrail from "@/components/AuditTrail";
import { useTimesheetAudit } from "@/api/hooks/useTimesheetAudit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AuditTrailModal({
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 bg-transparent border-0 shadow-none">
        <DialogTitle asChild>
          <VisuallyHidden>Audit Trail for Timesheet {timesheetId}</VisuallyHidden>
        </DialogTitle>

        <DialogDescription asChild>
          <VisuallyHidden>
            View the complete history of changes and actions for this timesheet entry.
          </VisuallyHidden>
        </DialogDescription>

        {loading ? (
          <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 flex flex-col items-center gap-4 w-80">
            <Loader2 className="animate-spin" />
            <p>Loading audit history…</p>
          </div>
        ) : error ? (
          <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 w-80">
            <p className="mb-4">Couldn't load audit history.</p>
            <Button onClick={refresh} className="w-full">
              Retry
            </Button>
          </div>
        ) : data && data.length === 0 ? (
          <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 w-80">
            <p>No history for this entry.</p>
          </div>
        ) : (
          data && (
            <AuditTrail
              events={data}
              onClose={() => onOpenChange(false)}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

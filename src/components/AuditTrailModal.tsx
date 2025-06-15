
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X, Loader2 } from "lucide-react";
import AuditTrail from "@/components/AuditTrail";
import { useTimesheetAudit } from "@/api/hooks/useTimesheetAudit";
import { Button } from "@/components/ui/button";

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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          aria-describedby="audit-trail-desc"
        >
          {/* MUST be direct child of Dialog.Content */}
          <Dialog.Title asChild>
            <VisuallyHidden>Audit Trail for Timesheet {timesheetId}</VisuallyHidden>
          </Dialog.Title>

          <Dialog.Description asChild>
            <VisuallyHidden>
              View the complete history of changes and actions for this timesheet entry.
            </VisuallyHidden>
          </Dialog.Description>

          <div className="relative">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute -top-10 right-0 text-slate-300 hover:text-white"
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </Button>

            {/* Loading State */}
            {loading ? (
              <div
                className="bg-[#131516] text-slate-100 rounded-2xl p-8
                           flex flex-col items-center gap-4 w-80"
              >
                <Loader2 className="animate-spin" />
                <p>Loading audit history…</p>
              </div>

            {/* Error State */}
            ) : error ? (
              <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 w-80">
                <p className="mb-4">Couldn't load audit history.</p>
                <Button onClick={refresh} className="w-full">
                  Retry
                </Button>
              </div>

            {/* Empty State */}
            ) : data && data.length === 0 ? (
              <div className="bg-[#131516] text-slate-100 rounded-2xl p-8 w-80">
                <p>No history for this entry.</p>
              </div>

            {/* Success State */}
            ) : (
              data && (
                <AuditTrail
                  events={data}
                  onClose={() => onOpenChange(false)}
                />
              )
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

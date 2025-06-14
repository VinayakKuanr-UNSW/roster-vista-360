import { AuditEvent } from '@/api/models/types';
import AuditTrailItem from './AuditTrailItem';
import { X } from 'lucide-react';

export default function AuditTrail({
  events,
  onClose,
}: {
  events: AuditEvent[];
  onClose: () => void;
}) {
  if (!events?.length) return null;

  const sorted = [...events].sort(
    (a, b) => +new Date(b.at) - +new Date(a.at),
  );

  return (
    <div
      role="dialog"
      aria-labelledby="audit-trail-title"
      className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm"
    >
      <div className="bg-[#131516] text-slate-100 rounded-2xl shadow-xl w-80 max-h-[80vh] p-6">
        <header className="flex items-center justify-between mb-6">
          <h2 id="audit-trail-title" className="text-xl font-semibold">
            Audit Trail
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 rounded"
          >
            <X size={20} />
            <span className="sr-only">Close audit trail</span>
          </button>
        </header>

        <ul className="space-y-5 overflow-y-auto pr-1">
          {sorted.map((event) => (
            <AuditTrailItem key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}

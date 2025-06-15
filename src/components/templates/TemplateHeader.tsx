
// TemplateHeader.tsx • 2025‑04‑21 (responsive range‑picker)
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

/** simple custom hook for (min‑width) media queries */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const handler = () => setMatches(m.matches);
    handler();
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

/* ------------------------------------------------------------------ */
/* types                                                               */
/* ------------------------------------------------------------------ */

type DateRange = { start: Date; end: Date };

interface TemplateMeta {
  id: number;
  name: string;
  status: 'draft' | 'published';
  updatedAt?: string;
  groups?: unknown[]; // replace with Shift[] if desired
}

interface TemplateHeaderProps {
  currentTemplate: TemplateMeta | null;

  onSaveAsDraft: () => Promise<void>;
  onPublish: (range: DateRange, override: boolean) => Promise<void>;
  onExportToPdf: () => Promise<void>;
  onAddGroup: () => void;

  /* optional callbacks */
  onSavedDraft?: () => void;
  checkDateRangeConflict?: (range: DateRange) => Promise<boolean>;
}

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  currentTemplate,
  onSaveAsDraft,
  onPublish,
  onExportToPdf,
  onAddGroup,
  onSavedDraft,
  checkDateRangeConflict,
}) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const isGlass = theme === 'glass';

  /* ───────────────── sticky shadow ───────────────── */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  /* ───────────────── common flags ───────────────── */
  const hasTemplate = !!currentTemplate;
  const hasContent = !!currentTemplate?.groups?.length;

  /* ───────────────── save draft ───────────────── */
  const [saving, setSaving] = useState(false);
  const handleSaveDraft = async () => {
    if (!hasTemplate || saving) return;
    setSaving(true);
    try {
      await onSaveAsDraft();
      toast({ title: 'Draft saved' });
      onSavedDraft?.();
    } catch {
      toast({ title: 'Failed to save draft', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  /* ───────────────── publish flow ───────────────── */
  const [pubOpen, setPubOpen] = useState(false);
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
  const [checking, setChecking] = useState(false);
  const [conflict, setConflict] = useState(false);

  const startPublish = () => hasTemplate && setPubOpen(true);

  const doPublish = async (override = false) => {
    if (!range?.from || !range?.to) return;
    setChecking(true);
    try {
      const dateRange = { start: range.from, end: range.to };
      if (!override && (await checkDateRangeConflict?.(dateRange))) {
        setConflict(true);
        setChecking(false);
        return;
      }
      await onPublish(dateRange, override);
      toast({ title: 'Template published' });
      setPubOpen(false);
    } catch {
      toast({ title: 'Publish failed', variant: 'destructive' });
    } finally {
      setChecking(false);
      setConflict(false);
    }
  };

  /* ───────────────── export PDF ───────────────── */
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    if (!hasTemplate || !hasContent || exporting) return;
    setExporting(true);
    try {
      if (onExportToPdf) {
        await onExportToPdf();
      } else {
        const el = document.getElementById('template-canvas');
        // @ts-ignore dynamic import fallback
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().from(el).save(`${currentTemplate!.name}.pdf`);
      }
      toast({ title: 'PDF exported' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Export failed', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  /* ───────────────── keyboard shortcut ───────────────── */
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  /* utility for buttons with tooltips */
  const ActionBtn: React.FC<{
    label: string;
    onClick: () => void;
    disabled: boolean;
    loading?: boolean;
    variant?: 'default' | 'outline' | 'glass';
    tooltip?: string;
  }> = ({ label, onClick, disabled, loading, variant, tooltip }) => (
    <Tooltip>
      <TooltipTrigger asChild disabled={!disabled}>
        <span>
          <Button
            onClick={onClick}
            disabled={disabled || loading}
            variant={variant}
            className={cn(disabled && 'pointer-events-none')}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {label}
          </Button>
        </span>
      </TooltipTrigger>
      {disabled && tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  );

  /* ------------------------------------------------------------------ */
  /* render                                                              */
  /* ------------------------------------------------------------------ */

  const isWide = useMediaQuery('(min-width: 640px)');

  return (
    <TooltipProvider>
      {/* Sticky header */}
      <div
        className={cn(
          'sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 transition-shadow',
          scrolled && 'shadow-sm'
        )}
      >
        {/* left side */}
        <div>
          <h1 className="text-2xl font-bold">Template Management</h1>
          {currentTemplate && (
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span className="truncate max-w-[220px]">
                Editing&nbsp;<strong>{currentTemplate.name}</strong>
              </span>
              <Badge
                variant={
                  currentTemplate.status === 'published'
                    ? 'default'
                    : 'secondary'
                }
                className="capitalize"
              >
                {currentTemplate.status}
              </Badge>
              {currentTemplate.updatedAt && (
                <>
                  <CalendarIcon className="ml-1 h-4 w-4" />
                  <span>
                    {format(new Date(currentTemplate.updatedAt), 'MMM d, yyyy')}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* action buttons */}
        <div className="flex flex-wrap gap-2">
          <ActionBtn
            label="Save as Draft"
            onClick={handleSaveDraft}
            disabled={!hasTemplate}
            loading={saving}
            variant={isGlass ? 'glass' : 'outline'}
            tooltip="Load or create a template first"
          />
          <ActionBtn
            label="Publish"
            onClick={startPublish}
            disabled={!hasTemplate}
            variant={isGlass ? 'glass' : 'outline'}
            tooltip="Load or create a template first"
          />
          <ActionBtn
            label="Export to PDF"
            onClick={handleExport}
            disabled={!hasTemplate || !hasContent}
            loading={exporting}
            variant={isGlass ? 'glass' : 'outline'}
            tooltip={
              !hasTemplate
                ? 'Load a template first'
                : 'Add at least one group before export'
            }
          />
          <ActionBtn
            label="Add Group"
            onClick={onAddGroup}
            disabled={!hasTemplate}
            variant={isGlass ? 'glass' : 'default'}
            tooltip="Load or create a template first"
          />
        </div>
      </div>

      {/* ───────────────── Publish Dialog ───────────────── */}
      <Dialog open={pubOpen} onOpenChange={setPubOpen}>
        {/* wider card on ≥ sm screens */}
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Publish template</DialogTitle>
            <DialogDescription>
              Select the date range this template should apply to.
            </DialogDescription>
          </DialogHeader>

          {/* overflow wrapper to prevent burst on tiny screens */}
          <div className="py-4 overflow-x-auto">
            <CalendarPicker
              mode="range"
              numberOfMonths={isWide ? 2 : 1}
              selected={range}
              onSelect={(dateRange) => {
                if (dateRange) {
                  setRange(dateRange);
                }
              }}
              initialFocus
              className="mx-auto"
            />
            {range?.from && range?.to && (
              <p className="mt-3 text-sm text-muted-foreground text-center">
                {range.from.toLocaleDateString()} &rarr;{' '}
                {range.to.toLocaleDateString()}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPubOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!range?.from || !range?.to || checking}
              onClick={() => doPublish(false)}
            >
              {checking && (
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ───────────────── conflict override dialog ───────────────── */}
      <AlertDialog open={conflict} onOpenChange={setConflict}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Existing template detected</AlertDialogTitle>
            <AlertDialogDescription>
              Another published template overlaps this date range. Continuing
              will override those days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => doPublish(true)}>
              Continue &amp; Override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default TemplateHeader;

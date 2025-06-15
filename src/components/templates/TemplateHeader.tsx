
// TemplateHeader.tsx • 2025‑04‑21 (enhanced range‑picker with modern UI)
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, CheckCircle } from 'lucide-react';

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
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

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

type DateRangeInternal = { start: Date; end: Date };

interface TemplateMeta {
  id: number;
  name: string;
  status: 'draft' | 'published';
  updatedAt?: string;
  groups?: unknown[];
}

interface TemplateHeaderProps {
  currentTemplate: TemplateMeta | null;

  onSaveAsDraft: () => Promise<void>;
  onPublish: (range: DateRangeInternal, override: boolean) => Promise<void>;
  onExportToPdf: () => Promise<void>;
  onAddGroup: () => void;

  /* optional callbacks */
  onSavedDraft?: () => void;
  checkDateRangeConflict?: (range: DateRangeInternal) => Promise<boolean>;
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
      toast({ title: 'Draft saved successfully', description: 'Your changes have been saved.' });
      onSavedDraft?.();
    } catch {
      toast({ title: 'Failed to save draft', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  /* ───────────────── publish flow ───────────────── */
  const [pubOpen, setPubOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
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
      toast({ 
        title: 'Template published successfully', 
        description: `Published for ${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d, yyyy')}` 
      });
      setPubOpen(false);
      setRange(undefined);
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
      toast({ title: 'PDF exported successfully' });
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

      {/* ───────────────── Enhanced Publish Dialog ───────────────── */}
      <Dialog open={pubOpen} onOpenChange={setPubOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl">Publish Template</DialogTitle>
            <DialogDescription className="text-base">
              Select the date range this template should apply to. The template will be active during this period.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Date Range</label>
              <DateRangePicker
                value={range}
                onChange={setRange}
                placeholder="Select start and end dates"
                className="w-full"
              />
            </div>

            {range?.from && range?.to && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Selected Period</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Template will be active from <strong>{format(range.from, 'MMMM d, yyyy')}</strong> to{' '}
                  <strong>{format(range.to, 'MMMM d, yyyy')}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Duration: {Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setPubOpen(false);
                setRange(undefined);
              }}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              disabled={!range?.from || !range?.to || checking}
              onClick={() => doPublish(false)}
              className="flex-1 sm:flex-none"
            >
              {checking && (
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
              )}
              Publish Template
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
        </AlertDialogFooter>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default TemplateHeader;

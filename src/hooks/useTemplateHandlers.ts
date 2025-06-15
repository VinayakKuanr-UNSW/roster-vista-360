
import { useCallback } from 'react';
import { Template, Group, Shift } from '@/api/models/types';

interface UseTemplateHandlersProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  currentTemplate: Template | null;
  setCurrentTemplate: React.Dispatch<React.SetStateAction<Template | null>>;
  newGroup: { name: string; color: string };
  setNewGroup: React.Dispatch<React.SetStateAction<{ name: string; color: string }>>;
  setIsAddGroupDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
}

export const useTemplateHandlers = ({
  templates,
  setTemplates,
  currentTemplate,
  setCurrentTemplate,
  newGroup,
  setNewGroup,
  setIsAddGroupDialogOpen,
  toast,
}: UseTemplateHandlersProps) => {
  /* -------------------------------------------------- */
  /* CRUD helpers                                       */
  /* -------------------------------------------------- */
  const withTemplate = useCallback((cb: (tpl: Template) => Template) => {
    setCurrentTemplate((prev) => (prev ? cb(prev) : prev));
    setTemplates((prev) =>
      prev.map((t) =>
        currentTemplate && t.id === currentTemplate.id ? cb(t) : t
      )
    );
  }, [currentTemplate, setCurrentTemplate, setTemplates]);

  /* ➌ Add Group */
  const handleAddGroup = useCallback(() => {
    if (!currentTemplate) return;
    if (!newGroup.name.trim()) {
      toast({
        title: 'Error',
        description: 'Enter a group name',
        variant: 'destructive',
      });
      return;
    }
    const group: Group = {
      id: Date.now(),
      name: newGroup.name,
      color: newGroup.color,
      subGroups: [],
    };
    withTemplate((tpl) => ({
      ...tpl,
      updatedAt: new Date().toISOString(),
      groups: [...tpl.groups, group],
    }));
    toast({ title: 'Success', description: `Added group "${newGroup.name}"` });
    setIsAddGroupDialogOpen(false);
    setNewGroup({ name: '', color: 'blue' });
  }, [currentTemplate, newGroup, withTemplate, toast, setIsAddGroupDialogOpen, setNewGroup]);

  /* ➍ Update Group */
  const handleUpdateGroup = useCallback((id: number, updates: Partial<Group>) =>
    withTemplate((tpl) => ({
      ...tpl,
      groups: tpl.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })), [withTemplate]);

  /* ➎ Delete Group */
  const handleDeleteGroup = useCallback((id: number) => {
    if (!currentTemplate) return;
    if (!window.confirm('Delete this group?')) return;
    withTemplate((tpl) => ({
      ...tpl,
      groups: tpl.groups.filter((g) => g.id !== id),
    }));
    toast({ title: 'Deleted group' });
  }, [currentTemplate, withTemplate, toast]);

  /* ➏ Clone Group */
  const handleCloneGroup = useCallback((id: number) => {
    if (!currentTemplate) return;
    const g = currentTemplate.groups.find((x) => x.id === id);
    if (!g) return;
    const clone: Group = {
      ...g,
      id: Date.now(),
      name: `${g.name} (Copy)`,
      subGroups: g.subGroups.map((s) => ({
        ...s,
        id: Date.now() + Math.random(),
      })),
    };
    withTemplate((tpl) => ({ ...tpl, groups: [...tpl.groups, clone] }));
    toast({ title: 'Cloned group' });
  }, [currentTemplate, withTemplate, toast]);

  /* ➐ Add Sub‑group */
  const handleAddSubGroup = useCallback((gid: number, name: string) => {
    if (!name.trim())
      return toast({
        title: 'Sub‑group name required',
        variant: 'destructive',
      });
    withTemplate((tpl) => ({
      ...tpl,
      groups: tpl.groups.map((g) =>
        g.id === gid
          ? {
              ...g,
              subGroups: [...g.subGroups, { id: Date.now(), name, shifts: [] }],
            }
          : g
      ),
    }));
  }, [withTemplate, toast]);

  /* ➒ Re‑order groups */
  const handleReorderGroups = useCallback((src: number, dest: number) =>
    withTemplate((tpl) => {
      const arr = [...tpl.groups];
      const [moved] = arr.splice(src, 1);
      arr.splice(dest, 0, moved);
      return { ...tpl, groups: arr };
    }), [withTemplate]);

  /* ---------- Template‑level actions ---------- */

  const handleSaveAsDraft = useCallback(async () => {
    toast({ title: 'Template saved as draft (mock)' });
  }, [toast]);

  const handlePublish = useCallback(async (dateRange: { start: Date; end: Date }, override: boolean) => {
    if (!currentTemplate) return;
    
    // Create the template header meta object with proper typing
    const templateMeta = {
      id: currentTemplate.id,
      name: currentTemplate.name,
      status: 'published' as const,
      updatedAt: new Date().toISOString(),
      groups: currentTemplate.groups,
    };
    
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === currentTemplate.id
          ? {
              ...t,
              status: 'published' as const,
              start_date: dateRange.start.toISOString(),
              end_date: dateRange.end.toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    
    setCurrentTemplate((prev) => prev ? {
      ...prev,
      status: 'published' as const,
      updatedAt: new Date().toISOString(),
    } : null);
    
    toast({
      title: 'Published',
      description: `${dateRange.start.toLocaleDateString()} → ${dateRange.end.toLocaleDateString()}`,
    });
  }, [currentTemplate, setTemplates, setCurrentTemplate, toast]);

  const handleExportToPdf = useCallback(async () => {
    toast({ title: 'Export', description: 'Pretend PDF was generated' });
  }, [toast]);

  /* ---------- TemplatesLibrary handlers ---------- */

  const handleDeleteTemplate = useCallback(async (id: string) => {
    const numericId = parseInt(id);
    setTemplates((prev) => prev.filter((t) => t.id !== numericId));
    if (currentTemplate?.id === numericId) setCurrentTemplate(null);
    toast({ title: 'Template deleted' });
  }, [setTemplates, currentTemplate, setCurrentTemplate, toast]);

  const handleDuplicateTemplate = useCallback(async (id: string) => {
    const numericId = parseInt(id);
    const tpl = templates.find((t) => t.id === numericId);
    if (!tpl) return;
    const copy: Template = {
      ...tpl,
      id: Date.now(),
      name: `${tpl.name} (Copy)`,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, copy]);
    setCurrentTemplate(copy); // auto‑select new copy
    toast({ title: 'Duplicated draft created' });
  }, [templates, setTemplates, setCurrentTemplate, toast]);

  const handleBulkShiftUpdate = useCallback(async (ids: string[], updates: Partial<Shift>) => {
    toast({
      title: 'Bulk shift update (mock)',
      description: `${ids.length} shift ids`,
    });
  }, [toast]);

  return {
    handleAddGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    handleCloneGroup,
    handleAddSubGroup,
    handleReorderGroups,
    handleSaveAsDraft,
    handlePublish,
    handleExportToPdf,
    handleDeleteTemplate,
    handleDuplicateTemplate,
    handleBulkShiftUpdate,
  };
};

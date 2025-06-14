// src/pages/TemplatesPage.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Template, Group, Shift } from '@/api/models/types';

// Sidebar (library)
import TemplatesLibrary from '@/components/templates/TemplatesLibrary';

// Editor header + content
import TemplateHeader from '@/components/templates/TemplateHeader';
import TemplateContent from '@/components/templates/TemplateContent';

// Add‑group dialog
import AddGroupDialog from '@/components/templates/AddGroupDialog';

// Simple skeleton while loading mock data
const EditorSkeleton = () => (
  <div className="flex-1 p-6 space-y-4">
    <div className="h-12 w-1/2 bg-muted/40 animate-pulse rounded" />
    <div className="h-40 bg-muted/40 animate-pulse rounded" />
  </div>
);

const TemplatesPage: React.FC = () => {
  /* -------------------------------------------------- */
  /* state                                              */
  /* -------------------------------------------------- */
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', color: 'blue' });

  const { toast } = useToast();

  /* -------------------------------------------------- */
  /* mock fetch                                         */
  /* -------------------------------------------------- */
  useEffect(() => {
    // simulate fetch delay
    const timeout = setTimeout(() => {
      import('./mockTemplates.json').then((m) => {
        setTemplates(m.default as Template[]);
        setCurrentTemplate(m.default[0]);
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  /* -------------------------------------------------- */
  /* CRUD helpers                                       */
  /* -------------------------------------------------- */
  const withTemplate = (cb: (tpl: Template) => Template) => {
    setCurrentTemplate((prev) => (prev ? cb(prev) : prev));
    setTemplates((prev) =>
      prev.map((t) =>
        currentTemplate && t.id === currentTemplate.id ? cb(t) : t
      )
    );
  };

  /* ➌ Add Group */
  const handleAddGroup = () => {
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
    toast({ title: 'Success', description: `Added group “${newGroup.name}”` });
    setIsAddGroupDialogOpen(false);
    setNewGroup({ name: '', color: 'blue' });
  };

  /* ➍ Update Group */
  const handleUpdateGroup = (id: number, updates: Partial<Group>) =>
    withTemplate((tpl) => ({
      ...tpl,
      groups: tpl.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));

  /* ➎ Delete Group */
  const handleDeleteGroup = (id: number) => {
    if (!currentTemplate) return;
    if (!window.confirm('Delete this group?')) return;
    withTemplate((tpl) => ({
      ...tpl,
      groups: tpl.groups.filter((g) => g.id !== id),
    }));
    toast({ title: 'Deleted group' });
  };

  /* ➏ Clone Group */
  const handleCloneGroup = (id: number) => {
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
  };

  /* ➐ Add Sub‑group */
  const handleAddSubGroup = (gid: number, name: string) => {
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
  };

  /* ➒ Re‑order groups */
  const handleReorderGroups = (src: number, dest: number) =>
    withTemplate((tpl) => {
      const arr = [...tpl.groups];
      const [moved] = arr.splice(src, 1);
      arr.splice(dest, 0, moved);
      return { ...tpl, groups: arr };
    });

  /* ---------- Template‑level actions ---------- */

  const handleSaveAsDraft = () =>
    toast({ title: 'Template saved as draft (mock)' });

  const handlePublish = async (
    id: string,
    dateRange: { start: Date; end: Date },
    _apply: boolean
  ) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'published',
              start_date: dateRange.start.toISOString(),
              end_date: dateRange.end.toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    toast({
      title: 'Published',
      description: `${dateRange.start.toLocaleDateString()} → ${dateRange.end.toLocaleDateString()}`,
    });
  };

  const handleExportToPdf = () =>
    toast({ title: 'Export', description: 'Pretend PDF was generated' });

  /* ---------- TemplatesLibrary handlers ---------- */

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (currentTemplate?.id === id) setCurrentTemplate(null);
    toast({ title: 'Template deleted' });
  };

  const handleDuplicateTemplate = (id: string) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    const copy: Template = {
      ...tpl,
      id: `${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, copy]);
    setCurrentTemplate(copy); // auto‑select new copy
    toast({ title: 'Duplicated draft created' });
  };

  const handleBulkShiftUpdate = (ids: string[]) =>
    toast({
      title: 'Bulk shift update (mock)',
      description: `${ids.length} shift ids`,
    });

  /* -------------------------------------------------- */
  /* Render                                             */
  /* -------------------------------------------------- */
  return (
    <div className="flex h-full">
      <TemplatesLibrary
        initialTemplates={templates}
        onDelete={handleDeleteTemplate}
        onPublish={handlePublish}
        onDuplicate={handleDuplicateTemplate}
        onBulkShiftUpdate={handleBulkShiftUpdate}
        /* optional — implement in TemplatesLibrary if you like */
        onSelectTemplate={(id) => {
          const tpl = templates.find((t) => t.id === id);
          if (tpl) setCurrentTemplate(tpl);
        }}
      />

      {/* Editor Pane */}
      <Suspense fallback={<EditorSkeleton />}>
        <div className="relative flex-1 overflow-auto p-6">
          {currentTemplate && (
            <>
              <TemplateHeader
                currentTemplate={currentTemplate}
                onSaveAsDraft={handleSaveAsDraft}
                onPublish={handlePublish}
                onExportToPdf={handleExportToPdf}
                onAddGroup={() => setIsAddGroupDialogOpen(true)}
              />

              <TemplateContent
                template={currentTemplate}
                onUpdateGroup={handleUpdateGroup}
                onDeleteGroup={handleDeleteGroup}
                onCloneGroup={handleCloneGroup}
                onAddSubGroup={handleAddSubGroup}
                onReorderGroups={handleReorderGroups}
              />
            </>
          )}

          {/* Floating “Add Group” button */}
          {currentTemplate && (
            <button
              onClick={() => setIsAddGroupDialogOpen(true)}
              className="fixed bottom-6 right-6 z-20 h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-colors"
            >
              +
            </button>
          )}

          <AddGroupDialog
            isOpen={isAddGroupDialogOpen}
            onOpenChange={setIsAddGroupDialogOpen}
            newGroup={newGroup}
            setNewGroup={setNewGroup}
            onAddGroup={handleAddGroup}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default TemplatesPage;

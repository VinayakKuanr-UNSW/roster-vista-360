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
        const mockData = m.default as any[];
        // Convert mock data to proper Template format
        const convertedTemplates: Template[] = mockData.map((item) => ({
          ...item,
          id: parseInt(item.id), // Convert string id to number
          status: item.status as 'draft' | 'published', // Ensure proper type
        }));
        setTemplates(convertedTemplates);
        setCurrentTemplate(convertedTemplates[0]);
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
    toast({ title: 'Success', description: `Added group "${newGroup.name}"` });
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

  const handleSaveAsDraft = async () => {
    toast({ title: 'Template saved as draft (mock)' });
  };

  const handlePublish = async (dateRange: { start: Date; end: Date }, override: boolean) => {
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
  };

  const handleExportToPdf = async () => {
    toast({ title: 'Export', description: 'Pretend PDF was generated' });
  };

  /* ---------- TemplatesLibrary handlers ---------- */

  const handleDeleteTemplate = async (id: string) => {
    const numericId = parseInt(id);
    setTemplates((prev) => prev.filter((t) => t.id !== numericId));
    if (currentTemplate?.id === numericId) setCurrentTemplate(null);
    toast({ title: 'Template deleted' });
  };

  const handleDuplicateTemplate = async (id: string) => {
    const numericId = parseInt(id);
    const tpl = templates.find((t) => t.id === numericId);
    if (!tpl) return;
    const copy: Template = {
      ...tpl,
      id: Date.now(),
      name: `${tpl.name} (Copy)`,
      status: 'draft' as 'draft' | 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, copy]);
    setCurrentTemplate(copy); // auto‑select new copy
    toast({ title: 'Duplicated draft created' });
  };

  const handleBulkShiftUpdate = async (ids: string[], updates: Partial<Shift>) => {
    toast({
      title: 'Bulk shift update (mock)',
      description: `${ids.length} shift ids`,
    });
  };

  /* -------------------------------------------------- */
  /* Render                                             */
  /* -------------------------------------------------- */
  return (
    <div className="flex h-full">
      <TemplatesLibrary
        initialTemplates={templates}
        onDelete={handleDeleteTemplate}
        onPublish={async (id: string, dateRange: { start: Date; end: Date; }, _apply: boolean) => {
          // This handler is not actually used since TemplatesLibrary doesn't have onSelectTemplate
          await handlePublish(dateRange, false);
        }}
        onDuplicate={handleDuplicateTemplate}
        onBulkShiftUpdate={handleBulkShiftUpdate}
      />

      {/* Editor Pane */}
      <Suspense fallback={<EditorSkeleton />}>
        <div className="relative flex-1 overflow-auto p-6">
          {currentTemplate && (
            <>
              <TemplateHeader
                currentTemplate={{
                  id: currentTemplate.id,
                  name: currentTemplate.name,
                  status: currentTemplate.status,
                  updatedAt: currentTemplate.updatedAt,
                  groups: currentTemplate.groups,
                }}
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

          {/* Floating "Add Group" button */}
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

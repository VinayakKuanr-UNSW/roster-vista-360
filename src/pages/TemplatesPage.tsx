
// src/pages/TemplatesPage.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Template } from '@/api/models/types';

// Sidebar (library)
import TemplatesLibrary from '@/components/templates/TemplatesLibrary';

// Editor header + content
import TemplateHeader from '@/components/templates/TemplateHeader';
import TemplateContent from '@/components/templates/TemplateContent';

// Add‑group dialog
import AddGroupDialog from '@/components/templates/AddGroupDialog';

// Template handlers
import { useTemplateHandlers } from '@/hooks/useTemplateHandlers';

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
  /* Use template handlers hook                         */
  /* -------------------------------------------------- */
  const {
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
  } = useTemplateHandlers({
    templates,
    setTemplates,
    currentTemplate,
    setCurrentTemplate,
    newGroup,
    setNewGroup,
    setIsAddGroupDialogOpen,
    toast,
  });

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

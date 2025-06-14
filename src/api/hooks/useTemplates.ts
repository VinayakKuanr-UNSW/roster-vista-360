
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { templatesService } from '../services/templatesService';
import { Template, Group, SubGroup, Shift } from '../models/types';

export const useTemplates = () => {
  const queryClient = useQueryClient();

  // Get all templates
  const useAllTemplates = () => {
    return useQuery({
      queryKey: ['templates'],
      queryFn: templatesService.getAllTemplates
    });
  };

  // Get template by ID
  const useTemplateById = (id: number) => {
    return useQuery({
      queryKey: ['templates', id],
      queryFn: () => templatesService.getTemplateById(id),
      enabled: !!id
    });
  };

  // Create template
  const useCreateTemplate = () => {
    return useMutation({
      mutationFn: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => 
        templatesService.createTemplate(template),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['templates'] });
      }
    });
  };

  // Update template
  const useUpdateTemplate = () => {
    return useMutation({
      mutationFn: ({ id, updates }: { id: number; updates: Partial<Template> }) =>
        templatesService.updateTemplate(id, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Delete template
  const useDeleteTemplate = () => {
    return useMutation({
      mutationFn: (id: number) => templatesService.deleteTemplate(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['templates'] });
      }
    });
  };

  // Add group to template
  const useAddGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, group }: { templateId: number; group: Omit<Group, 'id'> }) =>
        templatesService.addGroup(templateId, group),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Update group in template
  const useUpdateGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, updates }: { templateId: number; groupId: number; updates: Partial<Group> }) =>
        templatesService.updateGroup(templateId, groupId, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Delete group from template
  const useDeleteGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId }: { templateId: number; groupId: number }) =>
        templatesService.deleteGroup(templateId, groupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Clone group in template
  const useCloneGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId }: { templateId: number; groupId: number }) =>
        templatesService.cloneGroup(templateId, groupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Add subgroup to template
  const useAddSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroup }: { templateId: number; groupId: number; subGroup: Omit<SubGroup, 'id'> }) =>
        templatesService.addSubGroup(templateId, groupId, subGroup),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Update subgroup in template
  const useUpdateSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, updates }: 
        { templateId: number; groupId: number; subGroupId: number; updates: Partial<SubGroup> }) =>
        templatesService.updateSubGroup(templateId, groupId, subGroupId, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Delete subgroup from template
  const useDeleteSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId }: { templateId: number; groupId: number; subGroupId: number }) =>
        templatesService.deleteSubGroup(templateId, groupId, subGroupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Clone subgroup in template
  const useCloneSubGroup = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId }: { templateId: number; groupId: number; subGroupId: number }) =>
        templatesService.cloneSubGroup(templateId, groupId, subGroupId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Add shift to template
  const useAddShift = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, shift }: 
        { templateId: number; groupId: number; subGroupId: number; shift: Omit<Shift, 'id'> }) =>
        templatesService.addShift(templateId, groupId, subGroupId, shift),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Update shift in template
  const useUpdateShift = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, shiftId, updates }: 
        { templateId: number; groupId: number; subGroupId: number; shiftId: string; updates: Partial<Shift> }) =>
        templatesService.updateShift(templateId, groupId, subGroupId, shiftId, updates),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Delete shift from template
  const useDeleteShift = () => {
    return useMutation({
      mutationFn: ({ templateId, groupId, subGroupId, shiftId }: 
        { templateId: number; groupId: number; subGroupId: number; shiftId: string }) =>
        templatesService.deleteShift(templateId, groupId, subGroupId, shiftId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Save template as draft
  const useSaveAsDraft = () => {
    return useMutation({
      mutationFn: (templateId: number) => templatesService.saveAsDraft(templateId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Publish template
  const usePublishTemplate = () => {
    return useMutation({
      mutationFn: (templateId: number) => templatesService.publishTemplate(templateId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['templates'] });
          queryClient.invalidateQueries({ queryKey: ['templates', data.id] });
        }
      }
    });
  };

  // Export template to PDF
  const useExportTemplateToPdf = () => {
    return useMutation({
      mutationFn: (templateId: number) => templatesService.exportTemplateToPdf(templateId)
    });
  };

  return {
    // Queries
    useAllTemplates,
    useTemplateById,
    
    // Direct methods
    getAllTemplates: templatesService.getAllTemplates,
    getTemplateById: templatesService.getTemplateById,
    createTemplate: templatesService.createTemplate,
    updateTemplate: templatesService.updateTemplate,
    deleteTemplate: templatesService.deleteTemplate,
    addGroup: templatesService.addGroup,
    updateGroup: templatesService.updateGroup,
    deleteGroup: templatesService.deleteGroup,
    cloneGroup: templatesService.cloneGroup,
    addSubGroup: templatesService.addSubGroup,
    updateSubGroup: templatesService.updateSubGroup,
    deleteSubGroup: templatesService.deleteSubGroup,
    cloneSubGroup: templatesService.cloneSubGroup,
    addShift: templatesService.addShift,
    updateShift: templatesService.updateShift,
    deleteShift: templatesService.deleteShift,
    saveAsDraft: templatesService.saveAsDraft,
    publishTemplate: templatesService.publishTemplate,
    exportTemplateToPdf: templatesService.exportTemplateToPdf,
    
    // Mutations
    useCreateTemplate,
    useUpdateTemplate,
    useDeleteTemplate,
    useAddGroup,
    useUpdateGroup,
    useDeleteGroup,
    useCloneGroup,
    useAddSubGroup,
    useUpdateSubGroup,
    useDeleteSubGroup,
    useCloneSubGroup,
    useAddShift,
    useUpdateShift,
    useDeleteShift,
    useSaveAsDraft,
    usePublishTemplate,
    useExportTemplateToPdf
  };
};

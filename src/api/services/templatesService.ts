
import { Group, SubGroup, Template, DBTemplate, Shift, DepartmentName, DepartmentColor } from '../models/types';
import { templates as mockTemplates } from '../data/mockData';
import { supabase } from '@/integrations/supabase/client';

// Convert DB template to app template
const dbToAppTemplate = (dbTemplate: DBTemplate): Template => {
  // Parse groups if it's a string
  let parsedGroups = dbTemplate.groups;
  if (typeof parsedGroups === 'string') {
    try {
      parsedGroups = JSON.parse(parsedGroups as string);
    } catch (e) {
      parsedGroups = [];
    }
  }

  return {
    id: dbTemplate.template_id,
    name: dbTemplate.name,
    description: dbTemplate.description,
    groups: parsedGroups as Group[] || [],
    createdAt: dbTemplate.created_at,
    updatedAt: dbTemplate.updated_at,
    department_id: dbTemplate.department_id,
    sub_department_id: dbTemplate.sub_department_id,
    start_date: dbTemplate.start_date,
    end_date: dbTemplate.end_date,
    status: (dbTemplate.status === 'published' ? 'published' : 'draft') as 'draft' | 'published'
  };
};

// Local storage for templates - in a real app this would be a database
let templates = [...mockTemplates];

export const templatesService = {
  getAllTemplates: async (): Promise<Template[]> => {
    try {
      const { data, error } = await supabase.from('templates').select('*');
      
      if (error) {
        console.error('Error fetching templates:', error);
        return Promise.resolve([...templates]);
      }
      
      if (data) {
        // Convert DB templates to app templates
        return data.map(dbToAppTemplate);
      }
      
      return Promise.resolve([...templates]);
    } catch (e) {
      console.error('Error fetching templates:', e);
      return Promise.resolve([...templates]);
    }
  },
  
  getTemplateById: async (id: number): Promise<Template> => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('template_id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching template with ID ${id}:`, error);
        const template = templates.find(t => t.id === id);
        return Promise.resolve(template || templates[0]);
      }
      
      if (data) {
        return dbToAppTemplate(data as DBTemplate);
      }
      
      const template = templates.find(t => t.id === id);
      return Promise.resolve(template || templates[0]);
    } catch (e) {
      console.error(`Error fetching template with ID ${id}:`, e);
      const template = templates.find(t => t.id === id);
      return Promise.resolve(template || templates[0]);
    }
  },
  
  createTemplate: async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> => {
    try {
      // Create DB template data
      const dbTemplate = {
        name: template.name,
        description: template.description,
        department_id: template.department_id || 1,
        sub_department_id: template.sub_department_id || 1,
        start_date: template.start_date || new Date().toISOString().split('T')[0],
        end_date: template.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        groups: JSON.stringify(template.groups),
        status: template.status || 'draft'
      };
      
      const { data, error } = await supabase
        .from('templates')
        .insert(dbTemplate)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating template:', error);
        // Mock create in local storage
        const newTemplate: Template = {
          id: Math.max(...templates.map(t => t.id)) + 1,
          ...template,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        templates.push(newTemplate);
        return Promise.resolve(newTemplate);
      }
      
      if (data) {
        return dbToAppTemplate(data as DBTemplate);
      }
      
      // Mock create in local storage
      const newTemplate: Template = {
        id: Math.max(...templates.map(t => t.id)) + 1,
        ...template,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      templates.push(newTemplate);
      return Promise.resolve(newTemplate);
    } catch (e) {
      console.error('Error creating template:', e);
      // Mock create in local storage
      const newTemplate: Template = {
        id: Math.max(...templates.map(t => t.id)) + 1,
        ...template,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      templates.push(newTemplate);
      return Promise.resolve(newTemplate);
    }
  },
  
  updateTemplate: async (id: number, updates: Partial<Template>): Promise<Template | null> => {
    try {
      // Create DB template updates
      const dbUpdates: any = {};
      
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.department_id) dbUpdates.department_id = updates.department_id;
      if (updates.sub_department_id) dbUpdates.sub_department_id = updates.sub_department_id;
      if (updates.start_date) dbUpdates.start_date = updates.start_date;
      if (updates.end_date) dbUpdates.end_date = updates.end_date;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.groups) dbUpdates.groups = JSON.stringify(updates.groups);
      
      const { data, error } = await supabase
        .from('templates')
        .update(dbUpdates)
        .eq('template_id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error(`Error updating template with ID ${id}:`, error);
        
        // Mock update in local storage
        const index = templates.findIndex(t => t.id === id);
        if (index === -1) return Promise.resolve(null);
        
        const updatedTemplate = {
          ...templates[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        templates[index] = updatedTemplate;
        return Promise.resolve(updatedTemplate);
      }
      
      if (data) {
        return dbToAppTemplate(data as DBTemplate);
      }
      
      // Mock update in local storage
      const index = templates.findIndex(t => t.id === id);
      if (index === -1) return Promise.resolve(null);
      
      const updatedTemplate = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      templates[index] = updatedTemplate;
      return Promise.resolve(updatedTemplate);
    } catch (e) {
      console.error(`Error updating template with ID ${id}:`, e);
      
      // Mock update in local storage
      const index = templates.findIndex(t => t.id === id);
      if (index === -1) return Promise.resolve(null);
      
      const updatedTemplate = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      templates[index] = updatedTemplate;
      return Promise.resolve(updatedTemplate);
    }
  },
  
  deleteTemplate: async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('template_id', id);
      
      if (error) {
        console.error(`Error deleting template with ID ${id}:`, error);
        
        // Mock delete in local storage
        const index = templates.findIndex(t => t.id === id);
        if (index === -1) return Promise.resolve(false);
        
        templates.splice(index, 1);
        return Promise.resolve(true);
      }
      
      // Mock delete in local storage
      const index = templates.findIndex(t => t.id === id);
      if (index === -1) return Promise.resolve(false);
      
      templates.splice(index, 1);
      return Promise.resolve(true);
    } catch (e) {
      console.error(`Error deleting template with ID ${id}:`, e);
      
      // Mock delete in local storage
      const index = templates.findIndex(t => t.id === id);
      if (index === -1) return Promise.resolve(false);
      
      templates.splice(index, 1);
      return Promise.resolve(true);
    }
  },
  
  addGroup: async (templateId: number, group: Omit<Group, 'id'>): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Generate new ID for the group
      const maxGroupId = Math.max(...template.groups.map(g => g.id), 0);
      const newGroup: Group = {
        id: maxGroupId + 1,
        ...group,
        subGroups: group.subGroups || []
      };
      
      // Add the new group to the template
      const updatedGroups = [...template.groups, newGroup];
      
      // Update the template with the new groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error adding group to template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  updateGroup: async (templateId: number, groupId: number, updates: Partial<Group>): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group to update
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      // Update the group
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex] = {
        ...updatedGroups[groupIndex],
        ...updates
      };
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error updating group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  deleteGroup: async (templateId: number, groupId: number): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group to delete
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      // Remove the group
      const updatedGroups = template.groups.filter(g => g.id !== groupId);
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error deleting group ${groupId} from template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  cloneGroup: async (templateId: number, groupId: number): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group to clone
      const group = template.groups.find(g => g.id === groupId);
      if (!group) return Promise.resolve(null);
      
      // Generate new ID for the cloned group
      const maxGroupId = Math.max(...template.groups.map(g => g.id), 0);
      
      // Create a deep copy of the group with a new ID
      const clonedGroup: Group = JSON.parse(JSON.stringify(group));
      clonedGroup.id = maxGroupId + 1;
      clonedGroup.name = `${clonedGroup.name} (Copy)` as DepartmentName;
      
      // Add the cloned group to the template
      const updatedGroups = [...template.groups, clonedGroup];
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error cloning group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  addSubGroup: async (templateId: number, groupId: number, subGroup: Omit<SubGroup, 'id'>): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group to update
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      // Generate new ID for the subgroup
      const maxSubGroupId = Math.max(...template.groups[groupIndex].subGroups.map(sg => sg.id), 0);
      const newSubGroup: SubGroup = {
        id: maxSubGroupId + 1,
        ...subGroup,
        shifts: subGroup.shifts || []
      };
      
      // Add the new subgroup to the group
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex].subGroups.push(newSubGroup);
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error adding subgroup to group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  updateSubGroup: async (templateId: number, groupId: number, subGroupId: number, updates: Partial<SubGroup>): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group and subgroup to update
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      const subGroupIndex = template.groups[groupIndex].subGroups.findIndex(sg => sg.id === subGroupId);
      if (subGroupIndex === -1) return Promise.resolve(null);
      
      // Update the subgroup
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex].subGroups[subGroupIndex] = {
        ...updatedGroups[groupIndex].subGroups[subGroupIndex],
        ...updates
      };
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error updating subgroup ${subGroupId} in group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  deleteSubGroup: async (templateId: number, groupId: number, subGroupId: number): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      // Remove the subgroup
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex].subGroups = updatedGroups[groupIndex].subGroups.filter(sg => sg.id !== subGroupId);
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error deleting subgroup ${subGroupId} from group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  cloneSubGroup: async (templateId: number, groupId: number, subGroupId: number): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group and subgroup to clone
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      const subGroup = template.groups[groupIndex].subGroups.find(sg => sg.id === subGroupId);
      if (!subGroup) return Promise.resolve(null);
      
      // Generate new ID for the cloned subgroup
      const maxSubGroupId = Math.max(...template.groups[groupIndex].subGroups.map(sg => sg.id), 0);
      
      // Create a deep copy of the subgroup with a new ID
      const clonedSubGroup: SubGroup = JSON.parse(JSON.stringify(subGroup));
      clonedSubGroup.id = maxSubGroupId + 1;
      clonedSubGroup.name = `${clonedSubGroup.name} (Copy)`;
      
      // Add the cloned subgroup to the group
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex].subGroups.push(clonedSubGroup);
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error cloning subgroup ${subGroupId} in group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  addShift: async (templateId: number, groupId: number, subGroupId: number, shift: Omit<Shift, 'id'>): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group and subgroup
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      const subGroupIndex = template.groups[groupIndex].subGroups.findIndex(sg => sg.id === subGroupId);
      if (subGroupIndex === -1) return Promise.resolve(null);
      
      // Create a new shift with a unique ID
      const newShift: Shift = {
        ...shift,
        id: `${groupId}-${subGroupId}-${Date.now()}`
      };
      
      // Add the shift to the subgroup
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex].subGroups[subGroupIndex].shifts.push(newShift);
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error adding shift to subgroup ${subGroupId} in group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  updateShift: async (templateId: number, groupId: number, subGroupId: number, shiftId: string, updates: Partial<Shift>): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group and subgroup
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      const subGroupIndex = template.groups[groupIndex].subGroups.findIndex(sg => sg.id === subGroupId);
      if (subGroupIndex === -1) return Promise.resolve(null);
      
      // Find the shift
      const shiftIndex = template.groups[groupIndex].subGroups[subGroupIndex].shifts.findIndex(s => s.id === shiftId);
      if (shiftIndex === -1) return Promise.resolve(null);
      
      // Update the shift
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex].subGroups[subGroupIndex].shifts[shiftIndex] = {
        ...updatedGroups[groupIndex].subGroups[subGroupIndex].shifts[shiftIndex],
        ...updates
      };
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error updating shift ${shiftId} in subgroup ${subGroupId} in group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  deleteShift: async (templateId: number, groupId: number, subGroupId: number, shiftId: string): Promise<Template | null> => {
    try {
      // First get current template
      const template = await templatesService.getTemplateById(templateId);
      if (!template) return Promise.resolve(null);
      
      // Find the group and subgroup
      const groupIndex = template.groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return Promise.resolve(null);
      
      const subGroupIndex = template.groups[groupIndex].subGroups.findIndex(sg => sg.id === subGroupId);
      if (subGroupIndex === -1) return Promise.resolve(null);
      
      // Remove the shift
      const updatedGroups = [...template.groups];
      updatedGroups[groupIndex].subGroups[subGroupIndex].shifts = 
        updatedGroups[groupIndex].subGroups[subGroupIndex].shifts.filter(s => s.id !== shiftId);
      
      // Update the template with the updated groups
      return templatesService.updateTemplate(templateId, { groups: updatedGroups });
    } catch (e) {
      console.error(`Error deleting shift ${shiftId} from subgroup ${subGroupId} in group ${groupId} in template ${templateId}:`, e);
      return Promise.resolve(null);
    }
  },
  
  saveAsDraft: async (templateId: number): Promise<Template | null> => {
    return templatesService.updateTemplate(templateId, { status: 'draft' });
  },
  
  publishTemplate: async (templateId: number): Promise<Template | null> => {
    return templatesService.updateTemplate(templateId, { status: 'published' });
  },
  
  exportTemplateToPdf: async (templateId: number): Promise<string> => {
    try {
      // In a real app, this would generate and return a PDF file
      console.log(`Exporting template ${templateId} to PDF`);
      
      // Mock PDF export - return a mock URL
      return Promise.resolve(`/template-exports/template-${templateId}.pdf`);
    } catch (e) {
      console.error(`Error exporting template ${templateId} to PDF:`, e);
      return Promise.resolve('');
    }
  }
};


import React, { useState } from 'react';
import { useTemplates } from '@/api/hooks';
import { Calendar, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { DepartmentName } from '@/api/models/types';

interface TemplateFormProps {
  onComplete?: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<DepartmentName>('Convention Centre');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [subDepartment, setSubDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { useCreateTemplate } = useTemplates();
  const createTemplateMutation = useCreateTemplate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    // Create empty template structure with the basic info
    createTemplateMutation.mutate({
      name,
      description,
      start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      status: 'draft',
      groups: [
        {
          id: 1,
          name: department,
          color: 'blue',
          subGroups: [
            {
              id: 1,
              name: subDepartment || 'Team A',
              shifts: []
            }
          ]
        }
      ]
    }, {
      onSuccess: () => {
        toast.success("Template created successfully");
        setName('');
        setDescription('');
        setDepartment('Convention Centre');
        setSubDepartment('');
        setIsSubmitting(false);
        if (onComplete) onComplete();
      },
      onError: () => {
        toast.error("Failed to create template");
        setIsSubmitting(false);
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter template name"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => date < (startDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department" className="mt-1">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Convention Centre">Convention Centre</SelectItem>
              <SelectItem value="Exhibition Centre">Exhibition Centre</SelectItem>
              <SelectItem value="Theatre">Theatre</SelectItem>
              <SelectItem value="Darling Harbor Theatre">Darling Harbor Theatre</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="sub-department">Sub-Department</Label>
          <Select value={subDepartment} onValueChange={setSubDepartment}>
            <SelectTrigger id="sub-department" className="mt-1">
              <SelectValue placeholder="Select Sub-Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Team A">Team A</SelectItem>
              <SelectItem value="Team B">Team B</SelectItem>
              <SelectItem value="Team C">Team C</SelectItem>
              <SelectItem value="Team D">Team D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter template description"
          className="mt-1"
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Creating...</span>
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
            </>
          ) : (
            <>Create New Template</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;

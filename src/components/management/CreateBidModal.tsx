
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useBids } from '@/api/hooks/useBids';
import { useEmployees } from '@/api/hooks/useEmployees';
import { Loader2 } from 'lucide-react';

interface CreateBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBidCreated: () => void;
}

const CreateBidModal: React.FC<CreateBidModalProps> = ({ 
  isOpen, 
  onClose,
  onBidCreated
}) => {
  const { toast } = useToast();
  const { useCreateBid } = useBids();
  const { mutate: createBid, isPending } = useCreateBid();
  const { useAllEmployees } = useEmployees();
  const { data: employees, isLoading: isLoadingEmployees } = useAllEmployees();
  
  const [formData, setFormData] = useState({
    title: '',
    department: 'Convention',
    date: '',
    shiftId: '',
    employeeId: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique shift ID based on department and date
    const generatedShiftId = `shift-${formData.department.toLowerCase()}-${Date.now()}`;
    
    createBid(
      {
        employeeId: formData.employeeId,
        shiftId: formData.shiftId || generatedShiftId,
        status: 'Pending',
        notes: formData.notes
      },
      {
        onSuccess: () => {
          toast({
            title: "Bid created successfully",
            description: "The new bid has been created and is now open for applications."
          });
          onBidCreated();
          onClose();
        },
        onError: () => {
          toast({
            title: "Error creating bid",
            description: "There was a problem creating the bid. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Bid</DialogTitle>
          <DialogDescription className="text-white/60">
            Add a new open shift bid for employees to apply for.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Bid Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Weekend Convention Support"
              className="bg-white/5 border-white/10"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => handleSelectChange('department', value)}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="Convention">Convention</SelectItem>
                <SelectItem value="Exhibition">Exhibition</SelectItem>
                <SelectItem value="Theatre">Theatre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Shift Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="bg-white/5 border-white/10"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shiftId">Shift ID (Optional)</Label>
            <Input
              id="shiftId"
              name="shiftId"
              value={formData.shiftId}
              onChange={handleChange}
              placeholder="Leave blank to auto-generate"
              className="bg-white/5 border-white/10"
            />
            <p className="text-xs text-white/60">
              If left blank, a shift ID will be generated automatically.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeId">Assigned Employee</Label>
            <Select 
              value={formData.employeeId} 
              onValueChange={(value) => handleSelectChange('employeeId', value)}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 max-h-[200px]">
                {isLoadingEmployees ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-5 w-5 animate-spin text-white/60" />
                  </div>
                ) : (
                  employees?.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional information about this bid"
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-white/10"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : "Create Bid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBidModal;

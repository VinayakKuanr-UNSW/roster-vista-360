
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DepartmentName, DepartmentColor } from '@/api/models/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  color: z.string().min(1, "Color is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddGroupDialogProps {
  onAddGroup: (group: { name: DepartmentName; color: DepartmentColor }) => void;
  trigger?: React.ReactNode;
}

export const AddGroupDialog: React.FC<AddGroupDialogProps> = ({
  onAddGroup,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Convention Centre",
      color: "blue",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onAddGroup({
      name: values.name as DepartmentName,
      color: values.color as DepartmentColor,
    });
    
    toast({
      title: "Department Added",
      description: `Department "${values.name}" has been added successfully.`,
    });
    
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Add Department</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900/95 backdrop-blur-xl border-gray-800">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Create a new department for the roster.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      <SelectItem value="Convention Centre">Convention Centre</SelectItem>
                      <SelectItem value="Exhibition Centre">Exhibition Centre</SelectItem>
                      <SelectItem value="Theatre">Theatre</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-gray-800">
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Department</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupDialog;

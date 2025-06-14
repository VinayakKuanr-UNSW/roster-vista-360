
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, "Subgroup name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSubGroupDialogProps {
  groupId: number;
  groupName: string;
  onAddSubGroup: (groupId: number, subGroupName: string) => void;
  trigger?: React.ReactNode;
}

export const AddSubGroupDialog: React.FC<AddSubGroupDialogProps> = ({
  groupId,
  groupName,
  onAddSubGroup,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onAddSubGroup(groupId, values.name);
    
    toast({
      title: "Subgroup Added",
      description: `Subgroup "${values.name}" has been added to ${groupName}.`,
    });
    
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Add Subgroup</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900/95 backdrop-blur-xl border-gray-800">
        <DialogHeader>
          <DialogTitle>Add New Subgroup</DialogTitle>
          <DialogDescription>
            Create a new subgroup in the {groupName} department.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subgroup Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/5 border-white/10"
                      placeholder="e.g., Morning Shift, Evening Team"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Subgroup</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubGroupDialog;


import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationProps } from '@/components/sidebar/types';

export const BroadcastNotifications: React.FC<NotificationProps> = ({ isCollapsed }) => {
  const [notificationCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications for demo
  const notifications = [
    { id: 1, message: "New roster published", time: "10m ago" },
    { id: 2, message: "Your shift swap was approved", time: "1h ago" },
    { id: 3, message: "Upcoming roster change", time: "2h ago" }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-muted/50 transition-all duration-300 relative"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="h-4 min-w-4 p-0 flex items-center justify-center rounded-full text-[10px]"
              >
                {notificationCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[280px] p-0" 
        align={isCollapsed ? "end" : "center"} 
        side={isCollapsed ? "right" : "bottom"}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-border">
            <h5 className="font-medium">Notifications</h5>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">Mark all read</Button>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 border-b border-border hover:bg-muted/30 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{notification.message}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="m-2"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

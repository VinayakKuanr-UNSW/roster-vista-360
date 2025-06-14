import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggleProps } from './types';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isCollapsed, theme, handleThemeChange }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full transition-transform duration-200 hover:scale-105 hover:shadow-md hover:bg-muted"
              >
                <motion.div
                  key={theme}
                  initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Sun className="h-5 w-5" /> : 
                   theme === 'dark' ? <Moon className="h-5 w-5" /> : 
                   <Sparkles className="h-5 w-5" />}
                </motion.div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? "right" : "top"}>Theme Settings</TooltipContent>
          <DropdownMenuContent align={isCollapsed ? "end" : "center"} className="w-40">
            <DropdownMenuItem 
              className={cn(
                "flex items-center gap-2 cursor-pointer transition-all",
                theme === 'light' ? 'bg-accent/50' : 'hover:bg-accent/30'
              )}
              onClick={() => handleThemeChange('light')}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={cn(
                "flex items-center gap-2 cursor-pointer transition-all",
                theme === 'dark' ? 'bg-accent/50' : 'hover:bg-accent/30'
              )}
              onClick={() => handleThemeChange('dark')}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={cn(
                "flex items-center gap-2 cursor-pointer transition-all",
                theme === 'glass' ? 'bg-accent/50' : 'hover:bg-accent/30'
              )}
              onClick={() => handleThemeChange('glass')}
            >
              <Sparkles className="h-4 w-4" />
              <span>Glass</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
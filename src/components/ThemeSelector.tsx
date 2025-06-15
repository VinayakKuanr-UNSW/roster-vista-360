
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Sparkles, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'glass' | 'lovable') => {
    setTheme(newTheme);
    
    const themeNames = {
      glass: 'Glass',
      light: 'Light',
      dark: 'Dark',
      lovable: 'Lovable'
    };
    
    toast({
      title: `Theme Changed`,
      description: `${themeNames[newTheme]} theme applied successfully.`,
      duration: 2000,
    });
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'glass': return <Sparkles className="h-5 w-5" />;
      case 'lovable': return <Palette className="h-5 w-5 text-primary" />;
      default: return <Palette className="h-5 w-5" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-accent transition-all duration-200 hover:scale-105" 
                aria-label="Select theme"
              >
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Theme Settings
          </TooltipContent>
          <DropdownMenuContent align="end" className="w-44 modern-card backdrop-blur-md">
            <DropdownMenuItem 
              className={`flex items-center gap-3 cursor-pointer transition-all duration-150 p-3 ${theme === 'lovable' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleThemeChange('lovable')}
            >
              <Palette className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">Lovable</span>
                <span className="text-xs text-muted-foreground">Modern & vibrant</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`flex items-center gap-3 cursor-pointer transition-all duration-150 p-3 ${theme === 'light' ? 'bg-accent/50' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <Sun className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">Light</span>
                <span className="text-xs text-muted-foreground">Clean & bright</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`flex items-center gap-3 cursor-pointer transition-all duration-150 p-3 ${theme === 'dark' ? 'bg-accent/50' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <Moon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">Dark</span>
                <span className="text-xs text-muted-foreground">Easy on eyes</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`flex items-center gap-3 cursor-pointer transition-all duration-150 p-3 ${theme === 'glass' ? 'bg-accent/50' : ''}`}
              onClick={() => handleThemeChange('glass')}
            >
              <Sparkles className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">Glass</span>
                <span className="text-xs text-muted-foreground">Translucent & modern</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </tooltip>
    </TooltipProvider>
  );
};

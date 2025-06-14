import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Palette, 
  Bell, 
  CreditCard, 
  Link, 
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  children, 
  title,
  description
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.split('/').pop() || 'account';
    return path;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings/${value}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:inline-block">
            dashboard.untitledui.com
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="account" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Link className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6 space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
};

export default SettingsLayout;
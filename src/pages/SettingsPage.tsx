import React from 'react';
import { useParams } from 'react-router-dom';
import SettingsLayout from '@/components/SettingsLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const AppearanceSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Brand Color Section */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div>
          <h3 className="text-sm font-medium">Brand color</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select or customize your brand color.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-[#A48AFB]"></div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              #
            </div>
            <Input 
              value="A48AFB" 
              className="pl-8 h-10 w-32 bg-white/5 border-white/10" 
            />
          </div>
        </div>
      </div>

      {/* Dashboard Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start border-t border-border pt-8">
        <div>
          <h3 className="text-sm font-medium">Dashboard charts</h3>
          <p className="text-sm text-muted-foreground mt-1">
            How charts are displayed.
          </p>
          <Button variant="link" className="px-0 text-sm mt-1">View examples</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Default Option */}
          <div className="relative">
            <Card className="overflow-hidden border-2 border-primary cursor-pointer">
              <CardContent className="p-0">
                <div className="bg-muted/20 p-2 text-xs border-b border-border">
                  Dashboard
                </div>
                <div className="p-4 h-32 flex items-center justify-center">
                  <div className="w-full h-16 bg-primary/20 rounded-md"></div>
                </div>
              </CardContent>
            </Card>
            <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div className="mt-2 text-center">
              <div className="font-medium text-sm">Default</div>
              <div className="text-xs text-muted-foreground">Default company branding.</div>
            </div>
          </div>

          {/* Simplified Option */}
          <div className="relative">
            <Card className="overflow-hidden border border-border cursor-pointer">
              <CardContent className="p-0">
                <div className="bg-muted/20 p-2 text-xs border-b border-border">
                  Dashboard
                </div>
                <div className="p-4 h-32 flex items-center justify-center">
                  <div className="w-full h-16 bg-muted/30 rounded-md"></div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-2 text-center">
              <div className="font-medium text-sm">Simplified</div>
              <div className="text-xs text-muted-foreground">Minimal and modern.</div>
            </div>
          </div>

          {/* Custom CSS Option */}
          <div className="relative">
            <Card className="overflow-hidden border border-border cursor-pointer">
              <CardContent className="p-0">
                <div className="bg-muted/20 p-2 text-xs border-b border-border">
                  Dashboard
                </div>
                <div className="p-4 h-32 flex items-center justify-center relative">
                  <div className="w-full h-16 bg-muted/30 rounded-md"></div>
                  <Button className="absolute inset-0 m-auto" size="sm">
                    Edit CSS
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="mt-2 text-center">
              <div className="font-medium text-sm">Custom CSS</div>
              <div className="text-xs text-muted-foreground">Manage styling with CSS.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start border-t border-border pt-8">
        <div>
          <h3 className="text-sm font-medium">Language</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Default language for public dashboard.
          </p>
        </div>
        <div>
          <Select defaultValue="en-GB">
            <SelectTrigger className="w-full sm:w-[240px] bg-white/5 border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm">🇬🇧</span>
                <SelectValue placeholder="Select language" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-GB">
                <div className="flex items-center gap-2">
                  <span>🇬🇧</span>
                  <span>English (UK)</span>
                </div>
              </SelectItem>
              <SelectItem value="en-US">
                <div className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span>English (US)</span>
                </div>
              </SelectItem>
              <SelectItem value="fr-FR">
                <div className="flex items-center gap-2">
                  <span>🇫🇷</span>
                  <span>French (FR)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cookie Banner Section */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start border-t border-border pt-8">
        <div>
          <h3 className="text-sm font-medium">Cookie banner</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Display cookie banners to visitors.
          </p>
          <Button variant="link" className="px-0 text-sm mt-1">View examples</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Default Option */}
          <div className="relative">
            <Card className="overflow-hidden border-2 border-primary cursor-pointer">
              <CardContent className="p-0">
                <div className="bg-muted/20 p-2 text-xs border-b border-border">
                  Browser
                </div>
                <div className="p-4 h-32 flex items-end">
                  <div className="w-full h-12 bg-primary/20 rounded-md"></div>
                </div>
              </CardContent>
            </Card>
            <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div className="mt-2 text-center">
              <div className="font-medium text-sm">Default</div>
              <div className="text-xs text-muted-foreground">Cookie controls for visitors.</div>
            </div>
          </div>

          {/* Simplified Option */}
          <div className="relative">
            <Card className="overflow-hidden border border-border cursor-pointer">
              <CardContent className="p-0">
                <div className="bg-muted/20 p-2 text-xs border-b border-border">
                  Browser
                </div>
                <div className="p-4 h-32 flex items-end">
                  <div className="w-full h-8 bg-muted/30 rounded-md"></div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-2 text-center">
              <div className="font-medium text-sm">Simplified</div>
              <div className="text-xs text-muted-foreground">Show a simplified banner.</div>
            </div>
          </div>

          {/* None Option */}
          <div className="relative">
            <Card className="overflow-hidden border border-border cursor-pointer">
              <CardContent className="p-0">
                <div className="bg-muted/20 p-2 text-xs border-b border-border">
                  Browser
                </div>
                <div className="p-4 h-32 flex items-center justify-center">
                  <div className="text-xs text-muted-foreground">No banner</div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-2 text-center">
              <div className="font-medium text-sm">None</div>
              <div className="text-xs text-muted-foreground">Don't show any banners.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { section = 'appearance' } = useParams<{ section?: string }>();

  return (
    <SettingsLayout 
      title="Settings" 
      description="Manage your account settings and preferences."
    >
      <Tabs value={section} className="w-full">
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="account">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Account settings would go here</p>
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Profile settings would go here</p>
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Security settings would go here</p>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Notification settings would go here</p>
          </div>
        </TabsContent>
        <TabsContent value="billing">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Billing settings would go here</p>
          </div>
        </TabsContent>
        <TabsContent value="integrations">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Integration settings would go here</p>
          </div>
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
};

export default SettingsPage;
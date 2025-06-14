import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Camera,
  Mail,
  Building,
  UserCircle,
  Shield,
  Calendar,
  Shuffle,
  X,
  Hourglass,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Utility function for shift-completion percentage
const calcShiftCompletion = (completed: number, total: number) => {
  if (total === 0) return 0;
  return ((completed / total) * 100).toFixed(0);
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Basic user stats
  const userStats = {
    totalShifts: 156,
    completedShifts: 148,
    upcomingShifts: 8,
    joinDate: '2023-01-15',
    lastActive: 'Today at 2:30 PM',
  };

  // Monthly metrics data
  const monthlyStats = {
    offered: 40,
    accepted: 32,
    rejected: 8,
    upcoming: 5,
    swapped: { success: 2, fail: 1 },
    cancelled: { normal: 4, late: 2, lateLate: 1 },
    bidded: { success: 3, fail: 1 },
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    role: user?.role || '',
  });

  const handleSave = () => {
    // In a real app, make an API call to update the user profile
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
    setIsEditing(false);
  };

  // Compute shift completion percentage for optional progress bar
  const completionPercent = calcShiftCompletion(
    userStats.completedShifts,
    userStats.totalShifts
  );

  return (
    // Keep the background as is, so your existing site background shows
    <div className="min-h-screen w-full">
      <main className="max-w-6xl mx-auto py-6 px-4 md:px-8">
        {/* Single container card with transparent BG */}
        <Card className="bg-transparent border-none shadow-none">
          {/* HEADER SECTION */}
          <CardHeader className="relative p-0 overflow-hidden">
            {/* 
              If you still want a cover gradient or image, keep this div. 
              Otherwise, remove it. 
            */}
            <div className="absolute inset-0 h-32 bg-gradient-to-r from-purple-700 to-indigo-700" />

            <div className="relative pt-8 px-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white/10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                  <Camera size={14} />
                </button>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {user?.name || 'Unknown User'}
                </h2>
                <p className="text-white/60">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : 'No Role'}{' '}
                  &bull;{' '}
                  {user?.department
                    ? user.department.charAt(0).toUpperCase() +
                      user.department.slice(1)
                    : 'No Dept'}
                </p>
              </div>

              <div className="sm:ml-auto mb-4 sm:mb-0">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:shadow-md transition-shadow"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* CONTENT SECTION */}
          <CardContent className="px-4 py-6 md:px-8 md:py-8">
            {isEditing ? (
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">
                      Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-white/10 text-white border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">
                      Email
                    </label>
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white/10 text-white border-white/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CONTACT INFO COLUMN */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-white/60 mb-1">
                        Contact Information
                      </div>
                      <div className="space-y-2 text-white">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-white/40" />
                          <span>{user?.email || 'No Email'}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2 text-white/40" />
                          <span>
                            {user?.department
                              ? user.department.charAt(0).toUpperCase() +
                                user.department.slice(1)
                              : 'No Dept'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-white/60 mb-1">
                        Role &amp; Access
                      </div>
                      <div className="space-y-2 text-white">
                        <div className="flex items-center">
                          <UserCircle className="w-4 h-4 mr-2 text-white/40" />
                          <span>
                            {user?.role
                              ? user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)
                              : 'No Role'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-white/40" />
                          <span>Full {user?.department || ''} access</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-white/60 mb-1">
                        Account Details
                      </div>
                      <div className="space-y-2 text-white">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-white/40" />
                          <span>
                            Joined{' '}
                            {new Date(userStats.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          <span>Last active: {userStats.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* SHIFT STATS + PROGRESS BAR COLUMN */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/10 border-white/20 text-white min-h-[120px] flex flex-col justify-center hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">Total Shifts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {userStats.totalShifts}
                        </div>
                        <div className="text-white/60 text-sm">
                          Shifts overall
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 text-white min-h-[120px] flex flex-col justify-center hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">Upcoming</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {userStats.upcomingShifts}
                        </div>
                        <div className="text-white/60 text-sm">
                          Scheduled shifts
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Example progress bar for completed vs total */}
                  <div className="mt-6 text-white">
                    <div className="mb-1 text-sm text-white/60">
                      Shift Completion
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs">
                      {completionPercent}% completed
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* MONTHLY METRICS */}
            <div className="mt-8">
              <motion.h3
                className="text-xl font-semibold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                Monthly Metrics
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-white/10 border-white/20 text-white min-h-[120px] flex flex-col justify-center hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <CheckCircle2 className="inline-block w-5 h-5 mr-2 text-green-300" />
                        Shifts Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/80 space-y-1">
                      <div>Offered: {monthlyStats.offered}</div>
                      <div>Accepted: {monthlyStats.accepted}</div>
                      <div>Rejected: {monthlyStats.rejected}</div>
                      <div>Upcoming: {monthlyStats.upcoming}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card className="bg-white/10 border-white/20 text-white min-h-[120px] flex flex-col justify-center hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Shuffle className="inline-block w-5 h-5 mr-2 text-blue-300" />
                        Shifts Swapped
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/80 space-y-1">
                      <div>Successful: {monthlyStats.swapped.success}</div>
                      <div>Unsuccessful: {monthlyStats.swapped.fail}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card className="bg-white/10 border-white/20 text-white min-h-[120px] flex flex-col justify-center hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <X className="inline-block w-5 h-5 mr-2 text-red-300" />
                        Shifts Cancelled
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/80 space-y-1">
                      <div>Cancellations: {monthlyStats.cancelled.normal}</div>
                      <div>Late: {monthlyStats.cancelled.late}</div>
                      <div>Late-Late: {monthlyStats.cancelled.lateLate}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Card className="bg-white/10 border-white/20 text-white min-h-[120px] flex flex-col justify-center hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Hourglass className="inline-block w-5 h-5 mr-2 text-orange-300" />
                        Shifts Bidded
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/80 space-y-1">
                      <div>Successful: {monthlyStats.bidded.success}</div>
                      <div>Unsuccessful: {monthlyStats.bidded.fail}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;

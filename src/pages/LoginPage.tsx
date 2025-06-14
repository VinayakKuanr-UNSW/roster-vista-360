import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// UI + Hooks + Icons from your setup
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Icons used in Index
import {
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  BadgeCheck,
  Fingerprint,
  DollarSign,
} from 'lucide-react';

// Icons used in LoginPage
import { LogIn, User, KeyRound } from 'lucide-react';

const MergedLandingPage: React.FC = () => {
  // --------------------------------------------
  // Login page state & logic
  // --------------------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: string) => {
    switch (role) {
      case 'admin':
        setEmail('admin@example.com');
        setPassword('admin123');
        break;
      case 'manager':
        setEmail('manager@example.com');
        setPassword('manager123');
        break;
      case 'teamlead':
        setEmail('teamlead@example.com');
        setPassword('teamlead123');
        break;
      case 'member':
        setEmail('member@example.com');
        setPassword('member123');
        break;
    }
  };

  // --------------------------------------------
  // Combined Layout (Index on the left, Login on the right)
  // --------------------------------------------
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* LEFT: The entire Index content */}
      <motion.div
        className="w-1/2 overflow-hidden p-10 flex flex-col justify-between"
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* HERO SECTION */}
        <section className="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-blue-900 to-black text-center py-16 lg:py-28">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
            ShiftoPia: Advanced Staff Rostering
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70 text-lg sm:text-xl">
            Streamline your workforce management with our comprehensive
            rostering solution. Seamlessly create, manage, and optimize staff
            schedules.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90 transition-opacity duration-300"
          >
            <a href="/login">
              Get Started <ArrowRight className="h-4 w-4 inline" />
            </a>
          </Button>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-12 md:py-20 lg:py-28 bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Key Features</h2>
            <p className="mx-auto mt-2 max-w-lg text-white/70 text-lg sm:text-xl">
              Powerful tools to manage your workforce scheduling with ease and
              precision.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl transition-transform duration-300 hover:-translate-y-1">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className="text-white">
                    Roster Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">
                    Build complex schedules with our intuitive roster templates,
                    assigning shifts based on availability.
                  </p>
                </CardContent>
              </Card>

              <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl transition-transform duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CalendarDays className="h-8 w-8 text-blue-400 mb-2" />
                  <CardTitle className="text-white">
                    Availability Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">
                    Capture employee availability patterns and prevent
                    scheduling conflicts.
                  </p>
                </CardContent>
              </Card>

              <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl transition-transform duration-300 hover:-translate-y-1">
                <CardHeader>
                  <BadgeCheck className="h-8 w-8 text-green-400 mb-2" />
                  <CardTitle className="text-white">Shift Bidding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">
                    Allow staff to bid on shifts based on their qualifications
                    and preferences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </motion.div>

      {/* RIGHT: The Login page content */}
      <motion.div
        className="w-1/2 bg-gradient-to-tl from-black via-indigo-800 to-black flex items-center justify-center p-8"
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-full max-w-md">
          <Card className="border-white/10 bg-black/50 backdrop-blur-xl shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-white">
                Sign in
              </CardTitle>
              <CardDescription className="text-center text-white/60">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-white/80"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10"
                      required
                    />
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-white/80"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-white/70 hover:text-white underline underline-offset-4 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10"
                      required
                    />
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign in
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-white/60">
                Demo accounts:
              </div>
              <div className="grid grid-cols-4 gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('admin')}
                  className="bg-white/5 hover:bg-white/10 border-white/10"
                >
                  Admin
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('manager')}
                  className="bg-white/5 hover:bg-white/10 border-white/10"
                >
                  Manager
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('teamlead')}
                  className="bg-white/5 hover:bg-white/10 border-white/10"
                >
                  Team Lead
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('member')}
                  className="bg-white/5 hover:bg-white/10 border-white/10"
                >
                  Team Member
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default MergedLandingPage;

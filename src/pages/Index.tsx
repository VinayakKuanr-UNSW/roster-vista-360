import React from 'react';
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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-black/40 py-16 md:py-28 lg:py-36 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            ShiftoPia: Advanced Staff Rostering
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70 md:mt-6 md:text-xl">
            Streamline your workforce management with our comprehensive
            rostering solution. Seamlessly create, manage, and optimize
            staff schedules.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 border-0 hover:opacity-90 transition-opacity duration-300"
            >
              <a href="/login">
                Get Started <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 lg:py-28 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Key Features
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-white/70 md:text-xl">
              Powerful tools to manage your workforce scheduling with ease
              and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature Card 1 */}
            <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <Calendar className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Roster Management</CardTitle>
                <CardDescription className="text-white/70">
                  Create and publish staff rosters with drag-and-drop ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Build complex schedules in minutes using our intuitive roster
                  templates. Assign shifts based on skills, availability,
                  and certifications.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <CalendarDays className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">
                  Availability Tracking
                </CardTitle>
                <CardDescription className="text-white/70">
                  Staff can easily input and update their availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Capture employee availability patterns and preferences.
                  Prevent conflicts with real-time scheduling checks.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <BadgeCheck className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Shift Bidding</CardTitle>
                <CardDescription className="text-white/70">
                  Allow staff to bid on open shifts based on qualifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Empower employees to request shifts that fit their schedule.
                  Managers can review and approve bids in a single click.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 4 */}
            <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-amber-400 mb-2" />
                <CardTitle className="text-white">
                  Timesheet Management
                </CardTitle>
                <CardDescription className="text-white/70">
                  Track hours worked and process payroll data efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Generate timesheets automatically based on actual hours
                  worked. Export data easily for payroll integration.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 5 */}
            <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <LayoutDashboard className="h-8 w-8 text-red-400 mb-2" />
                <CardTitle className="text-white">
                  Data-Driven Insights
                </CardTitle>
                <CardDescription className="text-white/70">
                  Analyze staffing patterns and optimize resource allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Generate reports on labor costs, scheduling efficiency,
                  and attendance. Identify trends to refine future roster
                  decisions.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 6 */}
            <Card className="transform rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <Fingerprint className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle className="text-white">
                  Role-Based Access Control
                </CardTitle>
                <CardDescription className="text-white/70">
                  Secure access management based on user roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Granular permissions ensure users only access features
                  needed for their roles:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                  <li>
                    <span className="font-semibold">Admin:</span> Full access to
                    system configurations, insights, and broadcasts
                  </li>
                  <li>
                    <span className="font-semibold">Manager:</span> Create
                    rosters, approve changes, and view insights
                  </li>
                  <li>
                    <span className="font-semibold">Team Lead:</span> Staff
                    management, timesheet reviews, and broadcasts
                  </li>
                  <li>
                    <span className="font-semibold">Team Member:</span> Personal
                    roster and availability updates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 lg:py-28 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Why Choose ShiftoPia?
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-12">
            {/* Benefit 1 */}
            <div className="flex flex-col gap-3 rounded-lg bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold">Save Time</h3>
              </div>
              <p className="text-sm text-white/70">
                Reduce scheduling time by up to 80% with automated roster
                generation and management.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col gap-3 rounded-lg bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold">Reduce Costs</h3>
              </div>
              <p className="text-sm text-white/70">
                Optimize labor costs with more efficient staff allocation based
                on real demand.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col gap-3 rounded-lg bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold">Improve Compliance</h3>
              </div>
              <p className="text-sm text-white/70">
                Ensure schedules comply with labor laws, break requirements,
                and industry regulations.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="flex flex-col gap-3 rounded-lg bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-bold">
                  Enhance Employee Experience
                </h3>
              </div>
              <p className="text-sm text-white/70">
                Boost staff satisfaction by considering preferences and allowing
                convenient shift bidding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative flex items-center justify-center bg-gradient-to-b from-black/50 to-black/70 py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Ready to Optimize Your Workforce Management?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70 md:text-xl">
            Join organizations that have transformed their scheduling
            processes with ShiftoPia.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-colors duration-300"
            >
              <a href="/login">Login Now</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

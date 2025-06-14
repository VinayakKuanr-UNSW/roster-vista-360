import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import UnifiedSidebar from './components/UnifiedSidebar';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RostersPage from './pages/RostersPage';
import BirdsViewPage from './pages/BirdsViewPage';
import TimesheetPage from './pages/TimesheetPage';
import TemplatesPage from './pages/TemplatesPage';
import ManagementPage from './pages/ManagementPage';
import EmployeeBidsPage from './pages/EmployeeBidsPage';
import InsightsPage from './pages/InsightsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProfilePage from './pages/ProfilePage';
import MyRosterPage from './pages/MyRosterPage';
import AvailabilitiesPage from './pages/AvailabilitiesPage';
import BroadcastPage from './pages/BroadcastPage';
import ConfigurationsPage from './pages/ConfigurationsPage';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Layout component that includes the Unified Sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full">
      <UnifiedSidebar />
      <main className="flex-1 overflow-auto ml-[70px] md:ml-[70px] lg:ml-[70px] transition-all">
        <div className="p-6 min-h-screen">{children}</div>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <SearchProvider>
            <SidebarProvider defaultOpen={false}>
              <div className="h-full w-full overflow-hidden">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/unauthorized"
                      element={<UnauthorizedPage />}
                    />

                    {/* Protected routes with layout */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <DashboardPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <ProfilePage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* My Roster route */}
                    <Route
                      path="/my-roster"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <MyRosterPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Availabilities route */}
                    <Route
                      path="/availabilities"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <AvailabilitiesPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Broadcast route - Admin, Manager, or Team Lead only */}
                    <Route
                      path="/broadcast"
                      element={
                        <ProtectedRoute requiredFeature="broadcast">
                          <AppLayout>
                            <BroadcastPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Rostering routes */}
                    <Route
                      path="/templates"
                      element={
                        <ProtectedRoute requiredFeature="templates">
                          <AppLayout>
                            <TemplatesPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/rosters"
                      element={
                        <ProtectedRoute requiredFeature="rosters">
                          <AppLayout>
                            <RostersPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/birds-view"
                      element={
                        <ProtectedRoute requiredFeature="birds-view">
                          <AppLayout>
                            <BirdsViewPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/timesheet"
                      element={
                        <ProtectedRoute requiredFeature="timesheet-view">
                          <AppLayout>
                            <TimesheetPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Management routes */}
                    <Route
                      path="/management/:type"
                      element={
                        <ProtectedRoute requiredFeature="management">
                          <AppLayout>
                            <ManagementPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Employee bids route */}
                    <Route
                      path="/bids"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <EmployeeBidsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Insights route */}
                    <Route
                      path="/insights"
                      element={
                        <ProtectedRoute requiredFeature="insights">
                          <AppLayout>
                            <InsightsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Search route */}
                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <SearchPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Configurations route - Admin only */}
                    <Route
                      path="/configurations"
                      element={
                        <ProtectedRoute requiredFeature="configurations">
                          <AppLayout>
                            <ConfigurationsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </SidebarProvider>
          </SearchProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
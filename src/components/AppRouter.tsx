import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import ProtectedRoute from './ProtectedRoute';
import Index from '../pages/Index';
import NotFound from '../pages/NotFound';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import RostersPage from '../pages/RostersPage';
import BirdsViewPage from '../pages/BirdsViewPage';
import TimesheetPage from '../pages/TimesheetPage';
import AuditTrailPage from '../pages/AuditTrailPage';
import TemplatesPage from '../pages/TemplatesPage';
import ManagementPage from '../pages/ManagementPage';
import EmployeeBidsPage from '../pages/EmployeeBidsPage';
import InsightsPage from '../pages/InsightsPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ProfilePage from '../pages/ProfilePage';
import MyRosterPage from '../pages/MyRosterPage';
import AvailabilitiesPage from '../pages/AvailabilitiesPage';
import BroadcastPage from '../pages/BroadcastPage';
import ConfigurationsPage from '../pages/ConfigurationsPage';
import SearchPage from '../pages/SearchPage';
import AnalysisPage from '../pages/AnalysisPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
      <Route
        path="/timesheet/audit/:timesheetId"
        element={
          <ProtectedRoute requiredFeature="timesheet-view">
            <AppLayout>
              <AuditTrailPage />
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
      <Route
        path="/insights/:metricId"
        element={
          <ProtectedRoute requiredFeature="insights">
            <AppLayout>
              <AnalysisPage />
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
  );
};

export default AppRouter;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/auth/login'
import { SignupPage } from '@/pages/auth/signup'
import { LoginSignupPage } from '@/pages/login-signup'
import MasterDashboardPage from '@/pages/MasterDashboard'
import CronjobsDashboard from '@/pages/CronjobsDashboard'
import { AgentsDashboard } from '@/pages/dashboard/agents'
import { ApprovalsQueue } from '@/pages/dashboard/approvals'
import { SettingsPage } from '@/pages/dashboard/settings'
import { BillingPage } from '@/pages/dashboard/billing'
import { AdminDashboard } from '@/pages/dashboard/admin'
import { ProfilePage } from '@/pages/dashboard/profile'
import UserProfile from '@/pages/UserProfile'
import { ModulePlaceholder } from '@/pages/dashboard/module-placeholder'
import HealthModule from '@/pages/HealthModule'
import { PasswordResetPage } from '@/pages/auth/password-reset'
import { NotFoundPage } from '@/pages/errors/not-found'
import { FolderKanban, FileText, Wallet } from 'lucide-react'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login-/-signup" element={<LoginSignupPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<MasterDashboardPage />} />
          <Route path="master-dashboard" element={<MasterDashboardPage />} />
          <Route path="cronjobs" element={<CronjobsDashboard />} />
          <Route path="cronjobs-dashboard" element={<CronjobsDashboard />} />
          <Route path="agents" element={<AgentsDashboard />} />
          <Route path="approvals" element={<ApprovalsQueue />} />
          <Route
            path="projects"
            element={
              <ModulePlaceholder
                title="Projects"
                description="Developer-centric project automation"
                icon={FolderKanban}
                features={[
                  'Projects list & roadmap',
                  'Tickets board with external sync',
                  'PRs & releases',
                  'CI orchestrator',
                ]}
              />
            }
          />
          <Route
            path="content"
            element={
              <ModulePlaceholder
                title="Content"
                description="End-to-end content lifecycle automation"
                icon={FileText}
                features={[
                  'Ideas board',
                  'Research workspace',
                  'Draft editor with diffs',
                  'Editorial calendar & publishing',
                ]}
              />
            }
          />
          <Route
            path="finance"
            element={
              <ModulePlaceholder
                title="Finance"
                description="Financial automation: transaction categorization, subscriptions, anomaly detection, forecasting, and monthly close assistance"
                icon={Wallet}
                features={[
                  'Transaction categorization',
                  'Subscriptions manager',
                  'Anomaly detection',
                  'Forecasting & monthly close assistance',
                ]}
                scheduleCta={{ label: 'Schedule Finance Checks', to: '/dashboard/cronjobs-dashboard?create=1' }}
              />
            }
          />
          <Route path="health" element={<HealthModule />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="user-profile" element={<UserProfile />} />
        </Route>

        <Route path="/user-profile" element={<Navigate to="/dashboard/user-profile" replace />} />
        <Route path="/master-dashboard" element={<Navigate to="/dashboard/master-dashboard" replace />} />
        <Route path="/health-(health-module)" element={<Navigate to="/dashboard/health" replace />} />
        <Route path="/help" element={<HelpPlaceholder />} />
        <Route path="/privacy" element={<LegalPlaceholder title="Privacy Policy" />} />
        <Route path="/terms" element={<LegalPlaceholder title="Terms of Service" />} />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgb(var(--card))',
            border: '1px solid rgb(var(--border))',
            color: 'rgb(var(--foreground))',
          },
        }}
      />
    </BrowserRouter>
  )
}

function HelpPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Help & Documentation</h1>
        <p className="mt-2 text-muted-foreground">Coming soon</p>
        <a href="/" className="mt-4 inline-block text-accent hover:underline">
          Back to home
        </a>
      </div>
    </div>
  )
}

function LegalPlaceholder({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-background p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-4 text-muted-foreground">Legal content will be displayed here.</p>
      <a href="/" className="mt-4 inline-block text-accent hover:underline">
        Back to home
      </a>
    </div>
  )
}

export default App

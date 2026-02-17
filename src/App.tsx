import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import Dashboard from "@/pages/Dashboard"
import CompanyList from "@/pages/Companies/CompanyList"
import CompanyDetail from "@/pages/Companies/CompanyDetail"
import SkillMatrix from "@/pages/Analytics/SkillMatrix"
import GlobalSkillMatrix from "@/pages/Analytics/GlobalSkillMatrix"
import HiringProcess from "@/pages/Analytics/HiringProcess"
import GlobalHiringRounds from "@/pages/Analytics/GlobalHiringRounds"
import InnovxView from "@/pages/Innovx/InnovxView"
import NotFoundPage from "@/pages/NotFoundPage"
import CompanyIntelligenceLayout from "@/pages/Companies/CompanyIntelligenceLayout"
import CompanyInnovx from "@/pages/Companies/CompanyInnovx"
import ProfilePage from "@/pages/Profile/ProfilePage"

import LoginPage from "@/pages/Auth/LoginPage"

const ProtectedRoute = () => {
  const isAuth = localStorage.getItem("isAuthenticated") === "true"
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />

            {/* Companies Catalog */}
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />

            {/* Company Specific Deep Dives - Using Layout Wrapper */}
            <Route path="/companies/:id" element={<CompanyIntelligenceLayout />}>
              <Route path="skills" element={<SkillMatrix />} />
              <Route path="process" element={<HiringProcess />} />
              <Route path="innovx" element={<CompanyInnovx />} />
            </Route>

            {/* Global Analytics Views */}
            <Route path="/skills" element={<GlobalSkillMatrix />} />
            <Route path="/hiring-process" element={<GlobalHiringRounds />} />
            <Route path="/innovx" element={<InnovxView />} />

            {/* Student Profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Catch all */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App

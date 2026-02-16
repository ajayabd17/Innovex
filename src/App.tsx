import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import Dashboard from "@/pages/Dashboard"
import CompanyList from "@/pages/Companies/CompanyList"
import CompanyDetail from "@/pages/Companies/CompanyDetail"
import SkillMatrix from "@/pages/Analytics/SkillMatrix"
import GlobalSkillMatrix from "@/pages/Analytics/GlobalSkillMatrix"
import HiringProcess from "@/pages/Analytics/HiringProcess"
import GlobalHiringRounds from "@/pages/Analytics/GlobalHiringRounds"
import InnovxView from "@/pages/Innovx/InnovxView"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Companies Catalog */}
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />

          {/* Company Specific Deep Dives */}
          <Route path="/companies/:id/skills" element={<SkillMatrix />} />
          <Route path="/companies/:id/process" element={<HiringProcess />} />
          <Route path="/companies/:id/innovx" element={<InnovxView />} />

          {/* Global Analytics Views */}
          <Route path="/skills" element={<GlobalSkillMatrix />} />
          <Route path="/hiring-process" element={<GlobalHiringRounds />} />
          <Route path="/innovx" element={<InnovxView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

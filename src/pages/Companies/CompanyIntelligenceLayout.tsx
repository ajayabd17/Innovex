
import { Outlet, useParams, Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabaseService } from "@/data/supabaseService"
import type { CompanyData } from "@/types/schema"
import { MapPin, Calendar, Users, Briefcase, ExternalLink, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompanyIntelligenceLayout() {
    const { id } = useParams<{ id: string }>()
    const [company, setCompany] = useState<CompanyData | undefined>(undefined)
    const location = useLocation()

    useEffect(() => {
        if (id) {
            async function loadCompany() {
                const data = await supabaseService.getCompanyById(parseInt(id!))
                setCompany(data)
            }
            loadCompany()
        }
    }, [id])

    if (!company) return <div className="p-8 text-center animate-pulse">Loading company context...</div>

    // Determine active tab based on current path
    const getActiveTab = () => {
        if (location.pathname.includes('/skills')) return 'skills'
        if (location.pathname.includes('/process')) return 'process'
        if (location.pathname.includes('/innovx')) return 'innovx'
        return 'skills'
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container py-4 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="shrink-0">
                            <Link to="/companies"><ArrowLeft className="h-5 w-5" /></Link>
                        </Button>
                        {company.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="h-12 w-12 object-contain bg-white rounded-lg border p-1" />
                        ) : (
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                {company.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {company.headquarters_address}</span>
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Est. {company.incorporation_year}</span>
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {company.employee_size}</span>
                            </div>
                        </div>
                        <div className="ml-auto flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/companies/${company.company_id}`}>Full Profile</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto -mb-4 pt-1">
                        <Link to={`/companies/${company.company_id}/skills`}>
                            <div className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${getActiveTab() === 'skills' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                                Hiring Skill Sets
                            </div>
                        </Link>
                        <Link to={`/companies/${company.company_id}/process`}>
                            <div className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${getActiveTab() === 'process' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                                Hiring Rounds
                            </div>
                        </Link>
                        <Link to={`/companies/${company.company_id}/innovx`}>
                            <div className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${getActiveTab() === 'innovx' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                                INNOVX
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container py-8">
                <Outlet context={{ company }} />
            </div>
        </div>
    )
}

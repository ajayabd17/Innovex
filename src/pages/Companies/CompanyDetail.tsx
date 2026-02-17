import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    MapPin, Users, Briefcase, Globe, ExternalLink, Calendar,
    TrendingUp, Shield, DollarSign, BookOpen, Cpu, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseService } from "@/data/supabaseService"
import type { CompanyData } from "@/types/schema"
import { getSkillName } from "@/lib/constants"
import { InnovxList } from "@/components/companies/InnovxList"

export default function CompanyDetail() {
    const { id } = useParams<{ id: string }>()
    const [company, setCompany] = useState<CompanyData | undefined>(undefined)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        if (id) {
            async function loadCompany() {
                if (!id) return
                console.log(`[CompanyDetail] Fetching company with ID: ${id}`)
                const data = await supabaseService.getCompanyById(parseInt(id))
                console.log(`[CompanyDetail] Fetched data:`, data)
                setCompany(data)
            }
            loadCompany()
        }
    }, [id])

    if (!company) {
        return <div className="p-8 text-center">Loading or Company not found...</div>
    }

    const DataGrid = ({ items }: { items: { label: string, value: string | null | undefined, icon?: any }[] }) => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
                item.value ? (
                    <Card key={idx} className="bg-muted/30 border-none shadow-none">
                        <CardContent className="p-4 flex items-start gap-4">
                            {item.icon && <div className="p-2 bg-background rounded-full border">{<item.icon className="h-4 w-4 text-muted-foreground" />}</div>}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                <p className="font-semibold">{item.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : null
            ))}
        </div>
    )

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">{children}</h3>
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-8">
                <div className="flex items-start gap-6">
                    <div className="h-24 w-24 rounded-lg bg-white flex items-center justify-center text-3xl font-bold text-gray-500 border shadow-sm overflow-hidden p-2">
                        {company.logo_url ? (
                            <img
                                src={company.logo_url}
                                alt={company.name || 'Company'}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerText = company.name?.substring(0, 1) || 'C';
                                }}
                            />
                        ) : (
                            company.name?.substring(0, 1)
                        )}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
                        <div className="flex flex-wrap gap-2 text-muted-foreground items-center">
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {company.headquarters_address}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Est. {company.incorporation_year}</span>
                            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {company.employee_size} Employees</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5 text-primary">
                                {company.nature_of_company}
                            </Badge>
                            <Badge variant="secondary" className="text-sm">
                                {company.category}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/companies/${company.company_id}/skills`}>View Skill Matrix</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/companies/${company.company_id}/process`}>Hiring Process</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/companies/${company.company_id}/innovx`}>INNOVX</Link>
                    </Button>
                    {company.website_url && (
                        <Button size="sm" asChild>
                            <a href={company.website_url} target="_blank" rel="noreferrer">
                                Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 space-x-6">
                    {["overview", "business", "culture", "technology", "financials", "innovx"].map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="capitalize data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 pb-2"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <section>
                                <SectionTitle>About</SectionTitle>
                                <p className="text-lg leading-relaxed text-muted-foreground">{company.overview_text}</p>
                            </section>
                            <section className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Vision</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        {company.vision_statement}
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Mission</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        {company.mission_statement}
                                    </CardContent>
                                </Card>
                            </section>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Quick Links</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {company.linkedin_url && (
                                        <a href={company.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            <Globe className="h-4 w-4" /> LinkedIn Profile
                                        </a>
                                    )}
                                    {company.twitter_handle && (
                                        <a href={`https://twitter.com/${company.twitter_handle}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
                                            <Globe className="h-4 w-4" /> Twitter ({company.twitter_handle})
                                        </a>
                                    )}
                                </CardContent>
                            </Card>



                            {company.hiring_rounds?.hiring_data?.job_role_details && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Open Roles</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-2">
                                            {company.hiring_rounds.hiring_data.job_role_details.map((role: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0">
                                                    <span className="font-medium text-sm">{role.role_title}</span>
                                                    <Badge variant="outline" className="text-xs">{role.role_category}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Hiring Focus</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {company.skills?.slice(0, 5).map(skill => (
                                            <Badge key={skill.skill_set_id} variant="secondary">
                                                {getSkillName(skill.skill_set_id)} (Lvl {skill.level_number})
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                    <DataGrid items={[
                        { label: "Sales Motion", value: company.business?.sales_motion, icon: Briefcase },
                        { label: "Market Share", value: company.business?.market_share_percentage, icon: TrendingUp },
                        { label: "Future Projections", value: company.business?.future_projections, icon: TrendingUp },
                        { label: "Innovation Roadmap", value: company.business?.innovation_roadmap, icon: BookOpen },
                    ]} />
                    {company.business?.core_value_proposition && (
                        <Card>
                            <CardHeader><CardTitle>Core Value Proposition</CardTitle></CardHeader>
                            <CardContent>{company.business.core_value_proposition}</CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="culture" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <DataGrid items={[
                            { label: "Work Culture", value: company.culture?.mission_clarity, icon: Users },
                            { label: "Manager Quality", value: company.culture?.manager_quality, icon: Users },
                            { label: "Psychological Safety", value: company.culture?.psychological_safety, icon: Shield },
                            { label: "Burnout Risk", value: company.culture?.burnout_risk, icon: TrendingUp },
                        ]} />
                    </div>
                </TabsContent>

                <TabsContent value="technology" className="space-y-6">
                    <DataGrid items={[
                        { label: "R&D Investment", value: company.technologies?.r_and_d_investment, icon: BookOpen },
                        { label: "AI/ML Adoption", value: company.technologies?.ai_ml_adoption_level, icon: Cpu },
                    ]} />
                </TabsContent>

                <TabsContent value="financials" className="space-y-6">
                    <DataGrid items={[
                        { label: "Annual Revenue", value: company.financials?.annual_revenue, icon: DollarSign },
                        { label: "Valuation", value: company.financials?.valuation, icon: DollarSign },
                        { label: "Funding", value: company.financials?.total_capital_raised, icon: DollarSign },
                        { label: "YoY Growth", value: company.financials?.yoy_growth_rate, icon: TrendingUp },
                    ]} />
                </TabsContent>

                <TabsContent value="innovx" className="space-y-6">
                    <InnovxList companyId={company.company_id} />
                </TabsContent>
            </Tabs>
        </div >
    )
}

import { useState, useEffect } from "react"
import { useSearchParams, useParams } from "react-router-dom"
import { supabaseService } from "@/data/supabaseService"
import type { CompanyData } from "@/types/schema"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function HiringProcess() {
    const { id } = useParams<{ id: string }>()
    const [searchParams, setSearchParams] = useSearchParams()

    // Prioritize search param, fall back to route param
    const companyId = searchParams.get("company") || id || ""
    const [company, setCompany] = useState<CompanyData | undefined>(undefined)
    const [allCompanies, setAllCompanies] = useState<any[]>([])

    useEffect(() => {
        async function fetchAll() {
            setAllCompanies(await supabaseService.getAllCompanies())
        }
        fetchAll()
    }, [])

    useEffect(() => {
        if (companyId) {
            async function fetchCompany() {
                const data = await supabaseService.getCompanyById(parseInt(companyId))
                setCompany(data)
            }
            fetchCompany()
        } else {
            setCompany(undefined)
        }
    }, [companyId])

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParams({ company: e.target.value })
    }

    const clearSelection = () => {
        // setSearchParams({})
        // Navigation handled by parent
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hiring Process</h1>
                    <p className="text-muted-foreground">{company?.name ? `${company.name} - ` : ""}Recruitment Timeline</p>
                </div>
            </div>

            {company ? (
                <div className="relative border-l-2 border-muted ml-4 md:ml-8 space-y-8 py-4">
                    {company.hiring_rounds?.hiring_data?.job_role_details ? (
                        company.hiring_rounds.hiring_data.job_role_details.map((role: any, roleIndex: number) => (
                            <div key={roleIndex} className="mb-12">
                                <h3 className="text-xl font-semibold mb-4 text-primary pl-8 flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary p-1 rounded"><Badge variant="outline">{role.opportunity_type}</Badge></span>
                                    {role.role_title}
                                </h3>

                                {role.hiring_rounds?.map((round: any, index: number) => (
                                    <div key={index} className="relative pl-8 md:pl-12 mb-6">
                                        <span className="absolute -left-[9px] top-4 h-4 w-4 rounded-full bg-background border-2 border-primary ring-4 ring-background" />
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <Badge variant="outline" className="mb-2">{round.round_category}</Badge>
                                                        <CardTitle className="text-lg">{round.round_name}</CardTitle>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Badge variant="secondary" className="text-xs">{round.assessment_mode}</Badge>
                                                        <span className="text-xs text-muted-foreground font-mono">Round {round.round_number}</span>
                                                    </div>
                                                </div>
                                                {(round.duration_minutes || round.elimination_round) && (
                                                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                                        {round.duration_minutes && <span>⏱ {round.duration_minutes} mins</span>}
                                                        {round.elimination_round === "Yes" && <span className="text-red-500 font-medium">⚠ Elimination Round</span>}
                                                    </div>
                                                )}
                                                <CardDescription className="flex flex-col gap-2 mt-4 pt-2 border-t">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {round.skill_sets?.map((skill: any, idx: number) => (
                                                            <div key={idx} className="bg-muted/30 p-2 rounded border text-sm">
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="font-semibold">{skill.skill_set_name || 'Skill'}</span>
                                                                    <span className="text-xs font-mono bg-background px-1 rounded border">{skill.skill_set_code}</span>
                                                                </div>
                                                                <p className="text-muted-foreground text-xs">{skill.typical_questions || "No specific questions listed."}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="pl-8 text-muted-foreground italic">No detailed hiring process data available for this company.</div>
                    )}
                </div>
            ) : (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-6">Explore Hiring Processes</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allCompanies.map((c: any) => (
                            <Card key={c.company_id} className="cursor-pointer hover:shadow-lg transition-all hover:border-primary" onClick={() => setSearchParams({ company: c.company_id.toString() })}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="h-12 w-12 rounded bg-white border flex items-center justify-center overflow-hidden">
                                        {c.logo_url ? (
                                            <img src={c.logo_url} alt={c.name} className="h-full w-full object-contain p-1" />
                                        ) : (
                                            <span className="text-lg font-bold text-muted-foreground">{c.name?.substring(0, 1)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{c.name}</CardTitle>
                                        <CardDescription className="text-xs">{c.category}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

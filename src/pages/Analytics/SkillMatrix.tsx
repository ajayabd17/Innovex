import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getSkillName } from "@/data/mockData"
import { supabaseService } from "@/data/supabaseService"
import type { CompanyData } from "@/types/schema"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Simple Select component wrapper since I didn't create a complex one
// Actually I didn't create Select component in ui/select.tsx. I need to use native select or create one.
// I'll use a native select for simplicity given the constraints, or create a simple custom one.
// Let's create a quick Select component inline or efficient usage.
// Wait, the plan said "Base Components ... Select". I marked it as done but I didn't create ui/select.tsx.
// I'll create `src/components/ui/select.tsx` now.

export default function SkillMatrix() {
    const { id } = useParams<{ id: string }>()
    const [companyId, setCompanyId] = useState<string>(id || "")
    const [company, setCompany] = useState<CompanyData | undefined>(undefined)

    useEffect(() => {
        if (id) setCompanyId(id)
    }, [id])

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

    // 12 Standard Skill Sets
    const SKILL_IDS = [1, 2, 3, 4, 5, 6, 7];
    const LEVELS = Array.from({ length: 10 }, (_, i) => i + 1);

    const [aggregatedSkills, setAggregatedSkills] = useState<any[]>([])

    // Aggregate skills from hiring rounds JSON
    useEffect(() => {
        if (!company?.hiring_rounds?.hiring_data?.job_role_details) {
            if (company?.skills) {
                setAggregatedSkills(company.skills)
            } else {
                setAggregatedSkills([])
            }
            return
        }

        const skillMap = new Map<number, number>() // skill_id -> max_level

        company.hiring_rounds.hiring_data.job_role_details.forEach((role: any) => {
            role.hiring_rounds?.forEach((round: any) => {
                round.skill_sets?.forEach((skill: any) => {
                    let skillId = 0
                    const name = skill.skill_set_name?.toLowerCase() || ""
                    const code = skill.skill_set_code?.toLowerCase() || ""

                    if (name.includes("code") || code.includes("code") || name.includes("program") || name.includes("java") || name.includes("python") || name.includes("c++")) skillId = 1
                    else if (name.includes("struct") || code.includes("dsa") || name.includes("algo")) skillId = 2
                    else if (name.includes("system") || code.includes("sys") || name.includes("design")) skillId = 3
                    else if (name.includes("fund") || code.includes("cs") || name.includes("os") || name.includes("dbms") || name.includes("sql")) skillId = 4
                    else if (name.includes("web") || code.includes("dev") || name.includes("react") || name.includes("node") || name.includes("front") || name.includes("back")) skillId = 5
                    else if (name.includes("aptitude") || code.includes("apt") || name.includes("logic") || name.includes("reason")) skillId = 6
                    else if (name.includes("comm") || code.includes("comm") || name.includes("english") || name.includes("soft")) skillId = 7

                    if (skillId > 0) {
                        let level = 6
                        const prof = skill.proficiency_level?.toLowerCase() || ""
                        if (prof.includes("expert") || prof.includes("adv")) level = 9
                        else if (prof.includes("inter")) level = 7
                        else if (prof.includes("beg") || prof.includes("basic")) level = 4

                        const current = skillMap.get(skillId) || 0
                        if (level > current) skillMap.set(skillId, level)
                    }
                })
            })
        })

        const skillsArray = Array.from(skillMap.entries()).map(([id, level]) => ({
            skill_set_id: id,
            level_number: level
        }))
        setAggregatedSkills(skillsArray)

    }, [company])

    const getCellContent = (skillId: number, level: number) => {
        if (!aggregatedSkills.length) return null
        const score = aggregatedSkills.find(s => s.skill_set_id === skillId)
        if (!score) return null

        if (score.level_number === level) {
            return <div className="w-full h-full bg-primary/80 rounded-sm shadow-sm" title={`Required Level: ${level}`} />
        }
        if (score.level_number > level) {
            return <div className="w-full h-full bg-primary/20 rounded-sm" />
        }
        return null
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hiring Skill Sets</h1>
                    <p className="text-muted-foreground">{company?.name ? `${company.name} - ` : ""}Skill Expectation Matrix</p>
                </div>
            </div>

            {company ? (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{company.name} - Skill Competency Map</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-2 border text-left bg-muted">Skill Set</th>
                                            {LEVELS.map(l => (
                                                <th key={l} className="p-2 border text-center w-12 bg-muted">L{l}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SKILL_IDS.map(skillId => (
                                            <tr key={skillId}>
                                                <td className="p-2 border font-medium">{getSkillName(skillId)}</td>
                                                {LEVELS.map(level => (
                                                    <td key={level} className="p-2 border h-10 w-10 text-center relative p-1">
                                                        {getCellContent(skillId, level)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-4 text-xs text-muted-foreground">
                                    * L1-L4: Foundation | L5-L7: Intermediate | L8-L10: Advanced/Expert
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                    Please select a company to view their skill matrix.
                </div>
            )}
        </div>
    )
}

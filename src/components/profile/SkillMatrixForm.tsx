import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { supabaseService } from "@/data/supabaseService"
import { Loader2, Save } from "lucide-react"

// The 10 Core Skills
const CORE_SKILLS = [
    { id: "coding", label: "Coding (Problem Solving)" },
    { id: "dsa", label: "Data Structures & Algorithms" },
    { id: "system_design", label: "System Design" },
    { id: "computer_fundamentals", label: "Computer Fundamentals (OS, DBMS, CN)" },
    { id: "web_development", label: "Web Development" },
    { id: "aptitude", label: "Aptitude & Logical Reasoning" },
    { id: "communication", label: "Communication Skills" },
    { id: "cloud_computing", label: "Cloud Computing" },
    { id: "data_science_ai", label: "Data Science & AI" },
    { id: "software_engineering", label: "Software Engineering Practices" }
]

export function SkillMatrixForm() {
    const [skills, setSkills] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const netId = localStorage.getItem("userNetId") || ""

    useEffect(() => {
        async function fetchSkills() {
            if (!netId) return
            const data = await supabaseService.getStudentSkillMatrix(netId)
            if (data) {
                setSkills(data)
            } else {
                // Initialize with 0s if no data
                const initial: any = {}
                CORE_SKILLS.forEach(s => initial[s.id] = 0)
                setSkills(initial)
            }
            setLoading(false)
        }
        fetchSkills()
    }, [netId])

    const handleSliderChange = (id: string, value: number[]) => {
        setSkills((prev: any) => ({ ...prev, [id]: value[0] }))
    }

    const handleSave = async () => {
        setSaving(true)
        await supabaseService.updateStudentSkillMatrix(netId, skills)
        setSaving(false)
        // Ideally trigger a toast notification here
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Skill Matrix (Self Assessment)</CardTitle>
                <CardDescription>
                    Rate your proficiency from 0 (Novice) to 10 (Expert) in these core areas.
                    Be honest - this data matches you with relevant companies.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {CORE_SKILLS.map((skill) => (
                        <div key={skill.id} className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">{skill.label}</label>
                                <span className={`text-sm font-bold ${skills[skill.id] >= 8 ? "text-green-600" :
                                        skills[skill.id] >= 5 ? "text-blue-600" : "text-muted-foreground"
                                    }`}>
                                    L{skills[skill.id] || 0}
                                </span>
                            </div>
                            <Slider
                                defaultValue={[skills[skill.id] || 0]}
                                value={[skills[skill.id] || 0]}
                                max={10}
                                step={1}
                                onValueChange={(val) => handleSliderChange(skill.id, val)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                <span>0</span>
                                <span>5</span>
                                <span>10</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Skills
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

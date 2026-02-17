import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { supabaseService } from "@/data/supabaseService"
import { PROGRAMMING_LANGUAGES, CORE_SUBJECTS, DOMAINS, TOOLS } from "@/data/profileConstants"
import { Loader2, Plus, Trash2, Save } from "lucide-react"

export function TechnicalCompetencyForm({ onSave }: { onSave?: () => void }) {
    const [data, setData] = useState<any>({
        languages: [],
        core_subjects: {},
        domains: [],
        tools: []
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const netId = localStorage.getItem("userNetId") || ""

    useEffect(() => {
        async function fetchData() {
            if (!netId) return
            const result = await supabaseService.getStudentSkillMatrix(netId)
            if (result) {
                // Merge with defaults to ensure structure
                let loadedLanguages = result.languages || []
                if (loadedLanguages.length === 0) {
                    loadedLanguages = [{ language: "", proficiency: 1 }]
                }

                setData({
                    languages: loadedLanguages,
                    core_subjects: result.core_subjects || {},
                    domains: result.domains || [],
                    tools: result.tools || []
                })
            }
            setLoading(false)
        }
        fetchData()
    }, [netId])

    // --- Languages Logic ---
    const addLanguage = () => {
        setData((prev: any) => ({
            ...prev,
            languages: [...prev.languages, { language: "", proficiency: 1 }]
        }))
    }

    const removeLanguage = (index: number) => {
        const newLangs = [...data.languages]
        newLangs.splice(index, 1)
        setData({ ...data, languages: newLangs })
    }

    const updateLanguage = (index: number, field: string, value: any) => {
        const newLangs = [...data.languages]
        newLangs[index][field] = value
        setData({ ...data, languages: newLangs })
    }

    // --- Core Subjects Logic ---
    const updateCoreSubject = (subject: string, rating: number) => {
        setData((prev: any) => ({
            ...prev,
            core_subjects: { ...prev.core_subjects, [subject]: rating }
        }))
    }

    // --- Domains Logic (Max 2) ---
    const toggleDomain = (domain: string) => {
        const current = [...data.domains]
        if (current.includes(domain)) {
            setData({ ...data, domains: current.filter(d => d !== domain) })
        } else {
            if (current.length < 2) {
                setData({ ...data, domains: [...current, domain] })
            }
        }
    }

    // --- Tools Logic (Min 2) ---
    const toggleTool = (tool: string) => {
        const current = [...data.tools]
        if (current.includes(tool)) {
            setData({ ...data, tools: current.filter(t => t !== tool) })
        } else {
            setData({ ...data, tools: [...current, tool] })
        }
    }

    const handleSave = async () => {
        setSaving(true)
        // Validation: Min 1 Language, Min 2 Tools
        if (data.languages.length === 0) {
            alert("Please add at least one programming language.")
            setSaving(false)
            return
        }
        if (data.tools.length < 2) {
            alert("Please select at least 2 tools.")
            setSaving(false)
            return
        }

        await supabaseService.updateStudentSkillMatrix(netId, data)
        setSaving(false)
        if (onSave) onSave()
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Technical Competency</CardTitle>
                <CardDescription>
                    Structured assessment of your technical skills.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* 4.1 Programming Languages */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-base font-semibold">4.1 Programming Languages (Min 1)</Label>
                        <Button variant="outline" size="sm" onClick={addLanguage}>
                            <Plus className="h-4 w-4 mr-2" /> Add Language
                        </Button>
                    </div>
                    {data.languages.length === 0 && <p className="text-sm text-muted-foreground italic">No languages added.</p>}
                    <div className="space-y-2">
                        {data.languages.map((lang: any, index: number) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Select value={lang.language} onValueChange={(val) => updateLanguage(index, 'language', val)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROGRAMMING_LANGUAGES.map(l => (
                                            <SelectItem key={l} value={l}>{l}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={String(lang.proficiency)} onValueChange={(val) => updateLanguage(index, 'proficiency', Number(val))}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5].map(r => <SelectItem key={r} value={String(r)}>{r} / 5</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => removeLanguage(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4.2 Core Subjects */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">4.2 Core Subjects (Rate 1-5)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CORE_SUBJECTS.Computing.map(subject => (
                            <div key={subject} className="flex justify-between items-center border p-2 rounded max-w-md">
                                <span className="text-sm">{subject}</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => updateCoreSubject(subject, rating)}
                                            className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-colors ${(data.core_subjects[subject] || 0) >= rating
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-muted-foreground"
                                                }`}
                                        >
                                            {rating}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4.3 Domain Expertise */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">4.3 Domain Expertise (Max 2)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {DOMAINS.map(domain => {
                            const isSelected = data.domains.includes(domain)
                            const isDisabled = !isSelected && data.domains.length >= 2
                            return (
                                <div key={domain} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`dom-${domain}`}
                                        checked={isSelected}
                                        onCheckedChange={() => toggleDomain(domain)}
                                        disabled={isDisabled}
                                    />
                                    <Label htmlFor={`dom-${domain}`} className={isDisabled ? "text-muted-foreground" : ""}>{domain}</Label>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 4.4 Tools */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">4.4 Tools & Technologies (Min 2)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {TOOLS.map(tool => (
                            <div key={tool} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`tool-${tool}`}
                                    checked={data.tools.includes(tool)}
                                    onCheckedChange={() => toggleTool(tool)}
                                />
                                <Label htmlFor={`tool-${tool}`}>{tool}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Competencies
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

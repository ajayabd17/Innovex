import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { supabaseService } from "@/data/supabaseService"
import { DEPARTMENTS, SPECIALIZATIONS } from "@/data/profileConstants"
import { Loader2, Save } from "lucide-react"

export function AcademicForm({ onSave }: { onSave?: () => void }) {
    const [profile, setProfile] = useState<any>({
        degree_type: "",
        department: "",
        specialization: "",
        current_cgpa: "",
        tenth_percentage: "",
        twelfth_percentage: "",
        diploma_percentage: "",
        active_backlogs: 0,
        history_backlogs: 0,
        gap_years: 0,
        gap_duration: "",
        graduation_year: new Date().getFullYear() + 1
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [hasGap, setHasGap] = useState(false)
    const netId = localStorage.getItem("userNetId") || ""

    useEffect(() => {
        async function fetchProfile() {
            if (!netId) return
            const data = await supabaseService.getStudentProfile(netId)
            if (data) {
                setProfile(prev => ({ ...prev, ...data }))
                if (data.gap_years > 0) setHasGap(true)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [netId])

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        setProfile(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setProfile(prev => {
            const updates: any = { [name]: value }
            // Reset specialization if department changes
            if (name === "department") {
                updates.specialization = ""
            }
            return { ...prev, ...updates }
        })
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // Basic Validation Logic could go here (e.g. check mandatory fields)

        const dataToSave = {
            ...profile,
            net_id: netId, // Ensure net_id is explicitly passed for storage key
            gap_years: hasGap ? (profile.gap_years || 0) : 0,
            gap_duration: hasGap ? profile.gap_duration : null
        }

        await supabaseService.updateStudentProfile(dataToSave)
        setSaving(false)
        if (onSave) onSave()
    }

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>

    // Get Specializations based on selected Department
    const availableSpecializations = profile.department ? SPECIALIZATIONS[profile.department] || [] : []

    return (
        <Card>
            <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Provide your academic details accurately. This data determines your eligibility.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-6">

                    {/* Degree & Department Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Degree Type <span className="text-red-500">*</span></Label>
                            <Select
                                value={profile.degree_type}
                                onValueChange={(val) => handleSelectChange("degree_type", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Degree" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="B.Tech">B.Tech</SelectItem>
                                    <SelectItem value="M.Tech">M.Tech</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Major Department <span className="text-red-500">*</span></Label>
                            <Select
                                value={profile.department}
                                onValueChange={(val) => handleSelectChange("department", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEPARTMENTS.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <Label>Specialization <span className="text-red-500">*</span></Label>
                            <Select
                                value={profile.specialization}
                                onValueChange={(val) => handleSelectChange("specialization", val)}
                                disabled={!profile.department}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={!profile.department ? "Select Department first" : "Select Specialization"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSpecializations.map(spec => (
                                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                    ))}
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Academic Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Current CGPA <span className="text-red-500">*</span></Label>
                                <Input name="current_cgpa" type="number" step="0.01" min="0" max="10" value={profile.current_cgpa} onChange={handleTextChange} placeholder="e.g. 8.5" required />
                            </div>
                            <div className="space-y-2">
                                <Label>10th % <span className="text-red-500">*</span></Label>
                                <Input name="tenth_percentage" type="number" step="0.1" min="0" max="100" value={profile.tenth_percentage} onChange={handleTextChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>12th % <span className="text-red-500">*</span></Label>
                                <Input name="twelfth_percentage" type="number" step="0.1" min="0" max="100" value={profile.twelfth_percentage} onChange={handleTextChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Graduation Year <span className="text-red-500">*</span></Label>
                                <Input name="graduation_year" type="number" value={profile.graduation_year} onChange={handleTextChange} required />
                            </div>
                        </div>
                    </div>

                    {/* Backlogs & Gaps */}
                    <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label>Active Backlogs</Label>
                                <Input name="active_backlogs" type="number" min="0" value={profile.active_backlogs} onChange={handleTextChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>History of Backlogs</Label>
                                <Input name="history_backlogs" type="number" min="0" value={profile.history_backlogs} onChange={handleTextChange} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                                id="gap"
                                checked={hasGap}
                                onCheckedChange={(c) => setHasGap(c === true)}
                            />
                            <Label htmlFor="gap">Do you have any academic gap years?</Label>
                        </div>

                        {hasGap && (
                            <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 bg-gray-50 p-2 rounded">
                                <div className="space-y-2">
                                    <Label>Number of Years</Label>
                                    <Input name="gap_years" type="number" min="1" value={profile.gap_years} onChange={handleTextChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Reason / Duration</Label>
                                    <Input name="gap_duration" placeholder="e.g., 1 year for medical" value={profile.gap_duration} onChange={handleTextChange} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end sticky bottom-0 bg-background pt-2 border-t">
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Academic Info
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

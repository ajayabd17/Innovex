import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
// import { User, GraduationCap, Code, Briefcase, Trophy, Settings, FileText, ChevronDown, ChevronUp } from "lucide-react" // Optimized imports below
import { GraduationCap, Code, Briefcase, Trophy, Settings, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { AcademicForm } from "@/components/profile/AcademicForm"
import { TechnicalCompetencyForm } from "@/components/profile/TechnicalCompetencyForm"
import { PlacementEligibility } from "@/components/profile/PlacementEligibility"
import { supabaseService } from "@/data/supabaseService"

export default function ProfilePage() {
    const [expandedSection, setExpandedSection] = useState<string | null>("Academic Information")
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(true)
    const netId = localStorage.getItem("userNetId") || ""

    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Fetch data to calculate progress
    useEffect(() => {
        async function calculateProgress() {
            if (!netId) return;

            // Fetch all sections (Mocked for now)
            const [profile, skills] = await Promise.all([
                supabaseService.getStudentProfile(netId),
                supabaseService.getStudentSkillMatrix(netId)
            ]);

            let score = 0;
            const maxScore = 100;

            // 1. Academic (30%)
            if (profile) {
                if (profile.degree_type && profile.department && profile.current_cgpa && profile.tenth_percentage) {
                    score += 30;
                } else if (profile.degree_type || profile.department) {
                    score += 10;
                }
            }

            // 2. Technical (30%)
            if (skills) {
                // Min 1 Language defined
                if (skills.languages && skills.languages.length > 0) score += 10;
                // Core subjects filled
                if (skills.core_subjects && Object.keys(skills.core_subjects).length >= 1) score += 10;
                // Domains or Tools
                if ((skills.domains && skills.domains.length > 0) || (skills.tools && skills.tools.length >= 2)) score += 10;
            }

            // 3. Experience (20%) - Placeholder check
            // if (experience && experience.length > 0) score += 20;

            setProgress(score);
            setLoading(false);
        }
        calculateProgress();
    }, [netId, refreshTrigger]);

    const refreshProfile = () => {
        // console.log("Refetching profile data...")
        setRefreshTrigger(prev => prev + 1)
    }

    const sections = [
        { id: "academic", icon: GraduationCap, title: "Academic Information", description: "Degree, CGPA, and academic metrics", component: AcademicForm },
        { id: "technical", icon: Code, title: "Technical Competency", description: "Languages, Core Subjects, Domains", component: TechnicalCompetencyForm },
        { id: "experience", icon: Briefcase, title: "Applied Experience", description: "Projects and internships" },
        { id: "competitive", icon: Trophy, title: "Competitive Signals", description: "Certifications and achievements" },
        { id: "preferences", icon: Settings, title: "Preferences", description: "Job preferences and location" },
        { id: "documents", icon: FileText, title: "Documents", description: "Resume and transcripts" },
    ]

    const toggleSection = (id: string) => {
        setExpandedSection(prev => prev === id ? null : id)
    }

    const getProgressColor = (val: number) => {
        if (val < 50) return "bg-red-500"
        if (val < 80) return "bg-yellow-500"
        return "bg-green-500"
    }

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
                <p className="text-muted-foreground">
                    Complete your profile to unlock placement opportunities
                </p>
            </div>

            {/* Progress Bar */}
            <Card className="border-2 lg:sticky lg:top-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                        </div>
                        <div className={`text-2xl font-bold ${progress < 50 ? 'text-red-500' : progress < 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {progress}%
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} className="h-2" indicatorClassName={getProgressColor(progress)} />
                    <p className="text-xs text-muted-foreground mt-2">
                        {progress === 100
                            ? "✅ Eligible for placements"
                            : "Complete all sections to become eligible"}
                    </p>
                </CardContent>
            </Card>

            {/* Profile Sections Accordion */}
            <div className="grid gap-4">
                {sections.map((section) => (
                    <div key={section.id} className="space-y-2">
                        <Card
                            className={`cursor-pointer transition-all ${expandedSection === section.id ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
                                }`}
                            onClick={() => toggleSection(section.id)}
                        >
                            <CardHeader className="py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg bg-primary/10 text-primary`}>
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{section.title}</CardTitle>
                                        <CardDescription className="text-xs">{section.description}</CardDescription>
                                    </div>
                                    {expandedSection === section.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Expanded Content */}
                        {expandedSection === section.id && (
                            <div className="px-1 animate-in slide-in-from-top-2 duration-200">
                                {section.component ? (
                                    <section.component onSave={refreshProfile} />
                                ) : (
                                    <Card>
                                        <CardContent className="pt-6">
                                            <p className="text-sm text-muted-foreground text-center">Section under development.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Placement Analysis Section */}
            <div className="mt-8">
                <PlacementEligibility />
            </div>
        </div>
    )
}

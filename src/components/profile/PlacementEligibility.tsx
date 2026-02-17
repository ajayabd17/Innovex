import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabaseService } from "@/data/supabaseService";
import { XCircle, AlertTriangle, Building2, Briefcase } from "lucide-react";

// Mock Requirements Generator based on Company Category/Name
// In a real app, this would come from the 'hiring_rounds' or 'company_skill_scores' tables
const getCompanyRequirements = (company: any) => {
    const name = company.name?.toLowerCase() || "";
    const category = company.category || "Regular";

    // Default Requirements (Level 2/5 baseline)
    let req = {
        role: "Software Engineer Trainee",
        languages: ["Java", "Python"],
        core_subjects: { "OOPS": 2, "DBMS": 2 },
        tools: ["Git"]
    };

    if (name.includes("amazon") || name.includes("google") || name.includes("microsoft")) {
        req = {
            role: "SDE - I",
            languages: ["Java", "C++", "Python"],
            core_subjects: {
                "Data Structures & Algorithms": 4,
                "OOPS": 4,
                "Operating Systems": 3,
                "DBMS": 3,
                "Computer Networks": 3
            },
            tools: ["Git", "Linux", "AWS"]
        };
    } else if (name.includes("tcs") || name.includes("infosys") || name.includes("wipro") || name.includes("accenture")) {
        req = {
            role: "System Engineer",
            languages: ["Java", "Python", "C"],
            core_subjects: { "OOPS": 2, "DBMS": 2 },
            tools: []
        };
    } else if (name.includes("zoho") || name.includes("freshworks")) {
        req = {
            role: "Product Developer",
            languages: ["Java", "C++"],
            core_subjects: { "Data Structures & Algorithms": 3, "OOPS": 3, "DBMS": 3 },
            tools: ["Git"]
        };
    } else if (category === "Marquee") {
        req = {
            role: "Software Development Engineer",
            languages: ["Java", "C++", "Python"],
            core_subjects: { "Data Structures & Algorithms": 3, "OOPS": 3, "DBMS": 3 },
            tools: ["Git"]
        };
    }

    return req;
};

export function PlacementEligibility() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const netId = localStorage.getItem("userNetId") || "";

    useEffect(() => {
        async function calculateMatches() {
            if (!netId) return;
            setLoading(true);

            // 1. Fetch Student Skills
            const skills = await supabaseService.getStudentSkillMatrix(netId);

            // 2. Fetch All Companies
            const companies = await supabaseService.getAllCompanies();

            // 3. Match against each
            const results = companies.map((company: any) => {
                const reqs = getCompanyRequirements(company);

                // Custom Logic for this component to handle variable proficiency requirements
                // (Overriding the standard ScoringEngine for this specific display)
                const studentLangs = (skills.languages as any[])?.map(l => l.language) || [];
                const studentCores = skills.core_subjects || {};
                const studentTools = skills.tools || [];

                const matches: string[] = [];
                const gaps: string[] = [];
                const proficiencyGaps: { skill: string, current: number, required: number }[] = [];

                let earnedWeight = 0;
                let totalWeight = 0;

                // 1. Languages
                const requiredLangs = reqs.languages || [];
                const langMatch = requiredLangs.some((r: string) => studentLangs.includes(r));
                totalWeight += 20;
                if (langMatch) {
                    earnedWeight += 20;
                    matches.push(`Language Match (${requiredLangs.find((r: string) => studentLangs.includes(r))})`);
                } else {
                    gaps.push(`Missing Language: ${requiredLangs.join(" or ")}`);
                }

                // 2. Core Subjects (Weighted by specific level requirement)
                const requiredCores = reqs.core_subjects || {};
                Object.entries(requiredCores).forEach(([core, level]) => {
                    const requiredLevel = Number(level);
                    totalWeight += 10;
                    const rating = (studentCores as any)[core] || 0;

                    if (rating >= requiredLevel) {
                        earnedWeight += 10;
                        matches.push(core);
                    } else if (rating > 0) {
                        earnedWeight += 5; // Partial credit
                        proficiencyGaps.push({ skill: core, current: rating, required: requiredLevel });
                    } else {
                        gaps.push(`Missing Core Subject: ${core}`);
                    }
                });

                // 3. Tools
                const requiredTools = reqs.tools || [];
                requiredTools.forEach((tool: string) => {
                    totalWeight += 5;
                    if (studentTools.includes(tool)) {
                        earnedWeight += 5;
                        matches.push(tool);
                    } else {
                        gaps.push(`Missing Tool: ${tool}`);
                    }
                });

                const matchScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

                return {
                    company,
                    reqs,
                    analysis: {
                        matchScore,
                        matches,
                        gaps,
                        proficiencyGaps
                    }
                };
            });

            // 4. Sort by Match Score (High to Low)
            results.sort((a, b) => b.analysis.matchScore - a.analysis.matchScore);

            setMatches(results);
            setLoading(false);
        }
        calculateMatches();
    }, [netId]);

    const getMatchColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    }

    if (loading) return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-lg" />)}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight">Eligible Opportunities</h2>
                <p className="text-muted-foreground text-sm">
                    Based on your skill matrix, here are companies you are eligible for.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {matches.map(({ company, reqs, analysis }) => (
                    <Card key={company.company_id} className={`transition-all hover:shadow-md ${analysis.matchScore < 50 ? 'opacity-80' : ''}`}>
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                {/* Left: Company Info */}
                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r bg-slate-50/50 flex flex-col justify-center items-center text-center space-y-3">
                                    <div className="h-16 w-16 bg-white rounded-lg shadow-sm border p-2 flex items-center justify-center">
                                        {company.logo_url ? (
                                            <img src={company.logo_url} alt={company.name} className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <Building2 className="h-8 w-8 text-slate-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{company.name}</h3>
                                        <Badge variant="secondary" className="mt-1">{company.category}</Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        {reqs.role}
                                    </div>
                                </div>

                                {/* Right: Analysis */}
                                <div className="p-6 md:w-2/3 space-y-4">
                                    {/* Score Header */}
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <div className="text-sm font-medium text-muted-foreground">Match Confidence</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-2xl font-bold ${analysis.matchScore >= 80 ? 'text-green-600' : analysis.matchScore >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                                                    {analysis.matchScore}%
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {analysis.matchScore >= 80 ? "Highly Eligible" : analysis.matchScore >= 50 ? "Moderate Chance" : "Skill Gap High"}
                                                </span>
                                            </div>
                                        </div>
                                        <Progress
                                            value={analysis.matchScore}
                                            className="w-24 h-2"
                                            indicatorClassName={analysis.matchScore >= 80 ? 'bg-green-500' : analysis.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
                                        />
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        {/* Gaps */}
                                        <div className="space-y-1">
                                            <div className="font-semibold text-red-700 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                                                <XCircle className="h-3.5 w-3.5" /> Missing Skills
                                            </div>
                                            {analysis.gaps.length > 0 ? (
                                                <ul className="space-y-1 pl-1">
                                                    {analysis.gaps.slice(0, 3).map((g: string) => (
                                                        <li key={g} className="text-muted-foreground text-xs truncate" title={g}>• {g}</li>
                                                    ))}
                                                    {analysis.gaps.length > 3 && (
                                                        <li className="text-xs text-red-500 font-medium pl-2">+{analysis.gaps.length - 3} more...</li>
                                                    )}
                                                </ul>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">None</span>
                                            )}
                                        </div>

                                        {/* Proficiency */}
                                        <div className="space-y-1">
                                            <div className="font-semibold text-yellow-700 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                                                <AlertTriangle className="h-3.5 w-3.5" /> Improvements
                                            </div>
                                            {analysis.proficiencyGaps.length > 0 ? (
                                                <ul className="space-y-1 pl-1">
                                                    {analysis.proficiencyGaps.slice(0, 2).map((pg: any) => (
                                                        <li key={pg.skill} className="text-muted-foreground text-xs">
                                                            • {pg.skill} (L{pg.current} → L{pg.required})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">None</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="pt-2 flex justify-between items-center gap-4">
                                        {analysis.matchScore < 50 && (
                                            <div className="bg-red-50 text-red-800 text-xs p-2 rounded border border-red-100 flex-1">
                                                <strong>Tip:</strong> Learning <u>{analysis.gaps[0]?.replace('Missing Tool: ', '').replace('Missing Language: ', '')}</u> increases your chance by ~15%.
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-auto shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/companies/${company.company_id}`);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                    {analysis.matchScore >= 50 && (
                                        <div className="pt-2 flex justify-end">
                                            <Button
                                                size="sm"
                                                className=""
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/companies/${company.company_id}`);
                                                }}
                                            >
                                                View Hiring Process &rarr;
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {matches.length === 0 && !loading && (
                    <div className="text-center p-8 text-muted-foreground">
                        No companies found.
                    </div>
                )}
            </div>
        </div>
    );
}

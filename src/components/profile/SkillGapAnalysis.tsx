import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScoringEngine } from "@/lib/scoringEngine";
import { supabaseService } from "@/data/supabaseService";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Requirements for a "Dream" Company
const DREAM_COMPANY_REQ = {
    name: "Amazon",
    role: "SDE-1",
    languages: ["Java", "C++", "Python"], // Needs one of these
    core_subjects: ["Data Structures & Algorithms", "OOPS", "Operating Systems", "DBMS"],
    tools: ["Git", "AWS", "Linux"]
};

export function SkillGapAnalysis() {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const netId = localStorage.getItem("userNetId") || "";

    useEffect(() => {
        async function runAnalysis() {
            if (!netId) return;
            const skills = await supabaseService.getStudentSkillMatrix(netId);
            const result = ScoringEngine.calculateSkillMatch(skills, DREAM_COMPANY_REQ);
            setAnalysis(result);
            setLoading(false);
        }
        runAnalysis();
    }, [netId]);

    if (loading) return <div className="text-sm text-muted-foreground">Running analysis...</div>;

    if (!analysis) return null;

    return (
        <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">Placement Eligibility Check</CardTitle>
                        <CardDescription>Target: <strong>{DREAM_COMPANY_REQ.name}</strong> ({DREAM_COMPANY_REQ.role})</CardDescription>
                    </div>
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${analysis.matchScore > 75 ? 'text-green-600' : analysis.matchScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {analysis.matchScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">Match Score</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Progress
                    value={analysis.matchScore}
                    className="h-2"
                    indicatorClassName={analysis.matchScore > 75 ? 'bg-green-500' : analysis.matchScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {/* Matches */}
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="h-4 w-4" /> Strong Matches
                        </h4>
                        {analysis.matches.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {analysis.matches.map((m: string) => (
                                    <Badge key={m} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        {m}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic text-xs">No strong matches found yet.</p>
                        )}
                    </div>

                    {/* Gaps */}
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-red-700">
                            <XCircle className="h-4 w-4" /> Critical Gaps
                        </h4>
                        {analysis.gaps.length > 0 ? (
                            <ul className="space-y-1">
                                {analysis.gaps.map((gap: string) => (
                                    <li key={gap} className="text-red-600 flex items-start gap-2 text-xs">
                                        <span>•</span> {gap}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground italic text-xs">No critical gaps!</p>
                        )}
                    </div>
                </div>

                {/* Proficiency Gaps */}
                {analysis.proficiencyGaps.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        <h4 className="font-semibold flex items-center gap-2 text-yellow-800 mb-2">
                            <AlertTriangle className="h-4 w-4" /> Proficiency Improvements Needed
                        </h4>
                        <div className="space-y-2">
                            {analysis.proficiencyGaps.map((pg: any) => (
                                <div key={pg.skill} className="flex justify-between items-center text-xs text-yellow-800">
                                    <span>{pg.skill}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">L{pg.current}</Badge>
                                        <ArrowRight className="h-3 w-3" />
                                        <Badge variant="default" className="bg-yellow-600 hover:bg-yellow-700">Target: L{pg.required}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <Button variant="link" className="p-0 h-auto text-primary text-xs">
                        View recommended learning paths for these gaps &rarr;
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

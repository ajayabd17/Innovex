
import { useEffect, useState } from "react"
import { supabaseService } from "@/data/supabaseService"
import type { InnovxData, InnovxProject } from "@/types/schema"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Target, Zap } from "lucide-react"

interface InnovxListProps {
    companyId: number;
    year?: string;
    preloadedData?: InnovxData; // Allow passing data directly to avoid refetching
}

export function InnovxList({ companyId, preloadedData }: InnovxListProps) {
    const [innovxData, setInnovxData] = useState<InnovxData | undefined>(preloadedData)
    const [loading, setLoading] = useState(!preloadedData)

    useEffect(() => {
        if (preloadedData) {
            setInnovxData(preloadedData)
            setLoading(false)
            return
        }

        async function loadData() {
            setLoading(true)
            // Note: getInnovxByCompany might need to be updated to return InnovxData structure
            // For now, we assume the service returns the full object 
            const data = await supabaseService.getInnovxByCompany(companyId) as any
            // The service returns the ROW, so we need the .innovx_data column if it exists, or the row itself?
            // checking supabaseService implementation:
            // "const fullDetails = jsonRes.data?.full_json || {}" ... "innovx_data?: InnovxData"

            // If we are calling getInnovxByCompany, it returns "InnovxRaw" which has "innovx_data".
            setInnovxData(data?.innovx_data || data)
            setLoading(false)
        }
        loadData()
    }, [companyId, preloadedData])

    if (loading) return <div className="text-sm text-muted-foreground p-4">Loading innovations...</div>

    const projects = innovxData?.innovx_projects || []

    if (projects.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed rounded-lg bg-muted/50">
                <p className="text-muted-foreground">No innovation projects found for this company.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {projects.map((item: InnovxProject, idx: number) => {
                const isTier1 = item.tier_level === 'Tier 1';
                return (
                    <Card key={idx} className={`flex flex-col h-full border-t-4 ${isTier1 ? 'border-t-blue-600 shadow-md' : 'border-t-slate-400'}`}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2 gap-2">
                                <Badge variant={isTier1 ? "default" : "secondary"} className="mb-1">
                                    {item.tier_level || 'Project'}
                                </Badge>
                                {item.business_value && (
                                    <Badge variant="outline" className="text-xs font-normal border-green-200 text-green-700 bg-green-50">
                                        Value: {item.business_value}
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-lg leading-tight text-primary">
                                {item.project_name || "Innovation Initiative"}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                                {item.problem_statement}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                                {item.ai_ml_technologies?.map((tech, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground pt-2 border-t">
                                <div>
                                    <span className="font-semibold text-foreground flex items-center gap-1">
                                        <Target className="h-3 w-3" /> Target Users
                                    </span>
                                    <span className="line-clamp-1" title={item.target_users}>{item.target_users || "-"}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-foreground flex items-center gap-1">
                                        <Zap className="h-3 w-3" /> Primary Use Case
                                    </span>
                                    <span className="line-clamp-1" title={item.primary_use_case}>{item.primary_use_case || "-"}</span>
                                </div>
                            </div>

                            {/* Success Metrics */}
                            {item.success_metrics?.length > 0 && (
                                <div className="pt-2 border-t">
                                    <span className="text-xs font-semibold flex items-center gap-1 mb-1">
                                        <CheckCircle2 className="h-3 w-3 text-green-600" /> Success Metrics
                                    </span>
                                    <ul className="list-disc list-inside text-xs text-muted-foreground pl-1">
                                        {item.success_metrics.slice(0, 2).map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

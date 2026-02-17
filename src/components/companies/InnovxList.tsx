
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

    const safeRender = (val: any) => {
        if (!val) return null
        if (typeof val === 'string') return val
        if (typeof val === 'number') return String(val)
        if (typeof val === 'object') return JSON.stringify(val)
        return String(val)
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, idx) => (
                <Card key={idx} className="group hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800">
                                {safeRender(project.tier_level) || "Initiative"}
                            </Badge>
                            {project.business_value && (
                                <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                                    Value: {safeRender(project.business_value)}
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-xl">{safeRender(project.project_name)}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                            {safeRender(project.problem_statement)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Technologies */}
                        {project.ai_ml_technologies && Array.isArray(project.ai_ml_technologies) && project.ai_ml_technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {project.ai_ml_technologies.slice(0, 3).map(tech => (
                                    <Badge key={tech} variant="secondary" className="px-1.5 py-0 text-[10px] font-normal">
                                        {safeRender(tech)}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t">
                            <div>
                                <span className="font-bold flex items-center gap-1 mb-1 text-muted-foreground">
                                    <Target className="h-3 w-3" /> Target Users
                                </span>
                                <span className="text-foreground">{safeRender(project.target_users) || "N/A"}</span>
                            </div>
                            <div>
                                <span className="font-bold flex items-center gap-1 mb-1 text-muted-foreground">
                                    <Zap className="h-3 w-3" /> Primary Use Case
                                </span>
                                <span className="text-foreground">{safeRender(project.primary_use_case) || "N/A"}</span>
                            </div>
                        </div>

                        {project.success_metrics && Array.isArray(project.success_metrics) && project.success_metrics.length > 0 && (
                            <div className="pt-2">
                                <span className="font-bold flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" /> Success Metrics
                                </span>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    {project.success_metrics.slice(0, 2).map((metric, i) => (
                                        <li key={i}>{safeRender(metric)}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

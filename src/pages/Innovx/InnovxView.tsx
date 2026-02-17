import { useEffect, useState } from "react"
import { supabaseService } from "@/data/supabaseService"
import type { InnovxRaw } from "@/types/schema"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Rocket, Lightbulb, Zap, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export default function InnovxView() {
    const [innovxList, setInnovxList] = useState<InnovxRaw[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadData() {
            // Check cache
            const cached = sessionStorage.getItem("innovx_cache");
            if (cached) {
                setInnovxList(JSON.parse(cached));
                setLoading(false);
            } else {
                setLoading(true);
            }

            const data = await supabaseService.getInnovx();
            setInnovxList(data);
            setLoading(false);
            sessionStorage.setItem("innovx_cache", JSON.stringify(data));
        }
        loadData()
    }, [])

    if (loading) return <div className="p-8 text-center">Loading InnovX data...</div>

    // Helper to safely render potential objects/arrays
    const safeRender = (val: any, fallback = "N/A") => {
        if (!val) return fallback
        if (typeof val === 'string') return val
        if (typeof val === 'number') return String(val)
        if (Array.isArray(val)) return val.join(", ")
        if (typeof val === 'object') return JSON.stringify(val)
        return String(val)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">INNOVX Directory</h1>
                <p className="text-muted-foreground">Explore innovation profiles across top companies.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {innovxList.map((record, idx) => {
                    const company = record.companies
                    const innovx = record.innovx_data
                    const master = innovx?.innovx_master || (innovx as any)
                    const projectCount = innovx?.innovx_projects?.length || 0

                    if (!company) return null

                    return (
                        <Card key={idx} className="hover:shadow-lg transition-all cursor-pointer border-t-4 border-t-indigo-500 group" onClick={() => navigate(`/companies/${record.company_id}/innovx`)}>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt={company.name} className="h-12 w-12 object-contain bg-white rounded border p-1" />
                                    ) : (
                                        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                    )}
                                    <Badge variant="secondary" className="group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                                        {projectCount} Initiatives
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">{company.name}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {safeRender(master?.industry || "Technology")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Core Focus</div>
                                    <div className="flex flex-wrap gap-1">
                                        {/* Try to extract some tags from master or fallback to generic */}
                                        <Badge variant="outline" className="text-xs font-normal">
                                            {safeRender(master?.core_business_model || "Innovation")}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs font-normal">
                                            {safeRender(master?.target_market || "Global")}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 border-t flex justify-between items-center text-sm text-indigo-600 font-medium">
                                    View Innovation Profile
                                    <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {!loading && innovxList.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No companies with innovation data found.
                </div>
            )}
        </div>
    )
}

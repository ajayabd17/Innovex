
import { useOutletContext } from "react-router-dom"
import type { CompanyData } from "@/types/schema"
import { InnovxList } from "@/components/companies/InnovxList" // Keep this, we need to update it separately if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Rocket, Target, Globe, Briefcase } from "lucide-react"

export default function CompanyInnovx() {
    const context = useOutletContext<{ company: CompanyData }>()

    if (!context || !context.company) {
        return <div className="p-4 text-red-500">Error: Company context not found.</div>
    }

    const { company } = context
    const innovx = company.innovx_data
    // Fallback: Check for nested "innovx_master" OR use the root object if keys exist there.
    // This handles cases where data might be flattened in the DB.
    const master = innovx?.innovx_master || (innovx as any)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Master Strategy Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50/50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> Industry Focus
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-blue-900">{master?.industry || company.nature_of_company || "N/A"}</p>
                        <p className="text-xs text-blue-700/70 mt-1">{master?.sub_industry || ""}</p>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50/50 border-purple-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
                            <Rocket className="h-4 w-4" /> Core Model
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-purple-900">{master?.core_business_model || "N/A"}</p>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50/50 border-orange-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
                            <Target className="h-4 w-4" /> Target Market
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-orange-900">{master?.target_market || "N/A"}</p>
                    </CardContent>
                </Card>

                <Card className="bg-green-50/50 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <Globe className="h-4 w-4" /> Reach
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-green-900">{master?.geographic_focus || "Global"}</p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Innovation Projects List */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    Innovation Initiatives
                </h2>
                {/* We pass the whole innovx_data object or projects array to a list component, 
                    or render them here directly if InnovxList isn't suitable. 
                    Let's use InnovxList but maybe we need to update it to support the new JSON structure. 
                    For now, passing companyId lets it fetch its own data, but since we HAVE the data in 'company.innovx_data', 
                    we should probably pass it down to avoid re-fetching! 
                */}
                <InnovxList companyId={company.company_id} preloadedData={innovx} />
            </div>

            {/* 3. Strategic Pillars (Optional addition based on JSON) */}
            {innovx?.strategic_pillars && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold tracking-tight mb-4">Strategic Pillars</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {innovx.strategic_pillars.map((pillar, idx) => (
                            <Card key={idx} className="border-t-4 border-t-indigo-500">
                                <CardHeader>
                                    <div className="text-xs uppercase font-bold text-indigo-500 tracking-wider mb-1">{pillar.focus_area}</div>
                                    <CardTitle className="text-lg">{pillar.pillar_name}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {pillar.pillar_description}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


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
            setLoading(true)
            const data = await supabaseService.getInnovx()
            setInnovxList(data)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) return <div className="p-8 text-center">Loading InnovX data...</div>

    // Helper to extract innovations from the JSON blob
    const allInnovations = innovxList.flatMap(company => {
        const roadmap = company.innovx_data?.innovation_roadmap || [];
        return roadmap.map((item: any) => ({
            ...item,
            companyName: company.companies?.name,
            companyLogo: company.companies?.logo_url,
            companyId: company.company_id
        }))
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">INNOVX</h1>
                <p className="text-muted-foreground">Global Innovation Roadmap</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allInnovations.map((item, idx) => (
                    <Card key={idx} className="border-t-4 border-t-blue-500 hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline">{item.status || 'Active'}</Badge>
                                <div
                                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary"
                                    onClick={() => navigate(`/companies/${item.companyId}`)}
                                >
                                    {item.companyLogo ? (
                                        <img src={item.companyLogo} alt={item.companyName} className="h-6 w-6 object-contain" />
                                    ) : (
                                        <Building2 className="h-4 w-4" />
                                    )}
                                    <span className="truncate max-w-[100px]">{item.companyName}</span>
                                </div>
                            </div>
                            <CardTitle className="text-lg">{item.bet_name || "Innovation"}</CardTitle>
                            <CardDescription>{item.horizon || "Future"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {item.description || "No description available."}
                            </p>
                            {item.strategic_value && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs font-semibold mb-1">Strategic Value:</p>
                                    <p className="text-xs text-muted-foreground">{item.strategic_value}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}


import { useEffect, useState } from "react"
import { supabaseService } from "@/data/supabaseService"
import type { InnovxRaw } from "@/types/schema"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InnovxListProps {
    companyId: number
}

export function InnovxList({ companyId }: InnovxListProps) {
    const [innovxData, setInnovxData] = useState<InnovxRaw | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const data = await supabaseService.getInnovxByCompany(companyId)
            setInnovxData(data)
            setLoading(false)
        }
        loadData()
    }, [companyId])

    if (loading) return <div className="text-sm text-muted-foreground">Loading innovations...</div>

    if (!innovxData || !innovxData.innovx_data?.innovation_roadmap) {
        return (
            <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No innovation records found for this company.</p>
            </div>
        )
    }

    const roadmap = innovxData.innovx_data.innovation_roadmap || []

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {roadmap.map((item: any, idx: number) => (
                <Card key={idx} className="border-t-4 border-t-purple-500">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{item.status || 'Active'}</Badge>
                        </div>
                        <CardTitle className="text-lg">{item.bet_name || "Innovation Project"}</CardTitle>
                        <CardDescription>{item.horizon}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {item.description}
                        </p>
                        {item.strategic_value && (
                            <div className="pt-2 border-t">
                                <p className="text-xs font-semibold mb-1">Strategic Value:</p>
                                <p className="text-xs text-muted-foreground">{item.strategic_value}</p>
                            </div>
                        )}
                        {item.kpis && (
                            <div className="pt-2 border-t">
                                <p className="text-xs font-semibold mb-1">KPIs:</p>
                                <p className="text-xs text-muted-foreground">{item.kpis}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

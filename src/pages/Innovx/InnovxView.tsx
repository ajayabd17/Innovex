
import { useEffect, useState } from "react"
import { supabaseService } from "@/data/supabaseService"
import type { CompanyData } from "@/types/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function InnovxEntry() {
    const [companies, setCompanies] = useState<CompanyData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                const data = await supabaseService.getAllCompanies()
                if (Array.isArray(data)) {
                    setCompanies(data)
                } else {
                    console.error("Data is not an array:", data)
                    setCompanies([])
                }
            } catch (err: any) {
                console.error("Failed to load InnovX data:", err)
                setError(err.message || "Unknown error occurred")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const filteredCompanies = companies.filter(c => {
        if (!c) return false
        const nameMatch = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
        const categoryMatch = (c.category || "").toLowerCase().includes(searchQuery.toLowerCase())
        return nameMatch || categoryMatch
    })

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading InnovX ecosystem...</div>

    if (error) return (
        <div className="p-8 text-center text-red-500 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="font-bold">Error Loading Page</h3>
            <p>{error}</p>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4 pt-8">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                    InnovX Accelerator
                    <Badge variant="outline" className="text-lg py-1 px-3 border-blue-200 text-blue-600">
                        {companies.length}
                    </Badge>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Explore industry trends, innovation roadmaps, and strategic outcomes from our top partners.
                </p>

                <div className="relative max-w-lg mx-auto mt-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search companies by name or category..."
                        className="pl-10 h-12 text-lg shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Companies Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
                {filteredCompanies.map((company) => (
                    <Card
                        key={company.company_id}
                        className="group hover:shadow-lg transition-all cursor-pointer border-t-4 border-t-transparent hover:border-t-primary"
                        onClick={() => navigate(`/companies/${company.company_id}/innovx`)}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            {company.logo_url ? (
                                <img src={company.logo_url} alt={company.name || "Company"} className="h-12 w-12 object-contain bg-white rounded-md border p-1" />
                            ) : (
                                <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center font-bold text-primary">
                                    {(company.name || "C").substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-lg">{company.name}</CardTitle>
                                <Badge variant="secondary" className="mt-1 text-xs">{company.category}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {company.innovx_data?.innovx_master ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-[max-content_1fr] gap-2 items-start">
                                            <span className="font-semibold text-muted-foreground whitespace-nowrap">Target:</span>
                                            <span className="font-medium text-foreground line-clamp-1" title={company.innovx_data.innovx_master.target_market}>
                                                {company.innovx_data.innovx_master.target_market}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-[max-content_1fr] gap-2 items-start">
                                            <span className="font-semibold text-muted-foreground whitespace-nowrap">Core Model:</span>
                                            <span className="text-foreground line-clamp-2 leading-tight" title={company.innovx_data.innovx_master.core_business_model}>
                                                {company.innovx_data.innovx_master.core_business_model}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {company.nature_of_company ? `A leader in ${company.nature_of_company}.` : "Driving innovation in their sector."}
                                    </p>
                                )}
                                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Innovation Roadmap <ArrowRight className="ml-1 h-4 w-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {!loading && filteredCompanies.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No companies found matching "{searchQuery}"
                </div>
            )}
        </div>
    )
}

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabaseService } from "@/data/supabaseService"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [metrics, setMetrics] = useState({ total: 0, marquee: 0, superDream: 0, dream: 0, regular: 0 })
    const [previewCompanies, setPreviewCompanies] = useState<any[]>([])

    useEffect(() => {
        async function fetchData() {
            // Parallel fetch for speed
            const [metricsData, allCompanies] = await Promise.all([
                supabaseService.getMetrics(),
                supabaseService.getAllCompanies()
            ])

            setMetrics(metricsData)
            // Show top 4 companies, preferentially Marquee or Super Dream
            const sorted = allCompanies.sort((a: any, b: any) => {
                const priority = { "Marquee": 3, "Super Dream": 2, "Dream": 1, "Regular": 0 }
                const scoreA = priority[a.category as keyof typeof priority] || 0
                const scoreB = priority[b.category as keyof typeof priority] || 0
                return scoreB - scoreA
            })
            setPreviewCompanies(sorted.slice(0, 4))
        }
        fetchData()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/companies?search=${searchQuery}`)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of placement statistics and company insights.
                </p>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("/companies")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.total}</div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("/companies?category=Marquee")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Marquee</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{metrics.marquee}</div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("/companies?category=Super Dream")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Super Dream</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{metrics.superDream}</div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("/companies?category=Dream")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dream</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{metrics.dream}</div>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("/companies?category=Regular")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Regular</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{metrics.regular}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Section */}
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold">Find a Company</h2>
                    <p className="text-muted-foreground">Search by name, sector, or skill requirements</p>
                </div>
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for companies..."
                        className="pl-10 h-12 text-lg shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Top Recruiters</h2>
                    <Button variant="link" onClick={() => navigate('/companies')}>View All Companies &rarr;</Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {previewCompanies.map((company) => (
                        <Card key={company.company_id} className="group cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-primary/0 hover:border-l-primary" onClick={() => navigate(`/companies/${company.company_id}`)}>
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="h-12 w-12 rounded bg-white border flex items-center justify-center overflow-hidden">
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt={company.name || 'Company'} className="h-full w-full object-contain p-1" />
                                    ) : (
                                        <span className="text-xl font-bold text-muted-foreground">{company.name?.substring(0, 1)}</span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-base truncate w-32 md:w-40">{company.name}</CardTitle>
                                    <CardDescription className="text-xs">{company.category}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-xs text-muted-foreground line-clamp-2 mt-2">
                                    {company.overview_text || company.nature_of_company}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {previewCompanies.length === 0 && (
                        <div className="col-span-full text-center py-8 text-muted-foreground">Loading companies...</div>
                    )}
                </div>
            </div>
        </div>
    )
}

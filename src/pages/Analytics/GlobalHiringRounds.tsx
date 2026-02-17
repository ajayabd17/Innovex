
import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabaseService } from "@/data/supabaseService"

export default function GlobalHiringRounds() {
    const navigate = useNavigate()
    const [companies, setCompanies] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function fetchCompanies() {
            // Check cache
            const cached = sessionStorage.getItem("hiring_rounds_cache");
            if (cached) {
                setCompanies(JSON.parse(cached));
            }

            const data = await supabaseService.getAllCompanies();
            setCompanies(data);
            sessionStorage.setItem("hiring_rounds_cache", JSON.stringify(data));
        }
        fetchCompanies()
    }, [])

    const filteredCompanies = useMemo(() => {
        if (!searchQuery) return companies
        const lower = searchQuery.toLowerCase()
        return companies.filter(c => c.name.toLowerCase().includes(lower))
    }, [companies, searchQuery])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hiring Rounds</h1>
                <p className="text-muted-foreground">Explore company-specific hiring processes and selection stages.</p>
            </div>

            <div className="relative max-w-xl">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search company by name (e.g. Google, Amazon)..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map(c => (
                    <Card
                        key={c.company_id}
                        className="cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                        onClick={() => navigate(`/companies/${c.company_id}/process`)}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="h-12 w-12 rounded bg-muted/50 border flex items-center justify-center overflow-hidden font-bold text-lg text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                {c.logo_url ? (
                                    <img src={c.logo_url} alt={c.name} className="h-full w-full object-contain p-1" />
                                ) : (
                                    c.name.substring(0, 1)
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-base group-hover:text-primary transition-colors">{c.name}</CardTitle>
                                <CardDescription className="text-xs">{c.category} • {c.location || "Global"}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {filteredCompanies.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No companies found matching "{searchQuery}"
                </div>
            )}
        </div>
    )
}

import { useState, useMemo, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Search, MapPin, Users, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabaseService } from "@/data/supabaseService"
import type { Company, CompanyData } from "@/types/schema"

export default function CompanyList() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [companies, setCompanies] = useState<any[]>([])

    const categoryFilter = searchParams.get("category") || "All"
    const searchQuery = searchParams.get("search") || ""

    useEffect(() => {
        async function fetchCompanies() {
            const data = await supabaseService.getAllCompanies()
            setCompanies(data)
        }
        fetchCompanies()
    }, [])

    const filteredCompanies = useMemo(() => {
        return companies.filter((company) => {
            const matchesCategory = categoryFilter === "All" || company.category === categoryFilter
            const matchesSearch =
                company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                company.nature_of_company?.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesCategory && matchesSearch
        })
    }, [companies, categoryFilter, searchQuery])

    const categories = ["All", "Marquee", "Super Dream", "Dream", "Regular"]

    const handleCategoryChange = (cat: string) => {
        setSearchParams(prev => {
            if (cat === "All") {
                prev.delete("category")
            } else {
                prev.set("category", cat)
            }
            return prev
        })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSearchParams(prev => {
            if (val) {
                prev.set("search", val)
            } else {
                prev.delete("search")
            }
            return prev
        })
    }

    const getCategoryColor = (cat: string | null) => {
        switch (cat) {
            case "Marquee": return "bg-purple-100 text-purple-800 border-purple-200"
            case "Super Dream": return "bg-blue-100 text-blue-800 border-blue-200"
            case "Dream": return "bg-green-100 text-green-800 border-green-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
                    <p className="text-muted-foreground">Browsable catalog of recruiting companies.</p>
                </div>
                <div className="flex items-center space-x-2">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={categoryFilter === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search companies..."
                    className="pl-9 max-w-md"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map((company) => (
                    <Card key={company.company_id} className="group cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-primary/0 hover:border-l-primary" onClick={() => navigate(`/companies/${company.company_id}`)}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="h-12 w-12 rounded bg-white border flex items-center justify-center text-xl font-bold text-muted-foreground overflow-hidden">
                                    {company.logo_url ? (
                                        <img
                                            src={company.logo_url}
                                            alt={company.name || 'Company'}
                                            className="h-full w-full object-contain p-1"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerText = company.name?.substring(0, 1) || 'C';
                                                e.currentTarget.parentElement!.className = "h-12 w-12 rounded bg-white border flex items-center justify-center text-xl font-bold text-muted-foreground overflow-hidden";
                                            }}
                                        />
                                    ) : (
                                        company.name?.substring(0, 1)
                                    )}
                                </div>
                                <Badge variant="outline" className={getCategoryColor(company.category)}>
                                    {company.category}
                                </Badge>
                            </div>
                            <CardTitle className="mt-4">{company.name}</CardTitle>
                            <CardDescription>{company.nature_of_company}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{company.headquarters_address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{company.employee_size} Employees</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Est. {company.incorporation_year}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">View Details →</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {filteredCompanies.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No companies found matching your criteria.
                </div>
            )}
        </div>
    )
}

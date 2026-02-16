import { useNavigate, useLocation, Link, NavLink } from "react-router-dom"
import { LayoutDashboard, Building2, BarChart3, GitGraph, Zap, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Hiring Skill Sets", href: "/skills", icon: BarChart3 },
    { name: "Hiring Process", href: "/hiring-process", icon: GitGraph },
    { name: "INNOVX", href: "/innovx", icon: Zap },
]

export function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const userEmail = localStorage.getItem("userEmail") || "Guest"

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("isAuthenticated")
            localStorage.removeItem("userEmail")
            navigate("/login")
        }
    }

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-6">
                <span className="text-lg font-bold tracking-tight text-primary">
                    SRM Analytics
                </span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid items-start px-2 text-sm font-medium">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isActive
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )
                            }
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4 bg-muted/20">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium leading-none truncate">{userEmail}</p>
                        <p className="text-xs text-muted-foreground truncate">Admin</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}

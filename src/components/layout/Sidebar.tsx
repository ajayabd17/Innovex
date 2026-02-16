import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Building2,
    BrainCircuit,
    GitGraph,
    Rocket,
} from "lucide-react"

const NAV_ITEMS = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Hiring Skill Sets", href: "/skills", icon: BrainCircuit },
    { name: "Hiring Process", href: "/hiring-process", icon: GitGraph },
    { name: "INNOVX", href: "/innovx", icon: Rocket },
]

export function Sidebar() {
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
            <div className="border-t p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">A</span>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">admin@srm.edu</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

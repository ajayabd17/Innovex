import { Outlet, useNavigate } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import srmLogo from "@/assets/srm-logo.webp"

export function Layout() {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-16 flex items-center px-4 border-b gap-3 bg-card shrink-0">
                    <img src={srmLogo} alt="SRM Logo" className="h-8 w-8 object-contain" />
                    <span className="font-bold text-sm md:text-base">SRM Placements & Research Analytics Portal</span>
                </div>
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

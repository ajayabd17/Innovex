import { useRef, useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import srmLogo from "@/assets/srm-logo.webp";

// Custom hook for scroll restoration in a specific container
function useScrollRestoration(ref: React.RefObject<HTMLElement>) {
    const location = useLocation();
    const navType = useNavigationType();

    // Save scroll position on route change
    useEffect(() => {
        const currentPath = location.pathname;
        const scrollContainer = ref.current;

        return () => {
            if (scrollContainer) {
                const key = `scroll_pos:${currentPath}`;
                sessionStorage.setItem(key, scrollContainer.scrollTop.toString());
            }
        };
    }, [location.pathname, ref]);

    // Restore scroll position
    useLayoutEffect(() => {
        const scrollContainer = ref.current;
        if (!scrollContainer) return;

        const key = `scroll_pos:${location.pathname}`;

        if (navType === "POP") {
            // Back/Forward navigation - try to restore
            const savedPos = sessionStorage.getItem(key);
            if (savedPos) {
                // Small timeout to allow content to paint if needed, though data cache helps
                // Using requestAnimationFrame or generic timeout
                requestAnimationFrame(() => {
                    scrollContainer.scrollTop = parseInt(savedPos, 10);
                });
            }
        } else {
            // New navigation - Push to top
            scrollContainer.scrollTop = 0;
        }
    }, [location.pathname, navType, ref]);
}

export function Layout() {
    const mainRef = useRef<HTMLDivElement>(null);
    useScrollRestoration(mainRef);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-16 flex items-center px-4 border-b gap-3 bg-card shrink-0">
                    <img src={srmLogo} alt="SRM Logo" className="h-8 w-8 object-contain" />
                    <span className="font-bold text-sm md:text-base">SRM Placements & Research Analytics Portal</span>
                </div>
                <main ref={mainRef} className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}


import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 text-center p-8">
            <h1 className="text-4xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
                <Button onClick={() => navigate("/")}>
                    Go to Dashboard
                </Button>
            </div>
        </div>
    )
}

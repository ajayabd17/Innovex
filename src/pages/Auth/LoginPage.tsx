import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import srmLogo from "@/assets/srm-logo.webp"

export default function LoginPage() {
    const navigate = useNavigate()
    const [netId, setNetId] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isValidNetId, setIsValidNetId] = useState(true)

    // NetID validation: 2 letters + 4 digits + @srmist.edu.in
    const validateNetId = (value: string) => {
        const netIdRegex = /^[a-zA-Z]{2}\d{4}@srmist\.edu\.in$/
        return netIdRegex.test(value)
    }

    const handleNetIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setNetId(value)
        setError(null)

        // Only validate if user has typed something
        if (value.length > 0) {
            setIsValidNetId(validateNetId(value))
        } else {
            setIsValidNetId(true)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validate NetID format
        if (!validateNetId(netId)) {
            setError("Invalid NetID format. Use: xx1234@srmist.edu.in")
            setLoading(false)
            return
        }

        // Simulate network delay for effect
        setTimeout(() => {
            // Allow login (Password check removed as requested)
            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("userNetId", netId)
            localStorage.setItem("userEmail", netId) // Keep for compatibility
            navigate("/")
            setLoading(false)
        }, 800)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <img src={srmLogo} alt="SRM Logo" className="h-20 w-20 object-contain" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">SRM Placements & Research Analytics Portal</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the placement analytics dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="netid">NetID</Label>
                            <Input
                                id="netid"
                                type="text"
                                placeholder="NetID"
                                value={netId}
                                onChange={handleNetIdChange}
                                className={!isValidNetId ? "border-red-500 focus-visible:ring-red-500" : ""}
                                required
                            />
                            {!isValidNetId && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <span>⚠️</span>
                                    Format: 2 letters + 4 digits + @srmist.edu.in
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="text-sm text-red-500">{error}</div>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-xs text-muted-foreground">
                        Protected System. Authorized Access Only.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

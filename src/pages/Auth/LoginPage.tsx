import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import srmLogo from "@/assets/srm-logo.webp"

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Domain Check
        if (!email.toLowerCase().endsWith("@srmist.edu.in")) {
            setError("Access Restricted: Please use your University Email ID (@srmist.edu.in)")
            setLoading(false)
            return
        }

        // Mock Login
        try {
            await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network
            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("userEmail", email)
            navigate("/")
        } catch (err) {
            setError("Authentication failed")
        } finally {
            setLoading(false)
        }
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
                            <Label htmlFor="email">Email ID</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="netid@srmist.edu.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
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

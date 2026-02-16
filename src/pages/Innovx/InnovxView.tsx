import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Rocket, Lightbulb, Zap } from "lucide-react"

export default function InnovxView() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">INNOVX</h1>
                <p className="text-muted-foreground">Innovation roadmap and case studies.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Foundation */}
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Lightbulb className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle>Foundational</CardTitle>
                        <CardDescription>Core technology enhancements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                            <li>Cloud Migration Strategies</li>
                            <li>Legacy System Modernization</li>
                            <li>Data Pipeline Optimization</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Advanced */}
                <Card className="border-t-4 border-t-purple-500">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <Zap className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle>Advanced</CardTitle>
                        <CardDescription>AI & ML Integration</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                            <li>Predictive Analytics Models</li>
                            <li>Natural Language Processing</li>
                            <li>Computer Vision Applications</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Breakthrough */}
                <Card className="border-t-4 border-t-orange-500">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Rocket className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle>Breakthrough</CardTitle>
                        <CardDescription>Disruptive Innovations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                            <li>Quantum Computing Research</li>
                            <li>Blockchain Decentralization</li>
                            <li>Generative AI Agents</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

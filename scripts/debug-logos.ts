import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Robust env loading
const envPath = path.resolve(process.cwd(), '.env')
let supabaseUrl = process.env.VITE_SUPABASE_URL
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8')
        const lines = envConfig.split(/\r?\n/)
        lines.forEach(line => {
            const parts = line.split('=')
            if (parts.length >= 2) {
                const key = parts[0].trim()
                const val = parts.slice(1).join('=').trim()
                if (key === 'VITE_SUPABASE_URL') supabaseUrl = val
                if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = val
            }
        })
    }
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Failed to load VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLogos() {
    console.log("Checking for companies with MISSING logos...")

    const { data: companies, error } = await supabase
        .from('companies')
        .select(`
            company_id, 
            name, 
            company_logo (
                logo_url
            )
        `)
        .order('name')

    if (error) {
        console.error("Error fetching:", error)
        return
    }

    const missing = companies.filter((c: any) => {
        const logoData = Array.isArray(c.company_logo) ? c.company_logo[0] : c.company_logo
        return !logoData?.logo_url
    })

    console.log(`Total Companies: ${companies.length}`)
    console.log(`Companies with Missing Logos: ${missing.length}`)

    console.log("\n--- Sample Logo URLs: ---")
    companies.slice(0, 5).forEach((c: any) => {
        const logoData = Array.isArray(c.company_logo) ? c.company_logo[0] : c.company_logo
        console.log(`- ${c.name}: ${logoData?.logo_url}`)
    })

    if (missing.length > 0) {
        console.log("\n--- Missing Logos for: ---")
        missing.forEach((c: any) => console.log(`- ${c.name} (ID: ${c.company_id})`))
    } else {
        console.log("All companies have logos!")
    }
}

debugLogos()

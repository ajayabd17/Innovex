
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import https from 'https'

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
    console.error("Failed to load credentials")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            resolve(res.statusCode === 200)
        })
        req.on('error', () => resolve(false))
        req.end()
    })
}

async function verifyLogos() {
    console.log("Verifying logo URLs...")

    // Fetch all logos
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

    if (error || !companies) {
        console.error("Error fetching companies:", error)
        return
    }

    let badCount = 0
    for (const c of companies) {
        const logoData = Array.isArray(c.company_logo) ? c.company_logo[0] : c.company_logo
        const url = logoData?.logo_url

        if (!url) {
            console.log(`[MISSING] ${c.name}`)
            badCount++
            continue
        }

        const isValid = await checkUrl(url)
        if (!isValid) {
            console.log(`[BROKEN] ${c.name}: ${url}`)
            badCount++
        }
    }

    console.log(`Verification complete. ${badCount} issues found out of ${companies.length} companies.`)
}

verifyLogos()

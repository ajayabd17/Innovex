
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

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function showAllLogos() {
    console.log("Fetching ALL company logos...")

    const { data: companies, error } = await supabase
        .from('companies')
        .select(`
            name, 
            website_url,
            company_logo (
                logo_url
            )
        `)
        .order('name')

    if (error || !companies) {
        console.error("Error:", error)
        return
    }

    let existing = 0
    let missing = 0

    companies.forEach((c: any) => {
        const logoData = Array.isArray(c.company_logo) ? c.company_logo[0] : c.company_logo
        const url = logoData?.logo_url

        if (url) {
            existing++
            // console.log(`[OK] ${c.name}: ${url}`)
        } else {
            missing++
            console.log(`[MISSING] ${c.name} (${c.website_url})`)
        }
    })

    console.log(`\nSummary: ${existing} logos found, ${missing} missing.`)
}

showAllLogos()

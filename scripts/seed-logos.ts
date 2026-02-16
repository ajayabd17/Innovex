
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

const LOGO_MAP: Record<string, string> = {
    "Innovaccer": "https://logo.clearbit.com/innovaccer.com",
    // ... (abbreviated map)
}

async function seedLogos() {
    console.log("Starting logo seed (Restore Test)...")

    // 1. Get all companies with their website_url
    const { data: companies, error: fetchError } = await supabase
        .from('companies')
        .select('company_id, name, website_url')

    if (fetchError || !companies) {
        console.error("Error fetching companies:", fetchError)
        return
    }

    console.log(`Found ${companies.length} companies to check/update.`)

    // Try just one update
    const company = companies[0]
    if (company) {
        console.log(`Attempting to update ${company.name}...`)
        const { error: upsertError } = await supabase
            .from('company_logo')
            .upsert({
                company_id: company.company_id,
                logo_url: "https://example.com/logo.png",
                updated_at: new Date().toISOString()
            }, { onConflict: 'company_id' })

        if (upsertError) {
            console.error(`Failed to update logo:`, JSON.stringify(upsertError, null, 2))
        } else {
            console.log(`Updated logo successfully.`)
        }
    }
}

seedLogos()

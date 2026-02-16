
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

async function dumpCompanies() {
    const { data: companies, error } = await supabase
        .from('companies')
        .select('company_id, name, website_url')
        .order('name')

    if (error) {
        console.error("Error:", error)
        return
    }

    fs.writeFileSync('companies_dump.json', JSON.stringify(companies, null, 2))
    console.log(`Dumped ${companies?.length} companies to companies_dump.json`)
}

dumpCompanies()

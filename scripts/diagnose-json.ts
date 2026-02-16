import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Simple .env parser
const envPath = path.resolve(process.cwd(), '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env: Record<string, string> = {}

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        env[key.trim()] = value.trim()
    }
})

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

async function diagnoseJson() {
    console.log("Diagnosing JSON tables...")

    // Fetch one full_json
    const { data: jsonData, error: jsonError } = await supabase
        .from('company_json')
        .select('company_id, full_json')
        .limit(1)
        .single()

    if (jsonError) {
        console.error("Error fetching company_json:", jsonError.message)
    } else {
        const jsonOutputPath = path.resolve(process.cwd(), 'diagnostic_full_json.json')
        fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2))
        console.log(`Saved full_json sample to ${jsonOutputPath}`)
    }

    // Fetch one hiring_data
    const { data: hiringData, error: hiringError } = await supabase
        .from('hiring_rounds')
        .select('company_id, hiring_data')
        .limit(1)
        .single()

    if (hiringError) {
        console.error("Error fetching hiring_rounds:", hiringError.message)
    } else {
        const hiringOutputPath = path.resolve(process.cwd(), 'diagnostic_hiring_data.json')
        fs.writeFileSync(hiringOutputPath, JSON.stringify(hiringData, null, 2))
        console.log(`Saved hiring_data sample to ${hiringOutputPath}`)
    }
}

diagnoseJson()

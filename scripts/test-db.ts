import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Credentials missing in .env")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log("Testing Supabase connection...")
    const { data, error } = await supabase.from('companies').select('count', { count: 'exact', head: true })

    if (error) {
        console.error("Connection failed:", error.message)
        process.exit(1)
    }

    console.log("Connection successful!")
    console.log(`Found ${data?.length ?? 'some'} companies (HEAD request).`)

    // Try fetching one company with relations
    const { data: company, error: companyError } = await supabase.from('companies').select('*').limit(1).single()

    if (companyError) {
        console.error("Error fetching company details:", companyError.message)
    } else {
        console.log("Successfully fetched a company:", company?.name)
    }
}

testConnection()

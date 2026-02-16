
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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

async function testAccess() {
    console.log("Testing SELECT from company_logo...")
    const { data, error } = await supabase.from('company_logo').select('*').limit(1)

    if (error) {
        console.error("SELECT Error:", JSON.stringify(error, null, 2))
    } else {
        console.log("SELECT Success:", data)
    }

    // Try dummy Upsert if select worked
    if (!error) {
        console.log("Testing UPSERT to company_logo...")
        // ID 1 is Accenture
        const { error: upsertError } = await supabase
            .from('company_logo')
            .upsert({
                company_id: 1,
                logo_url: "https://logo.clearbit.com/accenture.com",
                updated_at: new Date().toISOString()
            }, { onConflict: 'company_id' })

        if (upsertError) {
            console.error("UPSERT Error:", JSON.stringify(upsertError, null, 2))
        } else {
            console.log("UPSERT Success.")
        }
    }
}

testAccess()

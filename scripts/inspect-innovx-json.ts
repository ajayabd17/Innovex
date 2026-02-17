
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

async function inspectInnovxJson() {
    console.log("Inspecting 'innovx_data' column...")

    const { data, error } = await supabase
        .from('innovx')
        .select('innovx_data')
        .limit(1)

    if (error) {
        console.error("Error fetching innovx:", error)
    } else {
        if (data && data.length > 0) {
            console.log(JSON.stringify(data[0].innovx_data, null, 2))
        } else {
            console.log("No data found in innovx table.")
        }
    }
}

inspectInnovxJson()

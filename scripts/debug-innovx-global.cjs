
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugInnovxGlobal() {
    console.log("Fetching global InnovX data...")
    const { data, error } = await supabase
        .from('innovx')
        .select('*, companies(name, company_logo(logo_url))')
    //.order('updated_at', { ascending: false }) 
    // 'updated_at' might not exist or be null, causing issues?

    if (error) {
        console.error("Error:", error)
        return
    }

    console.log(`Found ${data.length} records.`)
    if (data.length > 0) {
        const first = data[0]
        console.log("First record sample:", JSON.stringify(first, null, 2))
        console.log("Companies Type:", typeof first.companies, Array.isArray(first.companies) ? "Array" : "Object")
    }
}

debugInnovxGlobal()

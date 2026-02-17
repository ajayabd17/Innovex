
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

async function inspectSchema() {
    // There isn't a direct "list constraints" API easily accessible via js client without rpc
    // But we can try to select from the table directly to see if it exists
    const { data, error } = await supabase
        .from('company_skill_score')
        .select('*')
        .limit(1)

    if (error) {
        console.error("Error accessing company_skill_score:", error)
        // Try plural
        const { data: pluralData, error: pluralError } = await supabase
            .from('company_skill_scores')
            .select('*')
            .limit(1)

        if (pluralError) {
            console.error("Error accessing company_skill_scores:", pluralError)
        } else {
            console.log("Table 'company_skill_scores' exists!")
        }
    } else {
        console.log("Table 'company_skill_score' exists!")
    }
}

inspectSchema()

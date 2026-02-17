
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

async function verifySkills() {
    const id = 4 // Assuming ID 4 exists, or we can fetch first company
    console.log(`Fetching company ${id}...`)

    // emulate getCompanyById logic partially
    const { data: companyData, error } = await supabase
        .from('companies')
        .select(`
            *,
            company_logo(logo_url),
            company_skill_scores(*)
        `)
        .eq('company_id', id)
        .single()

    if (error) {
        console.error("Error fetching company:", error)
        // Try without relation to see if it errors on relation name
        const { error: retryError } = await supabase
            .from('companies')
            .select('*')
            .eq('company_id', id)
            .single()
        if (!retryError) {
            console.log("Company exists, but relation 'company_skill_score' might be wrong.")
        }
        return
    }

    console.log("Company skills found:", companyData.company_skill_scores?.length || 0)
    console.log("Skills Data:", JSON.stringify(companyData.company_skill_scores, null, 2))
}

verifySkills()

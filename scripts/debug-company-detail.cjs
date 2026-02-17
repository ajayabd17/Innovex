
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

// Mocking the getCompanyById logic from supabaseService.ts to verify data structure
async function debugCompanyDetail(id) {
    console.log(`Fetching data for company ID: ${id}`)

    // 1. Fetch Company Core Data
    const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*, company_logo(logo_url)')
        .eq('company_id', id)
        .single()

    if (companyError) {
        console.error('Error fetching company:', companyError)
        return
    }

    // 2. Fetch Related Data in Parallel
    const promises = [
        supabase.from('company_json').select('full_json').eq('company_id', id).maybeSingle(),
        supabase.from('innovx').select('innovx_data').eq('company_id', id).maybeSingle(),
    ]

    const [jsonRes, innovxRes] = await Promise.all(promises)

    const innovxData = innovxRes.data?.innovx_data

    console.log('\n--- InnovX Data Check ---')
    if (innovxData) {
        console.log('innovx_data found type:', typeof innovxData)
        console.log('Keys:', Object.keys(innovxData))

        if (innovxData.innovx_master) {
            console.log('Has innovx_master:', JSON.stringify(innovxData.innovx_master, null, 2))
        } else {
            console.log('NO innovx_master found in innovx_data')
            // Check if it is flat
            if (innovxData.industry) {
                console.log('Found flat structure keys (e.g., industry):', innovxData.industry)
            }
        }

        if (innovxData.innovx_projects) {
            console.log(`Has innovx_projects: ${innovxData.innovx_projects.length} items`)
        } else {
            console.log('NO innovx_projects found')
        }
    } else {
        console.log('innovx_data is UNDEFINED/NULL')
    }
}

// Check for a known company (e.g. Google id=4)
debugCompanyDetail(4)

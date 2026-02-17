
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLogos() {
    const targetCompanies = ['Barclays', 'Myntra', 'Schneider Electric', 'Swiggy', 'Schneider']

    console.log(`Checking logos for: ${targetCompanies.join(', ')}`)

    const { data, error } = await supabase
        .from('companies')
        .select(`
      company_id, 
      name, 
      company_logo (
        logo_url
      )
    `)
        .in('name', targetCompanies)

    if (error) {
        console.error('Error fetching companies:', error)
        return
    }

    if (!data || data.length === 0) {
        console.log('No matching companies found.')
        return
    }

    data.forEach((company: any) => {
        console.log(`\nCompany: ${company.name} (ID: ${company.company_id})`)
        if (company.company_logo) {
            if (Array.isArray(company.company_logo)) {
                console.log(`Logo relation is Array via Select: Length ${company.company_logo.length}`)
                company.company_logo.forEach((l: any, i: number) => console.log(`  [${i}] URL: ${l.logo_url}`))
            } else {
                console.log(`Logo relation is Object: URL: ${company.company_logo.logo_url}`)
            }
        } else {
            console.log('Logo relation is NULL/Undefined')
        }
    })
}

debugLogos()

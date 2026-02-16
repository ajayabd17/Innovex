
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) { process.exit(1) }

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectCompany() {
    const { data, error } = await supabase
        .from('companies')
        .select(`
            company_id,
            name,
            hiring_rounds ( hiring_data )
        `)
        .limit(1)

    if (error) {
        console.error('Error:', error)
        return
    }

    if (data && data.length > 0) {
        const company = data[0]
        console.log(`Company: ${company.name} (${company.company_id})`)
        const hiringData = company.hiring_rounds?.hiring_data
        if (hiringData) {
            console.log('Hiring Data Structure:')
            console.log(JSON.stringify(hiringData, null, 2))
        } else {
            console.log('No hiring_data found.')
        }
    } else {
        console.log('No companies found.')
    }
}

inspectCompany()

```
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load env explicitly
dotenv.config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl ? 'Found' : 'Missing')
console.log('Key:', supabaseKey ? 'Found' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFetch() {
    console.log('Attempting to fetch company 1...')
    
    // Test basic fetch first
    console.log('Fetching basic company data...')
    const { data: basicData, error: basicError } = await supabase
        .from('companies')
        .select('*')
        .eq('company_id', 1)
        .single()
    
    if (basicError) {
        console.error('BASIC FETCH ERROR:', basicError)
        return
    }
    console.log('Basic fetch success. Company:', basicData.name)

    // Test with company_logo join if basic works
    console.log('Testing with company_logo join...')
    const { data, error } = await supabase
        .from('companies')
        .select(`
    *,
    company_logo(logo_url)
        `)
        .eq('company_id', 1)
        .single()

    if (error) {
        console.error('JOIN ERROR:', JSON.stringify(error, null, 2))
    } else {
        console.log('JOIN SUCCESS!')
        console.log('Logo Data:', data.company_logo)
    }
}

testFetch()
```

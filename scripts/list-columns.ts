
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectTable() {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('Columns in companies table:', Object.keys(data[0]))
        console.log('Sample row:', data[0])
    } else {
        console.log('No data found in companies table')
    }

    // Also check if there's a separate table for logos
    const { data: tables, error: tableError } = await supabase
        .from('company_logo') // Guessing table name based on user hint
        .select('*')
        .limit(1)

    if (tables) {
        console.log('Found company_logo table sample:', tables[0])
    } else {
        console.log('No company_logo table found or accessible directly')
    }
}

inspectTable()

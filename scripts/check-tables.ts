
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) { process.exit(1) }

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
    const { data, error } = await supabase
        .from('company_skill_scores')
        .select('*')
        .limit(1)

    if (!error) {
        console.log('Found table: company_skill_scores')
    } else {
        console.log('Error accessing company_skill_scores:', error.message)
    }

    const { data: data2, error: error2 } = await supabase
        .from('company_skill_sets')
        .select('*')
        .limit(1)

    if (!error2) {
        console.log('Found table: company_skill_sets')
    } else {
        console.log('Error accessing company_skill_sets:', error2.message)
    }
}

checkTables()

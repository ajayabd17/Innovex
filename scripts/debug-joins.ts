
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
    console.log("Getting ID...")
    const { data: list } = await supabase.from('companies').select('company_id').limit(1)
    const id = list![0].company_id

    console.log("1. Testing JOIN company_json...")
    const { error: err1 } = await supabase
        .from('companies')
        .select('company_id, company_json(full_json)')
        .eq('company_id', id)
        .single()

    if (err1) console.error("JOIN company_json FAILED:", err1.message)
    else console.log("JOIN company_json SUCCESS")

    console.log("2. Testing JOIN hiring_rounds...")
    const { error: err2 } = await supabase
        .from('companies')
        .select('company_id, hiring_rounds(hiring_data)')
        .eq('company_id', id)
        .single()

    if (err2) console.error("JOIN hiring_rounds FAILED:", err2.message)
    else console.log("JOIN hiring_rounds SUCCESS")
}

run()

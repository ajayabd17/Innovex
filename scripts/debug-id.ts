
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
    const { data: cj, error: e1 } = await supabase.from('company_json').select('company_id').limit(1)
    if (e1) console.error("company_json id FAIL", e1.message)
    else console.log("company_json id SUCCESS", cj?.length)

    const { data: hr, error: e2 } = await supabase.from('hiring_rounds').select('company_id').limit(1)
    if (e2) console.error("hiring_rounds id FAIL", e2.message)
    else console.log("hiring_rounds id SUCCESS", hr?.length)
}

run()

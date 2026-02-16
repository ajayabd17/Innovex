
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
    console.log("Checking company_json table...")
    const { data: cj, error: cjErr } = await supabase.from('company_json').select('*').limit(1)
    if (cjErr) console.error("company_json FAIL:", cjErr.message)
    else console.log("company_json SUCCESS, rows:", cj?.length)

    console.log("Checking hiring_rounds table...")
    const { data: hr, error: hrErr } = await supabase.from('hiring_rounds').select('*').limit(1)
    if (hrErr) console.error("hiring_rounds FAIL:", hrErr.message)
    else console.log("hiring_rounds SUCCESS, rows:", hr?.length)
}

run()


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
    const { data: cj } = await supabase.from('company_json').select('*').limit(1)
    const { data: hr } = await supabase.from('hiring_rounds').select('*').limit(1)

    console.log("company_json keys:", Object.keys(cj?.[0] || {}))
    console.log("hiring_rounds keys:", Object.keys(hr?.[0] || {}))
}

run()

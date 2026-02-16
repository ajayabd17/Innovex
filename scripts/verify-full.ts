
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
    console.log("1. Get a valid ID...")
    const { data: list } = await supabase.from('companies').select('company_id').limit(1)

    if (!list || list.length === 0) {
        console.error("No companies found")
        return
    }

    const id = list[0].company_id
    console.log(`Testing with Company ID: ${id}`)

    console.log("2. Running full query...")
    const { data, error } = await supabase
        .from('companies')
        .select(`
        *,
        company_json ( full_json ),
        hiring_rounds ( hiring_data )
      `)
        .eq('company_id', id)
        .single()

    if (error) {
        console.error("QUERY FAILED:", error.message)
        console.error("Details:", error)
    } else {
        console.log("QUERY SUCCESS!")
        console.log("Name:", data.name)
        console.log("Has JSON?", !!data.company_json)
        console.log("Has Rounds?", !!data.hiring_rounds)
        if (data.hiring_rounds) {
            const hr = Array.isArray(data.hiring_rounds) ? data.hiring_rounds[0] : data.hiring_rounds
            console.log("Rounds Data:", JSON.stringify(hr).substring(0, 100) + "...")
        }
    }
}

run().catch(console.error)

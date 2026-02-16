
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
    console.log("1. Get a valid ID...")
    const { data: list } = await supabase.from('companies').select('company_id').limit(1)
    const id = list![0].company_id

    console.log(`Testing with Company ID: ${id}`)

    // 1. Fetch Company Core
    const { data: companyData, error: companyError } = await supabase.from('companies').select('*').eq('company_id', id).single()

    if (companyError) {
        console.error("Core fetch failed:", companyError.message)
        return
    }

    // 2. Fetch Related Data in Parallel
    console.log("2. Fetching related data manually...")
    const [jsonRes, hiringRes] = await Promise.all([
        supabase.from('company_json').select('full_json').eq('company_id', id).maybeSingle(),
        supabase.from('hiring_rounds').select('hiring_data').eq('company_id', id).maybeSingle()
    ])

    if (jsonRes.error) console.error("Error fetching company_json:", jsonRes.error.message)
    else console.log("company_json fetched:", !!jsonRes.data)

    if (hiringRes.error) console.error("Error fetching hiring_rounds:", hiringRes.error.message)
    else console.log("hiring_rounds fetched:", !!hiringRes.data)

    const fullDetails = jsonRes.data?.full_json || {}
    const hiringData = hiringRes.data?.hiring_data || null

    console.log("3. Merging...")
    const final = {
        ...companyData,
        ...fullDetails,
        hiring_rounds: {
            hiring_data: hiringData
        }
    }

    console.log("FINAL SUCCESS:")
    console.log("Name:", final.name)
    console.log("Has JSON Data?", Object.keys(final).length > 20)
    console.log("Has Hiring Data?", !!final.hiring_rounds.hiring_data)
}

run()

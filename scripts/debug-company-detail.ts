
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFetch() {
    console.log("1. Fetching first 5 companies to get a valid ID...")
    const { data: list, error: listError } = await supabase
        .from('companies')
        .select('company_id, name')
        .limit(5)

    if (listError) {
        console.error("List Error:", listError)
        return
    }

    if (!list || list.length === 0) {
        console.error("No companies found in DB.")
        return
    }

    console.log("Found companies:", list)
    const targetId = list[0].company_id
    console.log(`\n2. Attempting to fetch details for Company ID: ${targetId}`)

    // replicate getCompanyById query EXACTLY
    const { data, error } = await supabase
        .from('companies')
        .select(`
            *,
            company_json ( full_json ),
            hiring_rounds ( hiring_data )
        `)
        .eq('company_id', targetId)
        .single()

    if (error) {
        console.error("Fetch Detail Error:", error)
    } else {
        console.log("Fetch Detail Success!")
        console.log("Ref:", data.company_json)
        console.log("Round:", data.hiring_rounds)

        // Simulate the transformation logic
        try {
            const fullDetails = data.company_json?.[0]?.full_json || data.company_json?.full_json || {}
            const hiringData = data.hiring_rounds?.[0]?.hiring_data || data.hiring_rounds?.hiring_data || null

            console.log("\nTransformation Check:")
            console.log("Has fullDetails?", !!fullDetails)
            console.log("Has hiringData?", !!hiringData)
            console.log("Category:", data.category)
        } catch (e) {
            console.error("Transformation Logic Error:", e)
        }
    }
}

testFetch()

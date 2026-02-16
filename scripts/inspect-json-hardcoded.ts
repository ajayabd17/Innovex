
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectCompany() {
    console.log('Fetching company 1...')
    const { data, error } = await supabase
        .from('companies')
        .select(`
            company_id,
            name,
            hiring_rounds ( hiring_data )
        `)
        .eq('company_id', 1)
        .single()

    if (error) {
        console.error('Error:', error)
        return
    }

    if (data) {
        console.log(`Company: ${data.name} (${data.company_id})`)
        // Access array based on 1:many relation even if single() is used on parent? 
        // No, relation returns array usually unless defined 1:1.
        // Let's check the type of hiring_rounds.
        const hr = data.hiring_rounds
        if (hr) {
            // It might be an array if not 1:1, or object if 1:1?
            // Based on previous logs, it's likely an array or object.
            // Let's log it directly.
            console.log('Hiring Rounds Value:', JSON.stringify(hr, null, 2))

            // If it's an array, take first.
            const hiringData = Array.isArray(hr) ? hr[0]?.hiring_data : hr.hiring_data
            if (hiringData) {
                console.log('Found hiring_data JSON!')
                console.log(JSON.stringify(hiringData, null, 2))
            } else {
                console.log('hiring_data matches logic failed or is null')
            }
        } else {
            console.log('No hiring_rounds relation data found.')
        }
    } else {
        console.log('Company not found.')
    }
}

inspectCompany()

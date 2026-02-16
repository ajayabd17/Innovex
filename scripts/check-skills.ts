
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
    console.log('Checking company_skill_scores...')
    const { data, error } = await supabase
        .from('company_skill_scores')
        .select('*')
        .limit(1)

    if (!error) {
        console.log('SUCCESS: company_skill_scores exists')
    } else {
        console.log('FAIL: company_skill_scores error:', error.message)
    }

    console.log('Checking company_skill_sets...')
    const { data: data2, error: error2 } = await supabase
        .from('company_skill_sets')
        .select('*')
        .limit(1)

    if (!error2) {
        console.log('SUCCESS: company_skill_sets exists')
    } else {
        console.log('FAIL: company_skill_sets error:', error2.message)
    }
}

checkTables()


import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs';
import * as path from 'path';

// --- SETUP LOGGING ---
const logFile = path.resolve(__dirname, '../verify_output.txt');
function log(msg: any) {
    const str = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    console.log(str);
    fs.appendFileSync(logFile, str + '\n');
}
fs.writeFileSync(logFile, ''); // Clear file

// --- SUPABASE SETUP ---
const supabaseUrl = 'https://qigjbslwfncmdngikqgc.supabase.co'
// Using the anon key from the env file I read earlier
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2pic2x3Zm5jbWRuZ2lrcWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDE2OTEsImV4cCI6MjA4Njc3NzY5MX0.Bk2n1y4fuMygBB8fqcmi1XsTnwNTtzfHdAnj-CiL83U'
const supabase = createClient(supabaseUrl, supabaseKey)

// --- HELPERS ---
const normalizeCategory = (raw: string | null): string => {
    if (!raw) return "Regular"
    const lower = raw.toLowerCase()
    if (lower.includes('enterprise') || lower.includes('public') || lower.includes('large cap') || lower.includes('global') || lower.includes('bank') || lower.includes('mnc')) return "Marquee"
    if (lower.includes('startup') || lower.includes('scale-up') || lower.includes('unicorn') || lower.includes('saas') || lower.includes('ai') || lower.includes('product')) return "Super Dream"
    if (lower.includes('service') || lower.includes('consulting') || lower.includes('digital') || lower.includes('smb') || lower.includes('fintech')) return "Dream"
    return "Regular"
}

// --- MAIN TEST LOGIC ---
async function runVerify() {
    log("=== STARTING VERIFICATION ===")

    // 1. Fetch List of Companies
    log("\n1. Fetching first company to get valid ID...")
    const { data: list, error: listError } = await supabase.from('companies').select('company_id, name').limit(1)

    if (listError || !list || list.length === 0) {
        log("FAIL: Could not fetch company list.")
        log(listError)
        return
    }

    const targetCompany = list[0]
    log(`Selected Company: ${targetCompany.name} (ID: ${targetCompany.company_id})`)

    // 2. Fetch Company Details (Simulating supabaseService.getCompanyById)
    // NOTE: This MUST match the query in supabaseService.ts EXACTLY
    log("\n2. Fetching details via getCompanyById logic...")
    const { data, error } = await supabase
        .from('companies')
        .select(`
        *,
        company_json ( full_json ),
        hiring_rounds ( hiring_data )
      `)
        .eq('company_id', targetCompany.company_id)
        .single()

    if (error || !data) {
        log("FAIL: supabaseService query failed.")
        log(error)
        return
    }

    log("SUCCESS: Raw data fetched from Supabase.")
    // log(data) // Optional: log raw data if needed

    // 3. Simulate Data Transformation (supabaseService.ts)
    log("\n3. Testing Data Transformation...")
    const companyData = data as any
    const fullDetails = companyData.company_json?.[0]?.full_json || companyData.company_json?.full_json || {}
    const hiringData = companyData.hiring_rounds?.[0]?.hiring_data || companyData.hiring_rounds?.hiring_data || null

    const transformedData = {
        ...companyData,
        ...fullDetails,
        logo_url: fullDetails.logo_url || null,
        category: normalizeCategory(companyData.category),
        business: fullDetails as unknown as any,
        skills: companyData.skills || fullDetails.skills || [], // Note: companyData.skills comes from the join if present, but we removed it. So it should be undefined here, falling back to fullDetails or []
        hiring_rounds: {
            company_id: targetCompany.company_id,
            hiring_data: hiringData,
        }
    }

    log(`Transformed Data - Name: ${transformedData.name}`)
    log(`Transformed Data - Category: ${transformedData.category}`)
    log(`Transformed Data - Logo URL: ${transformedData.logo_url}`)
    log(`Transformed Data - Hiring Data Present: ${!!transformedData.hiring_rounds.hiring_data}`)

    // 4. Test Skill Matrix Parsing (SkillMatrix.tsx)
    log("\n4. Testing Skill Matrix Parsing Logic...")
    if (!transformedData.hiring_rounds?.hiring_data?.job_role_details) {
        log("INFO: No job_role_details for this company. Skill Matrix would use fallback.")
        if (transformedData.skills && transformedData.skills.length > 0) {
            log("INFO: Fallback skills found in JSON.")
        } else {
            log("WARN: No skills found in JSON fallback either.")
        }
    } else {
        log("INFO: job_role_details found. Running parser...")
        const skillMap = new Map<number, number>()

        transformedData.hiring_rounds.hiring_data.job_role_details.forEach((role: any) => {
            log(`- Role: ${role.role_title}`)
            role.hiring_rounds?.forEach((round: any) => {
                round.skill_sets?.forEach((skill: any) => {
                    const name = skill.skill_set_name || "Unknown"
                    log(`  - Found Skill: ${name} (Proficiency: ${skill.proficiency_level})`)
                    // ... (mapping logic omitted for brevity, just checking access)
                })
            })
        })
    }

    log("\n=== VERIFICATION COMPLETE ===")
}

runVerify()


const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const logFile = path.resolve(__dirname, '../debug_output.txt')
const log = (msg) => {
    console.log(msg)
    fs.appendFileSync(logFile, msg + '\n')
}
// Clear log file first
fs.writeFileSync(logFile, '')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLogos() {
    const targetCompanies = ['Barclays', 'Myntra', 'Schneider Electric', 'Swiggy', 'Google']

    log(`Checking logos for: ${targetCompanies.join(', ')}`)

    // Perform individual fuzzy searches to ensure we find them all
    for (const name of targetCompanies) {
        const { data: fuzzyData, error } = await supabase
            .from('companies')
            .select('company_id, name, company_logo(logo_url)')
            .ilike('name', `%${name}%`)

        if (error) {
            log(`Error fetching ${name}: ${JSON.stringify(error)}`)
            continue
        }

        if (fuzzyData && fuzzyData.length > 0) {
            log(`\n--- Found Matches for "${name}" ---`)
            fuzzyData.forEach(company => {
                log(`Name: ${company.name} (ID: ${company.company_id})`)
                if (company.company_logo) {
                    if (Array.isArray(company.company_logo)) {
                        log(`  Logo Array Length: ${company.company_logo.length}`)
                        company.company_logo.forEach((l, i) => log(`    [${i}] ${l.logo_url}`))
                        // Check logic used in app
                        const used = company.company_logo[0]?.logo_url
                        log(`  -> APP USES [0]: ${used}`)
                    } else {
                        log(`  Logo Object: ${company.company_logo.logo_url}`)
                    }
                } else {
                    log(`  Logo is NULL`)
                }
            })
        } else {
            log(`No match for "${name}"`)
        }
    }
}

debugLogos()

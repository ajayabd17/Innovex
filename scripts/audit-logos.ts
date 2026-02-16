
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Robust env loading
const envPath = path.resolve(process.cwd(), '.env')
let supabaseUrl = process.env.VITE_SUPABASE_URL
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8')
        const lines = envConfig.split(/\r?\n/)
        lines.forEach(line => {
            const parts = line.split('=')
            if (parts.length >= 2) {
                const key = parts[0].trim()
                const val = parts.slice(1).join('=').trim()
                if (key === 'VITE_SUPABASE_URL') supabaseUrl = val
                if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = val
            }
        })
    }
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function auditLogos() {
    console.log("Auditing logos for duplicates...")

    const { data: logos, error } = await supabase
        .from('company_logo')
        .select('company_id, logo_url, companies(name)')

    if (error || !logos) {
        console.error("Error:", error)
        return
    }

    const urlMap = new Map<string, string[]>()

    logos.forEach((l: any) => {
        const url = l.logo_url
        if (!urlMap.has(url)) {
            urlMap.set(url, [])
        }
        urlMap.get(url)?.push(`${l.companies?.name} (${l.company_id})`)
    })

    let report = ""
    let dupesFound = false

    urlMap.forEach((companies, url) => {
        if (companies.length > 1) {
            report += `\nLOGO: ${url}\n`
            companies.forEach(c => report += `  - ${c}\n`)
            dupesFound = true
        }
    })

    if (!dupesFound) {
        report = "No duplicates found."
    } else {
        report = "Found duplicates:\n" + report
    }

    fs.writeFileSync('duplicate_logos_report.txt', report)
    console.log("Report written to duplicate_logos_report.txt")
}

auditLogos()

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Simple .env parser
const envPath = path.resolve(process.cwd(), '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env: Record<string, string> = {}

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        env[key.trim()] = value.trim()
    }
})

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

async function diagnose() {
    console.log("Diagnosing 'companies' table data...")

    // Fetch all categories
    const { data, error } = await supabase.from('companies').select('*')

    if (error) {
        console.error("Error:", error.message)
        return
    }

    console.log(`Total records: ${data.length}`)

    // Count distinct categories
    const counts: Record<string, number> = {}
    data.forEach((row: any) => {
        const cat = row.category || 'NULL'
        counts[cat] = (counts[cat] || 0) + 1
    })

    // Count nature of company
    const natureCounts: Record<string, number> = {}
    data.forEach((row: any) => {
        const val = row.nature_of_company || 'NULL'
        natureCounts[val] = (natureCounts[val] || 0) + 1
    })

    // List keys of the first row to see all columns
    let columns: string[] = []
    if (data.length > 0) {
        columns = Object.keys(data[0])
        console.log("Columns:", columns)
    }

    const result = {
        category_distribution: counts,
        nature_distribution: natureCounts,
        columns: columns,
        sample_row: data[0]
    }

    const outputPath = path.resolve(process.cwd(), 'diagnostic_result.json')
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2))
    console.log(`Deep diagnosis saved to ${outputPath}`)
}

diagnose()

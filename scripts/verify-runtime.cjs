
// Mock browser environment for Vite
global.import = {
    meta: {
        env: {
            VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
            VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
        }
    }
}

const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Manual check if env loaded
if (!process.env.VITE_SUPABASE_URL) {
    console.error('FATAL: .env not loaded or missing VITE_SUPABASE_URL')
    process.exit(1)
}

// Redefine mock with loaded values
global.import = {
    meta: {
        env: {
            VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
            VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
        }
    }
}

try {
    console.log('Attempting to initialize Supabase client...')
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase client initialized successfully.')

    // Try a simple query
    supabase.from('companies').select('count', { count: 'exact', head: true })
        .then(res => {
            console.log('Supabase connection check:', res.error ? 'FAILED' : 'OK')
            if (res.error) console.error(res.error)
        })

} catch (e) {
    console.error('Runtime crash during initialization:', e)
}

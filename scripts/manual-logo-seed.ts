
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

// Map based on companies_dump.json
// ID -> Domain for Clearbit
const ID_DOMAIN_MAP: Record<number, string> = {
    115: "3i-infotech.com",
    1: "accenture.com",
    89: "acko.com",
    49: "adobe.com",
    43: "airbus.com",
    48: "akamai.com",
    20: "amadeus.com",
    14: "amazon.com",
    5: "apple.com",
    45: "atlassian.com",
    75: "autodesk.com",
    86: "bain.com",
    85: "bajajfinservhealth.in",
    26: "barclays.co.uk",
    116: "bharatpe.com",
    109: "bigbasket.com",
    28: "blinkit.com",
    38: "bt.com",
    93: "byjus.com",
    39: "capgemini.com",
    18: "cisco.com",
    32: "citi.com",
    94: "cleartrip.com",
    12: "cloudera.com",
    67: "cmegroup.com",
    95: "cognizant.com",
    7: "commbank.com.au",
    91: "concentrix.com",
    37: "consilio.com",
    79: "darwinbox.com",
    47: "deepmind.google",
    52: "dell.com",
    61: "devrev.ai",
    92: "dunzo.com",
    96: "dxc.com",
    110: "ecomexpress.in",
    76: "ea.com",
    80: "epifi.com",
    53: "even.in",
    41: "fidelity.com",
    34: "flamapp.com",
    82: "flipkart.com",
    2: "fractal.ai",
    69: "freshworks.com",
    50: "genpact.com",
    4: "google.com",
    54: "groww.in",
    13: "guidewire.com",
    68: "hcltech.com",
    105: "hexagon.com",
    70: "hp.com",
    73: "hyperverge.co",
    62: "increff.com",
    106: "indmoney.com",
    11: "infosys.com",
    25: "ibm.com",
    42: "jpmorganchase.com",
    81: "juspay.io",
    8: "kalvium.com",
    71: "philips.com",
    111: "kyndryl.com",
    9: "ltimindtree.com",
    17: "leapfinance.com",
    15: "shipsy.io",
    78: "microsoft.com",
    55: "mintair.in", // Guessed or use generic
    6: "mufg.jp",
    77: "morganstanley.com",
    74: "motorq.com",
    63: "moveinsync.com",
    30: "myntra.com",
    21: "nielseniq.com",
    99: "nttdata.com",
    31: "nurixtx.com",
    46: "nutanix.com",
    64: "nvidia.com",
    112: "mobikwik.com",
    56: "openai.com",
    83: "optum.com",
    24: "oracle.com",
    3: "oracle.com",
    23: "palantir.com",
    84: "paypal.com",
    104: "paytmmoney.com",
    97: "pw.live",
    87: "proactively.com",
    90: "bosch.com",
    114: "rupeek.com",
    88: "samsung.com",
    35: "sap.com",
    27: "se.com",
    65: "servicenow.com",
    113: "shadowfax.in",
    108: "simplilearn.com",
    57: "skyhighsecurity.com",
    22: "snowflake.com",
    58: "spacex.com",
    16: "swiggy.com",
    10: "tcs.com",
    107: "techmahindra.com",
    40: "bnymellon.com",
    66: "tredence.com",
    51: "uber.com",
    98: "udemy.com",
    101: "upgrad.com",
    100: "virtusa.com",
    19: "volvogroup.com",
    59: "walmart.com",
    72: "wbd.com",
    44: "wellsfargo.com",
    103: "wipro.com",
    36: "xperi.com",
    60: "zepto.in",
    29: "zerodha.com",
    33: "zs.com", // ZS Associates
    102: "zensar.com" // Zensar (was ZS Associates in dump)
};

async function manualSeed() {
    console.log("Starting Manual Logo Seed...")
    let updated = 0;

    for (const [idStr, domain] of Object.entries(ID_DOMAIN_MAP)) {
        const id = parseInt(idStr);
        // Clean domain
        const cleanDomain = domain.trim();
        const logoUrl = `https://logo.clearbit.com/${cleanDomain}`;

        const { error } = await supabase
            .from('company_logo')
            .upsert({
                company_id: id,
                logo_url: logoUrl,
                updated_at: new Date().toISOString()
            }, { onConflict: 'company_id' })

        if (error) {
            console.error(`Error updating ${id} (${cleanDomain}):`, JSON.stringify(error, null, 2))
        } else {
            updated++;
            if (updated % 10 === 0) console.log(`Updated ${updated} logos...`)
        }
    }
    console.log(`Updated ${updated} company logos manually.`)
}

manualSeed()

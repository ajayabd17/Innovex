
import { supabase } from '@/lib/supabase'
import type { CompanyData } from '@/types/schema'

const normalizeCategory = (raw: string | null): string => {
    if (!raw) return "Regular"
    const lower = raw.toLowerCase()

    if (lower.includes('enterprise') || lower.includes('public') || lower.includes('large cap') || lower.includes('global') || lower.includes('bank') || lower.includes('mnc')) {
        return "Marquee"
    }
    if (lower.includes('startup') || lower.includes('scale-up') || lower.includes('unicorn') || lower.includes('saas') || lower.includes('ai') || lower.includes('product')) {
        return "Super Dream"
    }
    if (lower.includes('service') || lower.includes('consulting') || lower.includes('digital') || lower.includes('smb') || lower.includes('fintech')) {
        return "Dream"
    }
    return "Regular"
}

const resolveLogo = (logoData: any) => {
    if (!logoData) return null
    if (!Array.isArray(logoData)) return logoData.logo_url
    if (logoData.length === 0) return null

    // Heuristics to find the best logo
    // 1. Filter out known bad formats (PDF)
    const valid = logoData.filter((l: any) => l.logo_url && !l.logo_url.toLowerCase().endsWith('.pdf'))
    if (valid.length === 0) return logoData[0].logo_url

    // 2. Deprioritize blocked/unstable domains (Wikimedia hotlink blocks, Brave search proxies)
    const preferred = valid.filter((l: any) => {
        const u = l.logo_url.toLowerCase()
        return !u.includes('wikimedia.org') && !u.includes('brave.com')
    })

    if (preferred.length > 0) return preferred[0].logo_url

    // 3. Fallback: If only Wikimedia/Brave exist, prefer Brave over Wikimedia
    const brave = valid.filter((l: any) => l.logo_url.toLowerCase().includes('brave.com'))
    if (brave.length > 0) return brave[0].logo_url

    // 4. Last resort
    return valid[0].logo_url
}

export const supabaseService = {
    async getAllCompanies() {
        const { data, error } = await supabase
            .from('companies')
            .select('*, company_json(short_json), company_logo(logo_url), innovx(innovx_data)')
            .order('name')

        if (error) {
            console.error('Error fetching companies:', error)
            return []
        }

        return data.map((c: any) => {
            const shortData = c.company_json?.[0]?.short_json || c.company_json?.short_json || {}
            // Handle array or single object response for 1:1 relation
            const logoUrl = resolveLogo(c.company_logo)
            const innovxData = Array.isArray(c.innovx) ? c.innovx[0]?.innovx_data : c.innovx?.innovx_data

            return {
                ...c,
                ...shortData, // Overwrite/Enhance with short_json data
                logo_url: logoUrl || shortData.logo_url || null,
                category: normalizeCategory(c.category),
                innovx_data: innovxData, // Attach InnovX data to the company object
                raw_category: c.category
            }
        }) as CompanyData[]
    },

    async getCompanyById(id: number) {
        // Fetch core data + full_json + hiring_data manually to avoid Foreign Key issues

        // 1. Fetch Company Core Data AND Logo via Relation (Consistent with getAllCompanies)
        const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*, company_logo(logo_url), company_skill_scores(*)')
            .eq('company_id', id)
            .single()

        if (companyError || !companyData) {
            console.error(`Error fetching company ${id}:`, companyError)
            return undefined
        }

        // 2. Fetch Related Data in Parallel
        const [jsonRes, hiringRes, innovxRes] = await Promise.all([
            supabase.from('company_json').select('full_json').eq('company_id', id).maybeSingle(),
            supabase.from('hiring_rounds').select('hiring_data').eq('company_id', id).maybeSingle(),
            supabase.from('innovx').select('innovx_data').eq('company_id', id).maybeSingle(),
        ])

        if (jsonRes.error) console.error("Error fetching company_json:", jsonRes.error)
        if (hiringRes.error) console.error("Error fetching hiring_rounds:", hiringRes.error)
        if (innovxRes.error) console.error("Error fetching innovx:", innovxRes.error)

        console.log(`[Supabase] Manual fetch for ${id} completed.`)

        const fullDetails = jsonRes.data?.full_json || {}
        const hiringData = hiringRes.data?.hiring_data || null

        // Extract logo from relation using helper
        const logoUrl = resolveLogo(companyData.company_logo) || fullDetails.logo_url || null

        // Map strict DB columns + flexible JSON data to strict Interfaces
        const transformedData: CompanyData = {
            ...companyData,
            ...fullDetails, // Overwrite basic fields if JSON is newer/richer
            logo_url: logoUrl || null,
            category: normalizeCategory(companyData.category), // Ensure category is consistent

            // Populate nested objects using the SAME fullDetails blob
            business: fullDetails as unknown as any,
            financials: fullDetails as unknown as any,
            culture: fullDetails as unknown as any,
            technologies: fullDetails as unknown as any,
            people: fullDetails as unknown as any,
            skills: companyData.company_skill_scores || companyData.skills || fullDetails.skills || [],

            // Hiring rounds needs specific handling
            hiring_rounds: {
                company_id: id,
                round_details: hiringData?.round_details || [],
                hiring_data: hiringData || undefined
            },

            // Attach InnovX Data
            innovx_data: innovxRes.data?.innovx_data || undefined
        }

        return transformedData
    },

    async getMetrics() {
        const { data, error } = await supabase
            .from('companies')
            .select('category')

        if (error || !data) {
            console.error('Error fetching metrics:', error)
            return { total: 0, marquee: 0, superDream: 0, dream: 0, regular: 0 }
        }

        const mapped = data.map((c: { category: string | null }) => normalizeCategory(c.category))

        return {
            total: data.length,
            marquee: mapped.filter((c) => c === 'Marquee').length,
            superDream: mapped.filter((c) => c === 'Super Dream').length,
            dream: mapped.filter((c) => c === 'Dream').length,
            regular: mapped.filter((c) => c === 'Regular').length,
        }
    },

    async getInnovx() {
        const { data, error } = await supabase
            .from('innovx')
            .select('*, companies(name, company_logo(logo_url))')
            .order('updated_at', { ascending: false })

        if (error) {
            console.error('Error fetching innovx:', error)
            return []
        }

        return data.map((item: any) => ({
            ...item,
            companies: {
                name: item.companies?.name,
                logo_url: resolveLogo(item.companies?.company_logo)
            }
        }))
    },

    async getInnovxByCompany(companyId: number) {
        const { data, error } = await supabase
            .from('innovx')
            .select('*')
            .eq('company_id', companyId)
            .maybeSingle()

        if (error) {
            console.error(`Error fetching innovx for company ${companyId}:`, error)
            return null
        }
        return data
    },

    // --- Student Profile Methods ---

    // Helper to get local storage key
    _getProfileKey(netId: string) { return `innovex_profile_${netId}` },
    _getSkillsKey(netId: string) { return `innovex_skills_${netId}` },

    async getStudentProfile(netId: string): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 300))

        const stored = localStorage.getItem(this._getProfileKey(netId))
        if (stored) return JSON.parse(stored)

        // Default empty profile/defaults if new user
        return {
            student_id: "mock-student-id",
            net_id: netId,
            degree_type: "",
            department: "",
            specialization: "",
            current_cgpa: "",
            tenth_percentage: "",
            twelfth_percentage: "",
            active_backlogs: 0,
            history_backlogs: 0,
            gap_years: 0,
            graduation_year: new Date().getFullYear() + 1
        }
    },

    async updateStudentProfile(profileData: any) {
        await new Promise(resolve => setTimeout(resolve, 500))

        const netId = profileData.net_id || profileData.netId
        if (netId) {
            const key = this._getProfileKey(netId)
            localStorage.setItem(key, JSON.stringify(profileData))
        } else {
            console.error("No net_id found in updateStudentProfile", profileData)
        }

        return { success: true }
    },

    async getStudentSkillMatrix(netId: string): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 300))

        const stored = localStorage.getItem(this._getSkillsKey(netId))
        if (stored) return JSON.parse(stored)

        // Default Data
        return {
            languages: [],
            core_subjects: {},
            domains: [],
            tools: []
        }
    },

    async updateStudentSkillMatrix(netId: string, matrixData: any) {
        await new Promise(resolve => setTimeout(resolve, 500))

        if (netId) {
            localStorage.setItem(this._getSkillsKey(netId), JSON.stringify(matrixData))
        }
        return { success: true }
    },

    async getCompanyMatch(netId: string, companyId: number): Promise<number> {
        return Math.floor(Math.random() * (95 - 60 + 1)) + 60; // Return 60-95%
    }
}

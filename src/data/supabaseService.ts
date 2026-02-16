import { supabase } from '@/lib/supabase'
import type { Company, CompanyData } from '@/types/schema'

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

export const supabaseService = {
    async getAllCompanies() {
        const { data, error } = await supabase
            .from('companies')
            .select('*, company_json(short_json)')
            .order('name')

        if (error) {
            console.error('Error fetching companies:', error)
            return []
        }

        return data.map((c: any) => {
            const shortData = c.company_json?.[0]?.short_json || c.company_json?.short_json || {}
            // Handle array or single object response for 1:1 relation
            const logoData = Array.isArray(c.company_logo) ? c.company_logo[0] : c.company_logo

            return {
                ...c,
                ...shortData, // Overwrite/Enhance with short_json data
                logo_url: logoData?.logo_url || shortData.logo_url || null,
                category: normalizeCategory(c.category),
                raw_category: c.category
            }
        }) as Company[]
    },

    async getCompanyById(id: number) {
        // Fetch core data + full_json + hiring_data manually to avoid Foreign Key issues

        // 1. Fetch Company Core Data
        const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('company_id', id)
            .single()

        if (companyError || !companyData) {
            console.error(`Error fetching company ${id}:`, companyError)
            return undefined
        }

        // 2. Fetch Related Data in Parallel
        const [jsonRes, hiringRes] = await Promise.all([
            supabase.from('company_json').select('full_json').eq('company_id', id).maybeSingle(),
            supabase.from('hiring_rounds').select('hiring_data').eq('company_id', id).maybeSingle()
        ])

        if (jsonRes.error) console.error("Error fetching company_json:", jsonRes.error)
        if (hiringRes.error) console.error("Error fetching hiring_rounds:", hiringRes.error)

        console.log(`[Supabase] Manual fetch for ${id} completed.`)

        const fullDetails = jsonRes.data?.full_json || {}
        const hiringData = hiringRes.data?.hiring_data || null

        // Map strict DB columns + flexible JSON data to strict Interfaces
        const transformedData: CompanyData = {
            ...companyData,
            ...fullDetails, // Overwrite basic fields if JSON is newer/richer
            logo_url: fullDetails.logo_url || null,
            category: normalizeCategory(companyData.category), // Ensure category is consistent

            // Populate nested objects using the SAME fullDetails blob
            business: fullDetails as unknown as any,
            financials: fullDetails as unknown as any,
            culture: fullDetails as unknown as any,
            technologies: fullDetails as unknown as any,
            people: fullDetails as unknown as any,
            skills: companyData.skills || fullDetails.skills || [],

            // Hiring rounds needs specific handling
            hiring_rounds: {
                company_id: id,
                hiring_data: hiringData,
                created_at: null,
                updated_at: null
            }
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
    }
}

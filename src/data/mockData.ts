import type {
    Company,
    CompanyData,
    HiringRound,
    SkillSet,
    CompanySkillScore,
} from "@/types/schema";

// --- Constants & Helpers ---

const SKILL_SETS: SkillSet[] = [
    { skill_set_id: 1, skill_name: "Coding", short_name: "Code", skill_set_description: "Programming & Algorithms" },
    { skill_set_id: 2, skill_name: "Data Structures & Algorithms", short_name: "DSA", skill_set_description: "Core DSA concepts" },
    { skill_set_id: 3, skill_name: "System Design", short_name: "SysDesign", skill_set_description: "LLD & HLD" },
    { skill_set_id: 4, skill_name: "Computer Fundamentals", short_name: "CS Fun", skill_set_description: "OS, DBMS, Networks" },
    { skill_set_id: 5, skill_name: "Web Development", short_name: "WebDev", skill_set_description: "Frontend & Backend" },
    { skill_set_id: 6, skill_name: "Aptitude", short_name: "Aptitude", skill_set_description: "Quant & Logical" },
    { skill_set_id: 7, skill_name: "Communication", short_name: "Comm", skill_set_description: "Verbal & Written" },
];

export const getSkillName = (id: number) => SKILL_SETS.find((s) => s.skill_set_id === id)?.skill_name || "Unknown";

// --- Mock Data ---

const COMPANIES: Company[] = [
    {
        company_id: 1,
        name: "Innovaccer",
        short_name: "Innovaccer",
        category: "Marquee",
        incorporation_year: "2014",
        nature_of_company: "Product",
        headquarters_address: "San Francisco, CA",
        office_count: "5",
        employee_size: "1000-5000",
        website_url: "https://innovaccer.com",
        linkedin_url: "https://linkedin.com/company/innovaccer",
        twitter_handle: "@innovaccer",
        facebook_url: "",
        instagram_url: "",
        primary_contact_email: "careers@innovaccer.com",
        primary_phone_number: "+1 415 555 0100",
        overview_text: "Innovaccer is a leading healthcare technology company committed to making a difference in the lives of patients and providers.",
        vision_statement: "To connect and curate the world's healthcare information to make it accessible and useful.",
        mission_statement: "We are on a mission to bring healthcare into the 21st century.",
        legal_issues: "None reported",
        carbon_footprint: "Neutral",
    },
    {
        company_id: 2,
        name: "Amazon",
        short_name: "Amazon",
        category: "Super Dream",
        incorporation_year: "1994",
        nature_of_company: "Product",
        headquarters_address: "Seattle, WA",
        office_count: "50+",
        employee_size: "1M+",
        website_url: "https://amazon.com",
        linkedin_url: "https://linkedin.com/company/amazon",
        twitter_handle: "@amazon",
        facebook_url: "",
        instagram_url: "",
        primary_contact_email: "jobs@amazon.com",
        primary_phone_number: "",
        overview_text: "Amazon is a global technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.",
        vision_statement: "To be Earth's most customer-centric company.",
        mission_statement: "We strive to offer our customers the lowest possible prices, the best available selection, and the utmost convenience.",
        legal_issues: "Various antitrust inquiries",
        carbon_footprint: "Net-zero target by 2040",
    },
    {
        company_id: 3,
        name: "Tata Consultancy Services",
        short_name: "TCS",
        category: "Regular",
        incorporation_year: "1968",
        nature_of_company: "Service",
        headquarters_address: "Mumbai, India",
        office_count: "200+",
        employee_size: "600,000+",
        website_url: "https://tcs.com",
        linkedin_url: "https://linkedin.com/company/tcs",
        twitter_handle: "@TCS",
        facebook_url: "",
        instagram_url: "",
        primary_contact_email: "careers@tcs.com",
        primary_phone_number: "",
        overview_text: "TCS is a global leader in IT services, consulting, and business solutions.",
        vision_statement: "To be the most valued partner to our clients.",
        mission_statement: "To help customers achieve their business objectives by providing innovative, best-in-class consulting, IT solutions and services.",
        legal_issues: "None significant",
        carbon_footprint: "Reduced by 50% since 2010",
    },
    {
        company_id: 4,
        name: "Google",
        short_name: "Google",
        category: "Super Dream",
        incorporation_year: "1998",
        nature_of_company: "Product",
        headquarters_address: "Mountain View, CA",
        office_count: "70+",
        employee_size: "150,000+",
        website_url: "https://google.com",
        linkedin_url: "https://linkedin.com/company/google",
        twitter_handle: "@google",
        facebook_url: "",
        instagram_url: "",
        primary_contact_email: "jobs@google.com",
        primary_phone_number: "",
        overview_text: "Google is a technology leader focused on organizing the world's information and making it universally accessible and useful.",
        vision_statement: "To provide access to the world's information in one click.",
        mission_statement: "Organize the world's information and make it universally accessible and useful.",
        legal_issues: "Ongoing regulatory scrutiny",
        carbon_footprint: "Carbon neutral since 2007",
    },
    {
        company_id: 5,
        name: "Infosys",
        short_name: "Infosys",
        category: "Regular",
        incorporation_year: "1981",
        nature_of_company: "Service",
        headquarters_address: "Bangalore, India",
        office_count: "100+",
        employee_size: "300,000+",
        website_url: "https://infosys.com",
        linkedin_url: "https://linkedin.com/company/infosys",
        twitter_handle: "@infosys",
        facebook_url: "",
        instagram_url: "",
        primary_contact_email: "careers@infosys.com",
        primary_phone_number: "",
        overview_text: "Infosys is a global leader in next-generation digital services and consulting.",
        vision_statement: "To be a globally respected corporation that provides best-of-breed business solutions.",
        mission_statement: "To achieve our objectives in an environment of fairness, honesty, and courtesy towards our clients, employees, vendors and society at large.",
        legal_issues: "None",
        carbon_footprint: "Carbon neutral since 2020",
    },
];

const COMPANY_SKILLS: CompanySkillScore[] = [
    // Innovaccer (High Coding, High DSA)
    { company_id: 1, skill_set_id: 1, level_number: 9, proficiency_level_id: 1 },
    { company_id: 1, skill_set_id: 2, level_number: 9, proficiency_level_id: 1 },
    { company_id: 1, skill_set_id: 3, level_number: 7, proficiency_level_id: 1 },
    { company_id: 1, skill_set_id: 5, level_number: 8, proficiency_level_id: 1 },
    // Amazon (Very High DSA, High System Design)
    { company_id: 2, skill_set_id: 1, level_number: 9, proficiency_level_id: 1 },
    { company_id: 2, skill_set_id: 2, level_number: 10, proficiency_level_id: 1 },
    { company_id: 2, skill_set_id: 3, level_number: 8, proficiency_level_id: 1 },
    { company_id: 2, skill_set_id: 7, level_number: 7, proficiency_level_id: 1 },
    // TCS (Moderate all)
    { company_id: 3, skill_set_id: 6, level_number: 8, proficiency_level_id: 1 },
    { company_id: 3, skill_set_id: 1, level_number: 5, proficiency_level_id: 1 },
    { company_id: 3, skill_set_id: 4, level_number: 6, proficiency_level_id: 1 },
    { company_id: 3, skill_set_id: 7, level_number: 7, proficiency_level_id: 1 },
];

const HIRING_ROUNDS: HiringRound[] = [
    {
        company_id: 1,
        hiring_data: {
            rounds: [
                { name: "Online Coding Round", type: "Technical", mode: "Online", duration: "90 mins", description: "3 coding questions (1 Easy, 1 Medium, 1 Hard) on HackerRank." },
                { name: "Technical Interview 1", type: "Technical", mode: "Online", duration: "60 mins", description: "DSA focus: Trees, Graphs, DP." },
                { name: "Technical Interview 2", type: "Technical", mode: "Online", duration: "60 mins", description: "Project deep dive + System Design basics." },
                { name: "Managerial Round", type: "HR", mode: "Online", duration: "45 mins", description: "Behavioral questions, culture fit." },
            ],
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        company_id: 2,
        hiring_data: {
            rounds: [
                { name: "Online Assessment", type: "Technical", mode: "Online", duration: "90 mins", description: "2 Coding Qs + Debugging + Aptitude + Work Style Assessment." },
                { name: "Technical Interview 1", type: "Technical", mode: "Online", duration: "60 mins", description: "DSA: Arrays, Strings, Sliding Window." },
                { name: "Technical Interview 2", type: "Technical", mode: "Online", duration: "60 mins", description: "DSA: Graphs, recursion, Trees." },
                { name: "Bar Raiser", type: "Technical/Behavioral", mode: "Online", duration: "60 mins", description: "Leadership Principles + System Design." },
            ],
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

// --- Mock Store Class ---

class MockStore {
    getAllCompanies(): Company[] {
        return COMPANIES;
    }

    getCompanyById(id: number): CompanyData | undefined {
        const company = COMPANIES.find((c) => c.company_id === id);
        if (!company) return undefined;

        // Join related data
        const skills = COMPANY_SKILLS.filter((s) => s.company_id === id);
        const hiring_rounds = HIRING_ROUNDS.find((h) => h.company_id === id);

        return {
            ...company,
            skills,
            hiring_rounds,
            // Add empty/default objects for other relations as needed for now
            business: { company_business_id: 0, company_id: id, sales_motion: "B2B", innovation_roadmap: "Focus on AI/ML", future_projections: "High Growth", market_share_percentage: "15%", tam: "$10B", sam: "$2B", som: "$500M", customer_concentration_risk: "Low" },
            culture: { company_culture_id: 0, company_id: id, employee_turnover: "10%", avg_retention_tenure: "3.5 years", layoff_history: "None recently", manager_quality: "High", psychological_safety: "High", mission_clarity: "Clear", crisis_behavior: "Supportive", burnout_risk: "Moderate" },
            financials: { company_financials_id: 0, company_id: id, annual_revenue: "$100M+", annual_profit: "$10M+", valuation: "$1B+", yoy_growth_rate: "20%", profitability_status: "Profitable", total_capital_raised: "$200M", customer_acquisition_cost: "$5000", customer_lifetime_value: "$50000", cac_ltv_ratio: "1:10", churn_rate: "5%", net_promoter_score: "70", burn_rate: "Low", runway_months: "24+", burn_multiplier: "1.2" },
            technologies: { company_technologies_id: 0, company_id: id, r_and_d_investment: "High", ai_ml_adoption_level: "High" },
            people: { company_people_id: 0, company_id: id, ceo_linkedin_url: "", contact_person_name: "HR Manager", contact_person_title: "Talent Acquisition", contact_person_email: "hr@company.com", contact_person_phone: "", decision_maker_access: "Medium", ceo_name: "CEO Name" },
        };
    }

    getCompaniesByCategory(category: string): Company[] {
        return COMPANIES.filter((c) => c.category === category);
    }

    getMetrics() {
        return {
            total: COMPANIES.length,
            marquee: COMPANIES.filter((c) => c.category === "Marquee").length,
            superDream: COMPANIES.filter((c) => c.category === "Super Dream").length,
            dream: COMPANIES.filter((c) => c.category === "Dream").length,
            regular: COMPANIES.filter((c) => c.category === "Regular").length,
        };
    }
}

export const mockStore = new MockStore();

export interface City {
    city_id: number;
    countries_id: number;
    city: string;
}

export interface Country {
    countries_id: number;
    country: string;
}

export interface Company {
    company_id: number;
    name: string | null;
    short_name: string | null;
    category: string | null;
    incorporation_year: string | null;
    nature_of_company: string | null;
    headquarters_address: string | null;
    office_count: string | null;
    employee_size: string | null;
    website_url: string | null;
    linkedin_url: string | null;
    twitter_handle: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    primary_contact_email: string | null;
    primary_phone_number: string | null;
    overview_text: string | null;
    vision_statement: string | null;
    mission_statement: string | null;
    legal_issues: string | null;
    carbon_footprint: string | null;
}

export interface CompanyAreaSafety {
    company_area_safety_id: number;
    company_logistics_id: number;
    area_safety: string | null;
}

export interface CompanyAwardsRecognitions {
    awards_recognitions_id: number;
    brand_reputation_id: number;
    awards_recognitions: string | null;
}

export interface CompanyBenchmarkVsPeers {
    company_benchmark_vs_peers_id: number;
    company_business_id: number;
    benchmark_vs_peers: string | null;
}

export interface CompanyBoardMembers {
    company_board_members_id: number;
    company_people_id: number;
    board_members: string | null;
}

export interface CompanyBrandReputation {
    brand_reputation_id: number;
    company_id: number;
    brand_sentiment_score: string | null;
    website_quality: string | null;
    website_rating: string | null;
    social_media_followers: string | null;
    glassdoor_rating: string | null;
    indeed_rating: string | null;
    google_rating: string | null;
}

export interface CompanyBusiness {
    company_business_id: number;
    company_id: number;
    sales_motion: string | null;
    innovation_roadmap: string | null;
    future_projections: string | null;
    market_share_percentage: string | null;
    tam: string | null;
    sam: string | null;
    som: string | null;
    customer_concentration_risk: string | null;
    core_value_proposition?: string | null;
}

export interface CompanyCabPolicy {
    company_cab_policy_id: number;
    company_logistics_id: number;
    cab_policy: string | null;
}

export interface CompanyCaseStudies {
    company_case_studies_id: number;
    company_business_id: number;
    case_studies: string | null;
}

export interface CompanyClientQuality {
    company_client_quality_id: number;
    company_talent_growth_id: number;
    client_quality: string | null;
}

export interface CompanyCompensation {
    company_compensation_id: number;
    company_id: number;
    fixed_vs_variable_pay: string | null;
    bonus_predictability: string | null;
}

export interface CompanyCompetitiveAdvantages {
    company_competitive_advantages_id: number;
    company_business_id: number;
    competitive_advantages: string | null;
}

export interface CompanyCoreValueProposition {
    company_core_value_proposition_id: number;
    company_business_id: number;
    core_value_proposition: string | null;
}

export interface CompanyCoreValues {
    core_values_id: number;
    company_id: number;
    core_values: string | null;
}

export interface CompanyCrossFunctionalExposure {
    company_cross_functional_exposure_id: number;
    company_talent_growth_id: number;
    cross_functional_exposure: string | null;
}

export interface CompanyCulture {
    company_culture_id: number;
    company_id: number;
    employee_turnover: string | null;
    avg_retention_tenure: string | null;
    layoff_history: string | null;
    manager_quality: string | null;
    psychological_safety: string | null;
    mission_clarity: string | null;
    crisis_behavior: string | null;
    burnout_risk: string | null;
}

export interface CompanyCustomerTestimonials {
    customer_testimonials_id: number;
    company_id: number;
    customer_testimonials: string | null;
}

export interface CompanyCybersecurityPosture {
    company_cybersecurity_posture_id: number;
    company_technologies_id: number;
    cybersecurity_posture: string | null;
}

export interface CompanyDiversityInclusionScore {
    company_diversity_inclusion_score_id: number;
    company_culture_id: number;
    diversity_inclusion_score: string | null;
}

export interface CompanyDiversityMetrics {
    company_diversity_metrics_id: number;
    company_culture_id: number;
    diversity_metrics: string | null;
}

export interface CompanyEmergencyPreparedness {
    company_emergency_preparedness_id: number;
    company_logistics_id: number;
    emergency_preparedness: string | null;
}

export interface CompanyEsgRatings {
    esg_ratings_id: number;
    company_id: number;
    esg_ratings: string | null;
}

export interface CompanyEsopsIncentives {
    company_esops_incentives_id: number;
    company_compensation_id: number;
    esops_incentives: string | null;
}

export interface CompanyEthicalSourcing {
    ethical_sourcing_id: number;
    company_id: number;
    ethical_sourcing: string | null;
}

export interface CompanyEthicalStandards {
    company_ethical_standards_id: number;
    company_culture_id: number;
    ethical_standards: string | null;
}

export interface CompanyEventParticipation {
    event_participation_id: number;
    brand_reputation_id: number;
    event_participation: string | null;
}

export interface CompanyExitOpportunities {
    company_exit_opportunities_id: number;
    company_talent_growth_id: number;
    exit_opportunities: string | null;
}

export interface CompanyExitStrategyHistory {
    company_exit_strategy_history_id: number;
    company_business_id: number;
    exit_strategy_history: string | null;
}

export interface CompanyFamilyHealthInsurance {
    company_family_health_insurance_id: number;
    company_compensation_id: number;
    family_health_insurance: string | null;
}

export interface CompanyFeedbackCulture {
    company_feedback_culture_id: number;
    company_culture_id: number;
    feedback_culture: string | null;
}

export interface CompanyFinancials {
    company_financials_id: number;
    company_id: number;
    annual_revenue: string | null;
    annual_profit: string | null;
    valuation: string | null;
    yoy_growth_rate: string | null;
    profitability_status: string | null;
    total_capital_raised: string | null;
    customer_acquisition_cost: string | null;
    customer_lifetime_value: string | null;
    cac_ltv_ratio: string | null;
    churn_rate: string | null;
    net_promoter_score: string | null;
    burn_rate: string | null;
    runway_months: string | null;
    burn_multiplier: string | null;
}

export interface CompanyFlexibilityLevel {
    company_flexibility_level_id: number;
    company_id: number;
    flexibility_level: string | null;
}

export interface CompanyFocusSectors {
    company_focus_sectors_id: number;
    company_business_id: number;
    focus_sectors: string | null;
}

export interface CompanyGeopoliticalRisks {
    geopolitical_risks_id: number;
    company_id: number;
    geopolitical_risks: string | null;
}

export interface CompanyGlobalExposure {
    company_global_exposure_id: number;
    company_talent_growth_id: number;
    global_exposure: string | null;
}

export interface CompanyGoToMarketStrategy {
    company_go_to_market_strategy_id: number;
    company_business_id: number;
    go_to_market_strategy: string | null;
}

export interface CompanyHealthSupport {
    company_health_support_id: number;
    company_compensation_id: number;
    health_support: string | null;
}

export interface CompanyHiringVelocity {
    company_hiring_velocity_id: number;
    company_culture_id: number;
    hiring_velocity: string | null;
}

export interface CompanyHistory {
    history_id: number;
    company_id: number;
    history_timeline: string | null;
}

export interface CompanyIndustryAssociations {
    company_industry_associations_id: number;
    company_business_id: number;
    industry_associations: string | null;
}

export interface CompanyInfrastructureSafety {
    company_infrastructure_safety_id: number;
    company_logistics_id: number;
    infrastructure_safety: string | null;
}

export interface CompanyInnovationRoadmap {
    company_innovation_roadmap_id: number;
    company_business_id: number;
    innovation_roadmap: string | null;
}

export interface CompanyIntellectualProperty {
    company_intellectual_property_id: number;
    company_technologies_id: number;
    intellectual_property: string | null;
}

export interface CompanyJson {
    json_id: number;
    company_id: number;
    short_json: any;
    full_json: any;
}

export interface CompanyKeyChallengesNeeds {
    company_key_challenges_needs_id: number;
    company_business_id: number;
    key_challenges_needs: string | null;
}

export interface CompanyKeyCompetitors {
    company_key_competitors_id: number;
    company_business_id: number;
    key_competitors: string | null;
}

export interface CompanyKeyInvestors {
    company_key_investors_id: number;
    company_financials_id: number;
    key_investors: string | null;
}

export interface CompanyKeyLeaders {
    company_key_leaders_id: number;
    company_people_id: number;
    key_leaders: string | null;
}

export interface CompanyLearningCulture {
    company_learning_culture_id: number;
    company_talent_growth_id: number;
    learning_culture: string | null;
}

export interface CompanyLeavePolicy {
    company_leave_policy_id: number;
    company_compensation_id: number;
    leave_policy: string | null;
}

export interface CompanyLifestyleBenefits {
    company_lifestyle_benefits_id: number;
    company_compensation_id: number;
    lifestyle_benefits: string | null;
}

export interface CompanyLogistics {
    company_logistics_id: number;
    company_id: number;
    typical_hours: string | null;
    overtime_expectations: string | null;
    weekend_work: string | null;
    remote_policy_details: string | null;
    location_centrality: string | null;
    airport_commute_time: string | null;
    office_zone_type: string | null;
}

export interface CompanyLogo {
    company_logo_id: number;
    company_id: number;
    logo_url: string | null;
}

export interface CompanyMacroRisks {
    macro_risks_id: number;
    company_id: number;
    macro_risks: string | null;
}

export interface CompanyMarketingVideos {
    marketing_videos_id: number;
    company_id: number;
    marketing_video_url: string | null;
}

export interface CompanyMentorshipAvailability {
    company_mentorship_availability_id: number;
    company_talent_growth_id: number;
    mentorship_availability: string | null;
}

export interface CompanyNetworkStrength {
    company_network_strength_id: number;
    company_talent_growth_id: number;
    network_strength: string | null;
}

export interface CompanyOfferingsDescription {
    company_offerings_description_id: number;
    company_business_id: number;
    offerings_description: string | null;
}

export interface CompanyPainPointsAddressed {
    company_pain_points_addressed_id: number;
    company_business_id: number;
    pain_points_addressed: string | null;
}

export interface CompanyPartnershipEcosystem {
    company_partnership_ecosystem_id: number;
    company_technologies_id: number;
    partnership_ecosystem: string | null;
}

export interface CompanyPeople {
    company_people_id: number;
    company_id: number;
    ceo_linkedin_url: string | null;
    contact_person_name: string | null;
    contact_person_title: string | null;
    contact_person_email: string | null;
    contact_person_phone: string | null;
    decision_maker_access: string | null;
    ceo_name: string | null;
}

export interface CompanyProductPipeline {
    company_product_pipeline_id: number;
    company_business_id: number;
    product_pipeline: string | null;
}

export interface CompanyPromotionClarity {
    company_promotion_clarity_id: number;
    company_talent_growth_id: number;
    promotion_clarity: string | null;
}

export interface CompanyPublicTransportAccess {
    company_public_transport_access_id: number;
    company_logistics_id: number;
    public_transport_access: string | null;
}

export interface CompanyRecentFundingRounds {
    company_recent_funding_rounds_id: number;
    company_financials_id: number;
    recent_funding_rounds: string | null;
}

export interface CompanyRecentNews {
    recent_news_id: number;
    company_id: number;
    recent_news: string | null;
}

export interface CompanyRegulatoryStatus {
    regulatory_status_id: number;
    company_id: number;
    regulatory_status: string | null;
}

export interface CompanyRelocationSupport {
    company_relocation_support_id: number;
    company_compensation_id: number;
    relocation_support: string | null;
}

export interface CompanyRevenueMix {
    company_revenue_mix_id: number;
    company_financials_id: number;
    revenue_mix: string | null;
}

export interface CompanySafetyPolicies {
    company_safety_policies_id: number;
    company_logistics_id: number;
    safety_policies: string | null;
}

export interface CompanySkillScore {
    company_id: number;
    skill_set_id: number;
    level_number: number;
    proficiency_level_id: number;
}

export interface CompanyStrategicPriorities {
    company_strategic_priorities_id: number;
    company_business_id: number;
    strategic_priorities: string | null;
}

export interface CompanySupplyChainDependencies {
    company_supply_chain_dependencies_id: number;
    company_id: number;
    supply_chain_dependencies: string | null;
}

export interface CompanySustainabilityCsr {
    company_sustainability_csr_id: number;
    company_culture_id: number;
    sustainability_csr: string | null;
}

export interface CompanyTalentGrowth {
    company_talent_growth_id: number;
    company_id: number;
    training_spend: string | null;
    onboarding_quality: string | null;
    internal_mobility: string | null;
    role_clarity: string | null;
    early_ownership: string | null;
    execution_thinking_balance: string | null;
    automation_level: string | null;
    company_maturity: string | null;
    brand_value: string | null;
    skill_relevance: string | null;
    exposure_quality: string | null;
    external_recognition: string | null;
}

export interface CompanyTechAdoptionRating {
    company_tech_adoption_rating_id: number;
    company_technologies_id: number;
    tech_adoption_rating: string | null;
}

export interface CompanyTechStack {
    company_tech_stack_id: number;
    company_technologies_id: number;
    tech_stack: string | null;
}

export interface CompanyTechnologies {
    company_technologies_id: number;
    company_id: number;
    r_and_d_investment: string | null;
    ai_ml_adoption_level: string | null;
}

export interface CompanyTechnologyPartners {
    company_technology_partners_id: number;
    company_technologies_id: number;
    technology_partners: string | null;
}

export interface CompanyToolsAccess {
    company_tools_access_id: number;
    company_talent_growth_id: number;
    tools_access: string | null;
}

export interface CompanyTopCustomers {
    company_top_customers_id: number;
    company_business_id: number;
    top_customers: string | null;
}

export interface CompanyUniqueDifferentiators {
    company_unique_differentiators_id: number;
    company_business_id: number;
    unique_differentiators: string | null;
}

export interface CompanyWarmIntroPathways {
    company_warm_intro_pathways_id: number;
    company_people_id: number;
    warm_intro_pathways: string | null;
}

export interface CompanyWeaknessesGaps {
    company_weaknesses_gaps_id: number;
    company_business_id: number;
    weaknesses_gaps: string | null;
}

export interface CompanyWebsiteTrafficRank {
    website_traffic_rank_id: number;
    brand_reputation_id: number;
    website_traffic_rank: string | null;
}

export interface CompanyWorkCultureSummary {
    company_work_culture_summary_id: number;
    company_culture_id: number;
    work_culture_summary: string | null;
}

export interface CompanyWorkImpact {
    company_work_impact_id: number;
    company_talent_growth_id: number;
    work_impact: string | null;
}

export interface HiringRound {
    company_id: number;
    hiring_data: any; /* jsonb */
    created_at: string | null;
    updated_at: string | null;
}

export interface ProficiencyLevel {
    proficiency_level_id: number;
    proficiency_name: string;
    proficiency_code: string;
    proficiency_description: string;
}

export interface SkillSet {
    skill_set_id: number;
    skill_name: string;
    short_name: string;
    skill_set_description: string;
}

// Composite / Joined Type for Frontend Usage
export interface CompanyData extends Company {
    business?: CompanyBusiness;
    financials?: CompanyFinancials;
    culture?: CompanyCulture;
    technologies?: CompanyTechnologies;
    people?: CompanyPeople;
    locations?: City[];
    skills?: CompanySkillScore[];
    hiring_rounds?: HiringRound;
    logo_url?: string | null;
    innovx_data?: InnovxData;
}

export interface InnovxData {
    innovation_roadmap?: any[];
    strategic_objectives?: string[];
    [key: string]: any;
}

export interface InnovxRaw {
    company_id: number;
    company_name: string | null;
    innovx_data: InnovxData;
    updated_at: string | null;
    companies?: {
        name: string;
        logo_url?: string | null;
    }
}

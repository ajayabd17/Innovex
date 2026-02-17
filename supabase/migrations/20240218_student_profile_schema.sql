-- Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    net_id VARCHAR(50) UNIQUE NOT NULL,
    degree_type VARCHAR(50), -- B.Tech, M.Tech, etc.
    department VARCHAR(100),
    specialization VARCHAR(100),
    current_cgpa NUMERIC(4, 2),
    tenth_percentage NUMERIC(5, 2),
    twelfth_percentage NUMERIC(5, 2),
    diploma_percentage NUMERIC(5, 2), -- Nullable
    active_backlogs INTEGER DEFAULT 0,
    history_backlogs INTEGER DEFAULT 0,
    gap_years INTEGER DEFAULT 0,
    gap_duration VARCHAR(50), -- e.g., "1 year"
    graduation_year INTEGER,
    profile_completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Skill Matrix (The 10 Core Skills L1-L10)
CREATE TABLE IF NOT EXISTS public.student_skill_matrix (
    matrix_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(student_id) ON DELETE CASCADE,
    coding INTEGER CHECK (coding BETWEEN 0 AND 10),
    dsa INTEGER CHECK (dsa BETWEEN 0 AND 10),
    system_design INTEGER CHECK (system_design BETWEEN 0 AND 10),
    computer_fundamentals INTEGER CHECK (computer_fundamentals BETWEEN 0 AND 10),
    web_development INTEGER CHECK (web_development BETWEEN 0 AND 10),
    aptitude INTEGER CHECK (aptitude BETWEEN 0 AND 10),
    communication INTEGER CHECK (communication BETWEEN 0 AND 10),
    cloud_computing INTEGER CHECK (cloud_computing BETWEEN 0 AND 10),
    data_science_ai INTEGER CHECK (data_science_ai BETWEEN 0 AND 10),
    software_engineering INTEGER CHECK (software_engineering BETWEEN 0 AND 10),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_student_matrix UNIQUE (student_id)
);

-- Student Projects
CREATE TABLE IF NOT EXISTS public.student_projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(student_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack JSONB DEFAULT '[]'::jsonb, -- Array of strings
    problem_statement TEXT,
    deployment_status VARCHAR(50), -- Live, In Progress, Prototype
    github_link VARCHAR(255),
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Experience (Internships/Work)
CREATE TABLE IF NOT EXISTS public.student_experience (
    experience_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(student_id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    duration_months INTEGER,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Preferences
CREATE TABLE IF NOT EXISTS public.student_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(student_id) ON DELETE CASCADE,
    preferred_roles JSONB DEFAULT '[]'::jsonb, -- Array of strings
    preferred_locations JSONB DEFAULT '[]'::jsonb, -- Array of strings
    willing_to_relocate BOOLEAN DEFAULT true,
    open_to_bond BOOLEAN DEFAULT true,
    open_to_startup BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_student_preference UNIQUE (student_id)
);

-- Student Scores (Computed for Company Matching)
CREATE TABLE IF NOT EXISTS public.student_scores (
    score_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(student_id) ON DELETE CASCADE,
    eligibility_score INTEGER DEFAULT 0,
    technical_depth_score INTEGER DEFAULT 0,
    domain_match_index INTEGER DEFAULT 0,
    placement_readiness_score INTEGER DEFAULT 0,
    last_computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_student_scores UNIQUE (student_id)
);

-- RLS Policies (Simple for now - assume authenticated user matches net_id or student_id)
-- For this demo, we can perform these operations basically public/interactive if strict RLS isn't set up yet.
-- Ideally:
-- ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own profile" ON public.student_profiles FOR SELECT USING (auth.uid() = student_id OR net_id = current_user_net_id());

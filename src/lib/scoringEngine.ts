import type { StudentProfile, StudentSkillMatrix } from "@/types/schema";

export const ScoringEngine = {
    calculateEligibilityScore(profile: Partial<StudentProfile>): number {
        let score = 100;

        // 1. CGPA Impact (Max 40 points)
        // >= 9.0: 40 pts, >= 8.0: 30 pts, >= 7.0: 20 pts, >= 6.0: 10 pts
        const cgpa = Number(profile.current_cgpa || 0);
        if (cgpa < 6.0) score -= 40;
        else if (cgpa < 7.0) score -= 30;
        else if (cgpa < 8.0) score -= 20;
        else if (cgpa < 9.0) score -= 10;

        // 2. Backlogs Impact (Max 30 points)
        // 0 active: 0 deduction
        // 1 active: -15 pts
        // >1 active: -30 pts
        const backlogs = Number(profile.active_backlogs || 0);
        if (backlogs === 1) score -= 15;
        else if (backlogs > 1) score -= 30;

        // 3. History Backlogs (Max 10 points)
        // >0 history backlogs: -5 pts
        if ((profile.history_backlogs || 0) > 0) score -= 5;

        // 4. Academic Gap (Max 20 points)
        if ((profile.gap_years || 0) > 0) score -= 10;

        return Math.max(0, score);
    },

    calculateTechnicalDepthScore(matrix: Partial<StudentSkillMatrix>): number {
        if (!matrix) return 0;

        let totalScore = 0;
        let maxScore = 0;

        // 1. Languages (Max 30)
        // 5 points per language (up to 3), weighted by proficiency
        const langs = matrix.languages || [];
        langs.slice(0, 3).forEach(l => {
            totalScore += (l.proficiency / 5) * 10; // Max 10 per lang
            maxScore += 10;
        });

        // 2. Core Subjects (Max 40)
        // 5 points per subject (up to 4), weighted by proficiency
        const subjects = matrix.core_subjects || {};
        Object.values(subjects).forEach(rating => {
            totalScore += (rating / 5) * 10;
            maxScore += 10;
        });

        // 3. Tools (Max 15)
        // 5 points per tool
        const tools = matrix.tools || [];
        totalScore += Math.min(tools.length * 5, 15);
        maxScore += 15;

        // 4. Domains (Max 15)
        // 7.5 points per domain
        const domains = matrix.domains || [];
        totalScore += Math.min(domains.length * 7.5, 15);
        maxScore += 15;

        // Normalize to 100 if maxScore is low (e.g. beginner) to avoid skewed percentages
        // But for "Depth", we want absolute value.
        // Actually let's just cap at 100
        return Math.min(Math.round(totalScore), 100);
    },

    calculatePlacementReadiness(profile: Partial<StudentProfile>, matrix: Partial<StudentSkillMatrix>): number {
        const eligibility = this.calculateEligibilityScore(profile);
        const technical = this.calculateTechnicalDepthScore(matrix);

        // Readiness is 40% Eligibility + 60% Technical Skill
        return Math.round((eligibility * 0.4) + (technical * 0.6));
    },

    /**
     * Compares Student Skills vs Company Requirements
     * @param studentSkills Student's skill matrix
     * @param companyRequirements Mocked requirements for now (or from DB)
     */
    calculateSkillMatch(studentSkills: Partial<StudentSkillMatrix>, companyRequirements: any) {
        if (!studentSkills) return { matchScore: 0, gaps: [], matches: [], proficiencyGaps: [] };

        const matches: string[] = [];
        const gaps: string[] = [];
        const proficiencyGaps: { skill: string, current: number, required: number }[] = [];
        let totalWeight = 0;
        let earnedWeight = 0;

        // 1. Check Languages (High Weight)
        // Assume company needs at least one match from their stack
        const requiredLangs = companyRequirements.languages || [];
        const studentLangs = (studentSkills.languages as any[])?.map(l => l.language) || [];

        // Check for intersection
        const langMatch = requiredLangs.some((r: string) => studentLangs.includes(r));
        totalWeight += 20;
        if (langMatch) {
            earnedWeight += 20;
            matches.push(`Language Match (${requiredLangs.find((r: string) => studentLangs.includes(r))})`);
        } else {
            gaps.push(`Missing Language: ${requiredLangs.join(" or ")}`);
        }

        // 2. Check Core Subjects (Medium Weight)
        // Check if student has rated themselves > 2 in required cores
        const requiredCores = companyRequirements.core_subjects || [];
        const studentCores = studentSkills.core_subjects || {};

        requiredCores.forEach((core: string) => {
            totalWeight += 10;
            const rating = (studentCores as any)[core] || 0;
            if (rating >= 3) {
                earnedWeight += 10;
                matches.push(core);
            } else if (rating > 0) {
                earnedWeight += 5; // Partial credit
                proficiencyGaps.push({ skill: core, current: rating, required: 3 });
            } else {
                gaps.push(`Missing Core Subject: ${core}`);
            }
        });

        // 3. Check Tools/Domains (Low Weight)
        const requiredTools = companyRequirements.tools || [];
        const studentTools = studentSkills.tools || [];

        requiredTools.forEach((tool: string) => {
            totalWeight += 5;
            if (studentTools.includes(tool)) {
                earnedWeight += 5;
                matches.push(tool);
            } else {
                gaps.push(`Missing Tool: ${tool}`);
            }
        });

        const matchScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

        return {
            matchScore,
            matches,
            gaps,
            proficiencyGaps
        };
    }
};

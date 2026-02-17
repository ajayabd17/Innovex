
import type { SkillSet } from "@/types/schema";

export const SKILL_SETS: SkillSet[] = [
    { skill_set_id: 1, skill_name: "Coding", short_name: "Code", skill_set_description: "Programming & Algorithms" },
    { skill_set_id: 2, skill_name: "Data Structures & Algorithms", short_name: "DSA", skill_set_description: "Core DSA concepts" },
    { skill_set_id: 3, skill_name: "System Design", short_name: "SysDesign", skill_set_description: "LLD & HLD" },
    { skill_set_id: 4, skill_name: "Computer Fundamentals", short_name: "CS Fun", skill_set_description: "OS, DBMS, Networks" },
    { skill_set_id: 5, skill_name: "Web Development", short_name: "WebDev", skill_set_description: "Frontend & Backend" },
    { skill_set_id: 6, skill_name: "Aptitude", short_name: "Aptitude", skill_set_description: "Quant & Logical" },
    { skill_set_id: 7, skill_name: "Communication", short_name: "Comm", skill_set_description: "Verbal & Written" },
    { skill_set_id: 8, skill_name: "Cloud Computing", short_name: "Cloud", skill_set_description: "AWS, Azure, DevOps" },
    { skill_set_id: 9, skill_name: "Data Science & AI", short_name: "AI/ML", skill_set_description: "ML, Python, Analytics" },
    { skill_set_id: 10, skill_name: "Software Engineering", short_name: "SWE", skill_set_description: "SDLC, Testing, Agile" },
];

export const getSkillName = (id: number) => SKILL_SETS.find((s) => s.skill_set_id === id)?.skill_name || "Unknown";

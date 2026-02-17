export const DEPARTMENTS = [
    "Aerospace Engineering",
    "Automobile Engineering",
    "Biotechnology",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science and Engineering",
    "Computational Intelligence",
    "Networking & Communications",
    "Data Science and Business Systems",
    "Electrical and Electronics Engineering",
    "Electronics and Communication Engineering",
    "Electronics and Instrumentation Engineering",
    "Information Technology",
    "Mechanical Engineering",
    "Mechatronics Engineering",
    "Nanotechnology"
] as const;

export const SPECIALIZATIONS: Record<string, string[]> = {
    "Computer Science and Engineering": [
        "CSE & Computing",
        "Computer Science and Engineering",
        "CSE – Artificial Intelligence and Machine Learning",
        "CSE – Big Data Analytics",
        "CSE – Cloud Computing",
        "CSE – Cyber Security"
    ],
    "Computational Intelligence": [
        "Artificial Intelligence",
        "Artificial Intelligence and Data Science",
        "Computer Science and Business Systems"
    ],
    "Networking & Communications": [
        "Computer Science and Engineering" // Assuming fallback or specific spec
    ],
    "Electronics and Communication Engineering": [
        "Electronics and Communication Engineering",
        "ECE – Cyber Physical Systems"
    ],
    "Electronics and Instrumentation Engineering": [
        "Electronics and Instrumentation Engineering",
        "Electronics Engineering – VLSI Design"
    ],
    "Electrical and Electronics Engineering": [
        "Electrical and Electronics Engineering"
    ],
    "Mechanical Engineering": [
        "Mechanical Engineering",
        "Mechanical Engineering – AI & ML"
    ],
    "Mechatronics Engineering": [
        "Mechatronics Engineering",
        "Mechatronics Engineering – Robotics",
        "Automation and Robotics"
    ],
    "Civil Engineering": [
        "Civil Engineering"
    ],
    "Aerospace Engineering": [
        "Aerospace Engineering"
    ],
    "Automobile Engineering": [
        "Automobile Engineering",
        "Automotive Engineering"
    ],
    "Biotechnology": [
        "Biotechnology",
        "Biotechnology – Regenerative Medicine",
        "Biotechnology – Genetic Engineering",
        "Food Process Engineering" // Grouped here based on context
    ],
    "Chemical Engineering": [
        "Chemical Engineering"
    ],
    "Nanotechnology": [
        "Nanotechnology"
    ]
    // Add others as needed or map to "Other"
};

export const PROGRAMMING_LANGUAGES = [
    "Python", "Java", "C", "C++", "JavaScript", "TypeScript",
    "Go", "Rust", "Swift", "Kotlin", "Ruby", "PHP", "SQL"
];

export const CORE_SUBJECTS = {
    "Computing": ["Data Structures & Algorithms", "OOPS", "DBMS", "Operating Systems", "Computer Networks"],
    // "Core": ["Thermodynamics", "Circuit Theory", etc.] - Can expand later
};

export const DOMAINS = [
    "AI / ML", "Data Science", "Full Stack", "Backend", "DevOps", "Cloud", "Cybersecurity",
    "VLSI", "Embedded Systems", "Robotics",
    "Core Mechanical", "Core Civil", "Core Electrical", "Automotive Systems",
    "Biotechnology Research", "Process Engineering"
];

export const TOOLS = [
    "Git", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
    "Jenkins", "Jira", "Figma", "Postman", "MongoDB", "Redis",
    "React", "Node.js", "Spring Boot", "Django", "Flask", "TensorFlow", "PyTorch"
];

export const LOCATIONS = [
    "Bangalore", "Hyderabad", "Pune", "Chennai", "Delhi NCR", "Mumbai", "Remote"
];

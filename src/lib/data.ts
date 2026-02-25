export const portfolioData = {
  name: "Russell Robbins",
  title: "Technical Manager & AI Developer",
  email: "russrobbinsjr52@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/russell-robbins-62871a296",
    github: "https://github.com/superordie",
  },
  about: `From coordinating complex logistics as a transport professional to designing intelligent systems as an aspiring AI developer, my career has been a journey of continuous problem-solving. I am currently a Technical Management student at DeVry University and an AI bootcamp graduate, channeling my passion for efficiency and system design into modern web development. My goal is to leverage AI and automation to build tools that are not only powerful but also intuitive and reliable. I thrive on deconstructing complex challenges and engineering elegant solutions, and I am excited to build a career in a field that is constantly pushing the boundaries of what's possible.`,
};

export const portfolioContent = {
  aboutMe: portfolioData.about,
  education: [
    {
      degreeProgramName: "Bachelor of Science in Technical Management",
      institutionName: "DeVry University",
      completionDate: "March 2028",
      relevantCourseworkOrFocusAreas: [
        "Introduction to Programming",
        "AI Bootcamp",
        "Introduction to Operating Systems",
        "Technology and Information Systems",
        "Computer Applications for Business",
        "Introduction to Business and Technology",
      ],
    },
  ],
  certifications: [
    {
      certificationName: "Google IT Support Professional Certificate",
      issuingOrganization: "Google",
      yearEarned: "2025",
      credentialURL: "https://www.coursera.org/account/accomplishments/specialization/certificate/3B1G9HN8W2VD",
    },
  ],
  workHistory: [
    {
      jobTitleRole: "Truck Driver",
      organizationCompany: "Ryder Systems",
      datesOfInvolvement: "March 2022 – July 2024",
      keyResponsibilities: [
        "Ensured 100% on-time delivery rate through strategic route planning and proactive logistical troubleshooting.",
        "Maintained a perfect safety and compliance record by conducting meticulous daily vehicle inspections.",
        "Achieved high levels of client satisfaction by providing reliable, customer-centric delivery services.",
      ],
    },
    {
      jobTitleRole: "Truck Driver and Trainer",
      organizationCompany: "Central Freight Lines",
      datesOfInvolvement: "July 2012 – December 2021",
      keyResponsibilities: [
        "Successfully trained and mentored over a dozen new drivers on logistics protocols, safety procedures, and customer service excellence.",
        "Served as a key point of contact for regional clients, ensuring clear communication and consistent freight delivery.",
        "Guaranteed regulatory compliance by maintaining precise documentation and adhering to all DOT standards.",
      ],
    },
  ],
  skills: {
    technicalSkills: [
      "Troubleshooting & Diagnostics",
      "Cybersecurity Fundamentals",
      "Operating Systems Fundamentals",
      "Technical Documentation",
      "System Maintenance Procedures",
      "Introductory Programming",
      "Technical Training",
    ],
    toolsAndTechnologies: [
      "Microsoft Office Suite",
      "Windows & Linux OS",
      "Business & Productivity Apps",
      "Ticketing & Logging Systems",
      "AI Development Tools",
      "Python",
      "Ollama",
      "REST APIs",
      "Firebase Studio",
    ],
    professionalSoftSkills: [
      "Clear Communication",
      "Customer Service & Support",
      "Conflict Resolution",
      "Logistics & Scheduling",
      "Inventory Management",
      "Procedural Compliance",
      "Team Training & Mentoring",
      "Adaptability",
      "Leadership & Discipline",
      "Process Optimization",
    ],
  },
  projects: [
    {
      projectTitle: "CelebrationHub",
      projectPurposeProblemSolved: "Designed a simple party-planning web app that helps users organize event details, guest lists, and planning tasks. I provided the functional requirements, used Firebase Studio’s AI to generate the code, and iteratively tested the app to identify issues and guide corrections.",
      toolsOrTechnologiesUsed: ["Firebase Studio", "AI Code Generation", "HTML/CSS", "JavaScript"],
      skillsDemonstrated: ["Prompt Engineering", "App Design", "Iterative Testing", "Debugging", "UI/UX Validation"],
      projectLink: "https://github.com/superordie/CelebrationHub",
    },
    {
      projectTitle: "ResumeKeeper",
      projectPurposeProblemSolved: "Created a résumé-management tool that allows users to store and update their professional information in a structured interface. I defined the requirements, used Firebase Studio to generate the code, and tested each component to ensure correct behavior.",
      toolsOrTechnologiesUsed: ["Firebase Studio", "AI Code Generation", "HTML/CSS", "JavaScript"],
      skillsDemonstrated: ["Requirements Definition", "AI-Assisted Development", "Targeted Debugging", "UI Validation"],
      projectLink: "https://github.com/superordie/ResumeKeeper",
    },
    {
      projectTitle: "Local AI Agent Pipeline",
      projectPurposeProblemSolved: "Built a fully local AI agent using Ollama and Python to run OpenAI-style chat completions without cloud APIs. I configured the environment, installed a local model, and validated the pipeline with real prompts.",
      toolsOrTechnologiesUsed: ["Python", "Ollama", "REST API", "Local LLMs (qwen2:7b)"],
      skillsDemonstrated: ["API Integration", "Local Environment Setup", "Troubleshooting", "Functional AI Workflows"],
      projectLink: "https://github.com/superordie/A.I.",
    },
    {
      projectTitle: "Personal Portfolio Website",
      projectPurposeProblemSolved: "Built this clean, professional portfolio site to showcase my projects and coursework. I used Firebase Studio to generate the initial layout and refined the structure through iterative testing and targeted prompts.",
      toolsOrTechnologiesUsed: ["Next.js", "React", "Tailwind CSS", "Firebase Studio", "Genkit"],
      skillsDemonstrated: ["Content Organization", "Prompt-Driven Development", "UI/UX Review", "Iterative Refinement"],
      projectLink: "https://github.com/superordie/Synthfolio",
    },
  ],
};

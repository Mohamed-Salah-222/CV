export interface CVData {
  header: {
    links: { label: string; url: string }[];
  };
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    duration: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    link: string;
  }[];
}

export const dummyCVData: CVData = {
  header: {
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
      { label: "GitHub", url: "https://github.com/johndoe" },
    ],
  },
  personal: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    summary:
      "Experienced software engineer with 5+ years of experience building scalable web applications. Passionate about clean code and user experience.",
  },
  experience: [
    {
      company: "Tech Corp",
      role: "Senior Developer",
      duration: "2022 - Present",
      description:
        "Led development of microservices architecture serving 1M+ users. Reduced latency by 40% through optimization.",
    },
    {
      company: "Startup Inc",
      role: "Full Stack Developer",
      duration: "2020 - 2022",
      description:
        "Built MVP from scratch using React and Node.js. Grew user base from 0 to 100K.",
    },
  ],
  education: [
    {
      school: "Stanford University",
      degree: "BS Computer Science",
      duration: "2016 - 2020",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
  projects: [
    {
      name: "Open Source UI Library",
      description: "Contributed to popular React component library with 10K+ stars",
      link: "https://github.com/johndoe/ui-lib",
    },
  ],
};
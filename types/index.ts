type SkillLevel = "beginner" | "intermediate" | "advanced";

type SeniorityLevel = "junior" | "mid" | "senior";
type SuggestionStrength = "weak" | "medium" | "strong";

interface Skill {
  name: string;
  level: SkillLevel;
}

interface SkillCluster {
  name: string;
  skills: string[];
}

interface Role {
  title: string;
  company: string;
  duration: string;
  responsibilities: string[];
}

interface SkillGraph {
  skills: Skill[];
  skillClusters: SkillCluster[];
  roles: Role[];
  domains: string[];
  seniority: SeniorityLevel;
}


type FieldType =
  | "summary"
  | "experience"
  | "project"
  | "skills"
  | "education"
  | "other";

interface SuggestionTags {
  skills: string[];
  focus: string;
  tone: string;
  strength: SuggestionStrength;
}

interface Suggestion {
  text: string;
  tags: SuggestionTags;
}

interface FieldSuggestions {
  fieldId: string;
  fieldType: FieldType;
  suggestions: Suggestion[];
}


interface AIResult {
  skillGraph: SkillGraph;
  fieldSuggestions: FieldSuggestions[];
}


interface AISuggestion {
  data: AIResult;
  score: number;
}

export type { AISuggestion, SkillLevel, SeniorityLevel, SuggestionStrength, Skill, SkillCluster, Role, SkillGraph, FieldType, SuggestionTags, Suggestion, FieldSuggestions, AIResult }

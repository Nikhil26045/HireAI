export type InterviewStatus = "Scheduled" | "In Progress" | "Completed" | "Pending Evaluation" | "Cancelled";

export type EvaluationStatus = "Available" | "Pending" | "Not Available";

export interface CategoryScore {
  category: string;
  score: number; // 0-100
}

export interface QuestionFeedback {
  questionNumber: number;
  question: string;
  maxMarks: number;
  marksObtained: number;
  feedback: string;
}

export interface EvaluationReport {
  id: string;
  candidateId: string;
  interviewId: string;
  overallScore: number; // 0-100
  maxScore: number; // 100
  evaluationDate: string;
  status: "Completed" | "Pending";
  categoryBreakdown: CategoryScore[];
  questionFeedback: QuestionFeedback[];
  strengths: string[];
  improvements: string[];
  summary: string;
  recommendation: "Strong Hire" | "Hire" | "Consider" | "Do Not Hire";
  isMockData: boolean; // clearly flags frontend mock vs backend data
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  experience?: string;
  position: string;
  hasResume: boolean;
  resumeFileName?: string;
  skills: string[];
  interviewId: string;
  interviewDate: string;
  interviewTime: string;
  interviewStatus: InterviewStatus;
  evaluationStatus: EvaluationStatus;
  evaluationScore?: number | null; // null if not yet evaluated or scheduled
  evaluationId?: string;
}

export interface Interview {
  id: string;
  title: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  type: string;
  status: InterviewStatus;
  evaluationStatus: EvaluationStatus;
  score?: number | null;
  evaluationId?: string;
}

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    position: "Senior Full Stack Engineer",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    experience: "5+ years",
    hasResume: true,
    resumeFileName: "Alex_Chen_Resume.pdf",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js"],
    interviewId: "int-1",
    interviewDate: "October 12, 2026",
    interviewTime: "10:30 AM",
    interviewStatus: "Scheduled",
    evaluationStatus: "Not Available",
    evaluationScore: null,
  },
  {
    id: "cand-2",
    name: "Sarah Jenkins",
    email: "sarah.j@techcorp.io",
    position: "AI / ML Engineer",
    phone: "+1 (555) 987-6543",
    location: "Seattle, WA",
    experience: "4 years",
    hasResume: true,
    resumeFileName: "Sarah_Jenkins_CV.pdf",
    skills: ["Python", "PyTorch", "FastAPI", "NLP", "LLMs"],
    interviewId: "int-2",
    interviewDate: "October 5, 2026",
    interviewTime: "02:00 PM",
    interviewStatus: "Completed",
    evaluationStatus: "Available",
    evaluationScore: 88,
    evaluationId: "eval-2",
  },
  {
    id: "cand-3",
    name: "David Kim",
    email: "david.kim@innovate.dev",
    position: "Backend Systems Architect",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    experience: "7 years",
    hasResume: true,
    resumeFileName: "David_Kim_Backend.pdf",
    skills: ["Go", "Distributed Systems", "Kubernetes", "gRPC", "Redis"],
    interviewId: "int-3",
    interviewDate: "September 28, 2026",
    interviewTime: "11:00 AM",
    interviewStatus: "Completed",
    evaluationStatus: "Available",
    evaluationScore: 82,
    evaluationId: "eval-3",
  },
  {
    id: "cand-4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@designhub.org",
    position: "Frontend UI/UX Developer",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    experience: "3 years",
    hasResume: true,
    resumeFileName: "Emily_Rodriguez_Portfolio.pdf",
    skills: ["React", "Tailwind CSS", "Figma", "Accessibility", "Design Systems"],
    interviewId: "int-4",
    interviewDate: "October 8, 2026",
    interviewTime: "04:30 PM",
    interviewStatus: "Completed",
    evaluationStatus: "Pending",
    evaluationScore: null, // Completed but evaluation pending AI synthesis
  },
  {
    id: "cand-5",
    name: "Marcus Vance",
    email: "marcus.v@cloudscale.net",
    position: "DevOps & Cloud Engineer",
    phone: "+1 (555) 876-5432",
    location: "Chicago, IL",
    experience: "6 years",
    hasResume: false,
    skills: ["AWS", "Terraform", "CI/CD", "Docker", "Linux"],
    interviewId: "int-5",
    interviewDate: "October 14, 2026",
    interviewTime: "01:15 PM",
    interviewStatus: "Scheduled",
    evaluationStatus: "Not Available",
    evaluationScore: null,
  },
  {
    id: "cand-6",
    name: "Priya Patel",
    email: "priya.patel@dataworks.io",
    position: "Data Scientist",
    phone: "+1 (555) 654-3210",
    location: "Boston, MA",
    experience: "4 years",
    hasResume: true,
    resumeFileName: "Priya_Patel_DataScience.pdf",
    skills: ["Python", "Pandas", "SQL", "Scikit-Learn", "Tableau"],
    interviewId: "int-6",
    interviewDate: "October 2, 2026",
    interviewTime: "09:00 AM",
    interviewStatus: "Cancelled",
    evaluationStatus: "Not Available",
    evaluationScore: null,
  },
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: "int-1",
    title: "AI Candidate Evaluation",
    candidateId: "cand-1",
    candidateName: "Alex Chen",
    candidateEmail: "alex.chen@example.com",
    position: "Senior Full Stack Engineer",
    scheduledDate: "October 12, 2026",
    scheduledTime: "10:30 AM",
    duration: "30 mins",
    type: "Technical & Problem Solving",
    status: "Scheduled",
    evaluationStatus: "Not Available",
    score: null,
  },
  {
    id: "int-2",
    title: "AI Candidate Evaluation",
    candidateId: "cand-2",
    candidateName: "Sarah Jenkins",
    candidateEmail: "sarah.j@techcorp.io",
    position: "AI / ML Engineer",
    scheduledDate: "October 5, 2026",
    scheduledTime: "02:00 PM",
    duration: "45 mins",
    type: "AI Architecture & NLP",
    status: "Completed",
    evaluationStatus: "Available",
    score: 88,
    evaluationId: "eval-2",
  },
  {
    id: "int-3",
    title: "Technical Candidate Evaluation",
    candidateId: "cand-3",
    candidateName: "David Kim",
    candidateEmail: "david.kim@innovate.dev",
    position: "Backend Systems Architect",
    scheduledDate: "September 28, 2026",
    scheduledTime: "11:00 AM",
    duration: "40 mins",
    type: "Distributed Systems & Go",
    status: "Completed",
    evaluationStatus: "Available",
    score: 82,
    evaluationId: "eval-3",
  },
  {
    id: "int-4",
    title: "Frontend Architecture Evaluation",
    candidateId: "cand-4",
    candidateName: "Emily Rodriguez",
    candidateEmail: "emily.rodriguez@designhub.org",
    position: "Frontend UI/UX Developer",
    scheduledDate: "October 8, 2026",
    scheduledTime: "04:30 PM",
    duration: "30 mins",
    type: "Design Systems & Web Performance",
    status: "Completed",
    evaluationStatus: "Pending",
    score: null,
  },
  {
    id: "int-5",
    title: "Cloud Infrastructure Assessment",
    candidateId: "cand-5",
    candidateName: "Marcus Vance",
    candidateEmail: "marcus.v@cloudscale.net",
    position: "DevOps & Cloud Engineer",
    scheduledDate: "October 14, 2026",
    scheduledTime: "01:15 PM",
    duration: "35 mins",
    type: "DevOps, Terraform & Security",
    status: "Scheduled",
    evaluationStatus: "Not Available",
    score: null,
  },
  {
    id: "int-6",
    title: "Data Science & Predictive Modeling",
    candidateId: "cand-6",
    candidateName: "Priya Patel",
    candidateEmail: "priya.patel@dataworks.io",
    position: "Data Scientist",
    scheduledDate: "October 2, 2026",
    scheduledTime: "09:00 AM",
    duration: "30 mins",
    type: "Statistical Analysis & ML",
    status: "Cancelled",
    evaluationStatus: "Not Available",
    score: null,
  },
];

export const INITIAL_EVALUATIONS: Record<string, EvaluationReport> = {
  "eval-2": {
    id: "eval-2",
    candidateId: "cand-2",
    interviewId: "int-2",
    overallScore: 88,
    maxScore: 100,
    evaluationDate: "October 5, 2026",
    status: "Completed",
    recommendation: "Strong Hire",
    isMockData: true,
    categoryBreakdown: [
      { category: "Technical Knowledge", score: 86 },
      { category: "Communication", score: 90 },
      { category: "Problem Solving", score: 88 },
      { category: "Confidence & Clarity", score: 89 },
    ],
    questionFeedback: [
      {
        questionNumber: 1,
        question: "Explain the architectural differences between Transformer decoders and encoder-decoder frameworks.",
        maxMarks: 25,
        marksObtained: 23,
        feedback: "Exceptional explanation of attention masks, KV caching mechanisms, and autoregressive generation.",
      },
      {
        questionNumber: 2,
        question: "How do you mitigate hallucinations and drift in production RAG systems?",
        maxMarks: 25,
        marksObtained: 21,
        feedback: "Demonstrated clear grasp of reranking, hybrid search, and semantic guardrails.",
      },
      {
        questionNumber: 3,
        question: "Describe your approach to optimizing latency when serving 7B-parameter models locally.",
        maxMarks: 25,
        marksObtained: 22,
        feedback: "Good knowledge of quantization (AWQ, GPTQ) and vLLM continuous batching.",
      },
      {
        questionNumber: 4,
        question: "Walk us through a scenario where a production ML pipeline failed and how you communicated it.",
        maxMarks: 25,
        marksObtained: 22,
        feedback: "Structured STAR response with empathetic team communication and clear post-mortem protocol.",
      },
    ],
    strengths: [
      "Deep foundational understanding of modern generative AI and inference architectures",
      "Very clear and concise verbal communication with zero ambiguity",
      "Structured problem-solving cadence during unpredictable technical questions",
    ],
    improvements: [
      "Could elaborate further on cost optimization trade-offs for cloud vs on-prem inference",
      "Minor pauses when articulating edge-case error telemetry",
    ],
    summary:
      "Sarah Jenkins demonstrated high technical competence across all evaluated dimensions. She combines solid algorithmic knowledge with articulate communication and structured composure under pressure.",
  },
  "eval-3": {
    id: "eval-3",
    candidateId: "cand-3",
    interviewId: "int-3",
    overallScore: 82,
    maxScore: 100,
    evaluationDate: "September 28, 2026",
    status: "Completed",
    recommendation: "Hire",
    isMockData: true,
    categoryBreakdown: [
      { category: "Technical Knowledge", score: 80 },
      { category: "Communication", score: 85 },
      { category: "Problem Solving", score: 82 },
      { category: "Confidence & Clarity", score: 81 },
    ],
    questionFeedback: [
      {
        questionNumber: 1,
        question: "Explain how Go's goroutine runtime scheduler handles blocking system calls.",
        maxMarks: 25,
        marksObtained: 20,
        feedback: "Accurately described the M:N scheduler, netpoller, and OS thread detachment.",
      },
      {
        questionNumber: 2,
        question: "Design a fault-tolerant rate limiter for a distributed banking API.",
        maxMarks: 25,
        marksObtained: 21,
        feedback: "Strong choice using Redis sliding window log with fallback to local token bucket.",
      },
      {
        questionNumber: 3,
        question: "What strategies do you use for zero-downtime database schema migrations?",
        maxMarks: 25,
        marksObtained: 20,
        feedback: "Solid explaination of expand-contract pattern and asynchronous column backfills.",
      },
      {
        questionNumber: 4,
        question: "How do you handle disagreements on technical architecture inside a cross-functional team?",
        maxMarks: 25,
        marksObtained: 21,
        feedback: "Clear emphasis on RFC documents, objective benchmarks, and pragmatic consensus building.",
      },
    ],
    strengths: [
      "Pragmatic systems engineering experience with high-load architectures",
      "Strong grasp of concurrency paradigms and distributed data consistency",
    ],
    improvements: [
      "Work on conversational speed during complex whiteboard explanations",
      "Could provide more structured quantitative metrics when discussing system performance",
    ],
    summary:
      "David Kim displayed robust backend architecture capabilities and solid communication. Recommended for high-scale backend engineering roles.",
  },
};


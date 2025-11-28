import { create } from "zustand";

export type DealStage = "lead" | "proposal_sent" | "negotiation" | "won" | "lost";
export type KanbanColumn = "todo" | "in_progress" | "waiting" | "revisions" | "ready" | "completed";
export type SnippetCategory = "intros" | "follow_ups" | "delivery" | "portfolio" | "quick_replies";
export type TemplateCategory = "design" | "admin" | "real_estate" | "bpo" | "tutoring";
export type AvailabilityStatus = "available" | "busy" | "unavailable";
export type ExpenseCategory = "tools" | "software" | "outsourcing" | "marketing" | "equipment" | "other";

export interface Bid {
  id: string;
  clientName: string;
  amount: number;
  date: string;
  won: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dealStage: DealStage;
  revenue: number;
  notes: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  deadline: string;
  revenue: number;
  notes: string;
  column: KanbanColumn;
}

export interface Developer {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  profileLink: string;
  notes: string;
  availability: AvailabilityStatus;
  avatar?: number;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  category: SnippetCategory;
}

export interface ProposalTemplate {
  id: string;
  category: TemplateCategory;
  name: string;
  template: string;
}

export interface Expense {
  id: string;
  projectId?: string;
  projectTitle?: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
}

export interface UserProfile {
  name: string;
  avatarIndex: number;
}

interface DataStore {
  bids: Bid[];
  clients: Client[];
  projects: Project[];
  developers: Developer[];
  snippets: Snippet[];
  templates: ProposalTemplate[];
  expenses: Expense[];
  userProfile: UserProfile;
  addBid: (bid: Omit<Bid, "id">) => void;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  moveProject: (id: string, column: KanbanColumn) => void;
  deleteProject: (id: string) => void;
  addDeveloper: (developer: Omit<Developer, "id">) => void;
  updateDeveloper: (id: string, developer: Partial<Developer>) => void;
  deleteDeveloper: (id: string) => void;
  addSnippet: (snippet: Omit<Snippet, "id">) => void;
  updateSnippet: (id: string, snippet: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialBids: Bid[] = [
  { id: "1", clientName: "TechCorp", amount: 500, date: new Date().toISOString(), won: true },
  { id: "2", clientName: "DesignStudio", amount: 750, date: new Date().toISOString(), won: false },
  { id: "3", clientName: "StartupX", amount: 1200, date: new Date(Date.now() - 86400000).toISOString(), won: true },
  { id: "4", clientName: "AgencyPro", amount: 300, date: new Date(Date.now() - 86400000 * 2).toISOString(), won: true },
  { id: "5", clientName: "MediaGroup", amount: 850, date: new Date(Date.now() - 86400000 * 5).toISOString(), won: false },
];

const initialClients: Client[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@techcorp.com", phone: "+1 555-0101", dealStage: "won", revenue: 5200, notes: "Repeat client, prefers morning calls", avatar: undefined },
  { id: "2", name: "Michael Chen", email: "m.chen@designstudio.io", phone: "+1 555-0102", dealStage: "negotiation", revenue: 0, notes: "Interested in long-term partnership", avatar: undefined },
  { id: "3", name: "Emma Williams", email: "emma@startupx.co", phone: "+1 555-0103", dealStage: "proposal_sent", revenue: 0, notes: "Fast decision maker", avatar: undefined },
  { id: "4", name: "David Brown", email: "david@agencypro.net", phone: "+1 555-0104", dealStage: "lead", revenue: 0, notes: "Referred by TechCorp", avatar: undefined },
  { id: "5", name: "Lisa Anderson", email: "lisa@mediagroup.com", phone: "+1 555-0105", dealStage: "won", revenue: 8500, notes: "Monthly retainer client", avatar: undefined },
];

const initialProjects: Project[] = [
  { id: "1", title: "Website Redesign", clientId: "1", clientName: "Sarah Johnson", deadline: new Date(Date.now() + 86400000 * 7).toISOString(), revenue: 2500, notes: "Focus on mobile experience", column: "in_progress" },
  { id: "2", title: "Logo Design", clientId: "5", clientName: "Lisa Anderson", deadline: new Date(Date.now() + 86400000 * 3).toISOString(), revenue: 500, notes: "Need 3 concepts", column: "waiting" },
  { id: "3", title: "Admin Dashboard", clientId: "1", clientName: "Sarah Johnson", deadline: new Date(Date.now() + 86400000 * 14).toISOString(), revenue: 3200, notes: "React with TypeScript", column: "todo" },
  { id: "4", title: "Brand Guidelines", clientId: "5", clientName: "Lisa Anderson", deadline: new Date(Date.now() + 86400000 * 2).toISOString(), revenue: 800, notes: "Include color palette and typography", column: "revisions" },
  { id: "5", title: "Mobile App UI", clientId: "3", clientName: "Emma Williams", deadline: new Date(Date.now() + 86400000 * 10).toISOString(), revenue: 4500, notes: "iOS and Android designs", column: "todo" },
  { id: "6", title: "SEO Optimization", clientId: "1", clientName: "Sarah Johnson", deadline: new Date(Date.now() - 86400000 * 2).toISOString(), revenue: 1200, notes: "Technical and content SEO", column: "completed" },
];

const initialDevelopers: Developer[] = [
  { id: "1", name: "Alex Rivera", role: "Full Stack Developer", hourlyRate: 85, profileLink: "https://github.com/alexr", notes: "Expert in React and Node.js", availability: "available", avatar: 0 },
  { id: "2", name: "Jordan Kim", role: "UI/UX Designer", hourlyRate: 75, profileLink: "https://dribbble.com/jordank", notes: "Figma specialist", availability: "busy", avatar: 1 },
  { id: "3", name: "Taylor Smith", role: "Backend Developer", hourlyRate: 90, profileLink: "https://github.com/taylors", notes: "Python and Go expert", availability: "available", avatar: 2 },
  { id: "4", name: "Morgan Lee", role: "Mobile Developer", hourlyRate: 80, profileLink: "https://github.com/morganl", notes: "React Native and Flutter", availability: "unavailable", avatar: 0 },
];

const initialSnippets: Snippet[] = [
  { id: "1", title: "Professional Introduction", content: "Hello! I'm a seasoned freelancer with 5+ years of experience in delivering high-quality solutions. I've carefully reviewed your project requirements and I'm confident I can help you achieve your goals.", category: "intros" },
  { id: "2", title: "Friendly Opener", content: "Hi there! Your project caught my attention immediately. I love working on projects like this and would be thrilled to bring my expertise to help make your vision a reality.", category: "intros" },
  { id: "3", title: "Gentle Follow-up", content: "Hi! I wanted to follow up on my proposal. I'm still very interested in your project and would love to discuss how I can help. Please let me know if you have any questions.", category: "follow_ups" },
  { id: "4", title: "Milestone Reminder", content: "Just a friendly reminder that the current milestone is approaching its deadline. Please review the deliverables at your earliest convenience so we can proceed smoothly.", category: "follow_ups" },
  { id: "5", title: "Project Delivery", content: "Great news! I've completed the deliverables as discussed. All files are ready for your review. Please take a look and let me know if any adjustments are needed.", category: "delivery" },
  { id: "6", title: "Portfolio Link", content: "You can view my complete portfolio at [portfolio-link]. It showcases similar projects I've completed, demonstrating my expertise in this area.", category: "portfolio" },
  { id: "7", title: "Quick Availability", content: "Yes, I'm available to start immediately and can dedicate full attention to your project.", category: "quick_replies" },
  { id: "8", title: "Rate Explanation", content: "My rate reflects my experience and the quality of work I deliver. I'm always open to discussing project-based pricing if that works better for your budget.", category: "quick_replies" },
];

const initialTemplates: ProposalTemplate[] = [
  { id: "1", category: "design", name: "UI/UX Design", template: "I'm excited to help with your design project. With my background in creating intuitive user interfaces and engaging user experiences, I can deliver designs that not only look great but also drive results. My approach includes: comprehensive research, wireframing, prototyping, and final high-fidelity designs. Let's create something beautiful together!" },
  { id: "2", category: "admin", name: "Virtual Assistant", template: "I understand you need reliable administrative support. As an experienced virtual assistant, I can help manage your calendar, handle correspondence, organize documents, and streamline your daily operations. I'm detail-oriented, proactive, and committed to making your workload lighter. Let me handle the admin so you can focus on growth." },
  { id: "3", category: "real_estate", name: "Real Estate Support", template: "I specialize in supporting real estate professionals with lead generation, CRM management, listing coordination, and marketing materials. My experience in the real estate industry means I understand your unique needs and can hit the ground running. Let's close more deals together!" },
  { id: "4", category: "bpo", name: "Business Process Outsourcing", template: "Looking to optimize your business operations? I offer comprehensive BPO services including data entry, customer support, bookkeeping, and process automation. My focus is on accuracy, efficiency, and clear communication. Let me help you scale your operations cost-effectively." },
  { id: "5", category: "tutoring", name: "Online Tutoring", template: "Education is my passion! As an experienced tutor, I create personalized learning plans that adapt to each student's pace and style. Whether it's academic subjects, test prep, or skill development, I'm here to help achieve learning goals with patience and expertise." },
];

const initialExpenses: Expense[] = [
  { id: "1", amount: 99, category: "software", date: new Date().toISOString(), description: "Design software subscription" },
  { id: "2", projectTitle: "Website Redesign", amount: 300, category: "outsourcing", date: new Date().toISOString(), description: "Freelancer for CSS optimization" },
  { id: "3", amount: 50, category: "tools", date: new Date(Date.now() - 86400000 * 5).toISOString(), description: "Project management tool" },
];

export const useDataStore = create<DataStore>((set) => ({
  bids: initialBids,
  clients: initialClients,
  projects: initialProjects,
  developers: initialDevelopers,
  snippets: initialSnippets,
  templates: initialTemplates,
  expenses: initialExpenses,
  userProfile: { name: "Freelancer", avatarIndex: 0 },

  addBid: (bid) => set((state) => ({
    bids: [...state.bids, { ...bid, id: generateId() }],
  })),

  addClient: (client) => set((state) => ({
    clients: [...state.clients, { ...client, id: generateId() }],
  })),

  updateClient: (id, updates) => set((state) => ({
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })),

  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id),
  })),

  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: generateId() }],
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),

  moveProject: (id, column) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? { ...p, column } : p)),
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
  })),

  addDeveloper: (developer) => set((state) => ({
    developers: [...state.developers, { ...developer, id: generateId() }],
  })),

  updateDeveloper: (id, updates) => set((state) => ({
    developers: state.developers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
  })),

  deleteDeveloper: (id) => set((state) => ({
    developers: state.developers.filter((d) => d.id !== id),
  })),

  addSnippet: (snippet) => set((state) => ({
    snippets: [...state.snippets, { ...snippet, id: generateId() }],
  })),

  updateSnippet: (id, updates) => set((state) => ({
    snippets: state.snippets.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  })),

  deleteSnippet: (id) => set((state) => ({
    snippets: state.snippets.filter((s) => s.id !== id),
  })),

  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, { ...expense, id: generateId() }],
  })),

  updateExpense: (id, updates) => set((state) => ({
    expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
  })),

  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id),
  })),

  updateUserProfile: (profile) => set((state) => ({
    userProfile: { ...state.userProfile, ...profile },
  })),
}));

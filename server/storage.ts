import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject,
  type Conversation,
  type InsertConversation,
  type DesignInput,
  type InsertDesignInput
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  
  getConversation(projectId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(projectId: string, messages: any[]): Promise<Conversation>;
  
  createDesignInput(input: InsertDesignInput): Promise<DesignInput>;
  getDesignInputsByProject(projectId: string): Promise<DesignInput[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private conversations: Map<string, Conversation>;
  private designInputs: Map<string, DesignInput>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.conversations = new Map();
    this.designInputs = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample project
    const sampleProject: Project = {
      id: "sample-project-1",
      name: "E-commerce App",
      description: "A modern e-commerce application with React and Tailwind CSS",
      framework: "Next.js + Tailwind",
      progress: "78",
      userId: null,
      codebase: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.projects.set(sampleProject.id, sampleProject);

    // Create sample conversation
    const sampleConversation: Conversation = {
      id: randomUUID(),
      projectId: sampleProject.id,
      messages: [
        {
          role: 'assistant',
          content: "I've analyzed your existing codebase. I see you want to update the header navigation. I have a few questions to better understand your requirements:\n\n1. Search Functionality: Should the search include autocomplete suggestions?\n2. User Avatar: What options should appear in the dropdown menu?",
          timestamp: new Date(Date.now() - 300000),
        },
        {
          role: 'user',
          content: "Yes, include autocomplete for search. For the avatar dropdown, add Profile, Settings, and Logout options.",
          timestamp: new Date(Date.now() - 180000),
        },
        {
          role: 'assistant',
          content: "Perfect! I'll generate the updated header component with search autocomplete and user dropdown. Here's a preview of the changes I'll make to your Header.tsx component.",
          timestamp: new Date(Date.now() - 60000),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.conversations.set(sampleProject.id, sampleConversation);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      description: insertProject.description || null,
      framework: insertProject.framework || "Next.js + Tailwind",
      progress: insertProject.progress || "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) {
      return undefined;
    }
    
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getConversation(projectId: string): Promise<Conversation | undefined> {
    return this.conversations.get(projectId);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      projectId: insertConversation.projectId || null,
      messages: insertConversation.messages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(insertConversation.projectId!, conversation);
    return conversation;
  }

  async updateConversation(projectId: string, messages: any[]): Promise<Conversation> {
    let conversation = this.conversations.get(projectId);
    
    if (!conversation) {
      conversation = await this.createConversation({
        projectId,
        messages,
      });
    } else {
      conversation = {
        ...conversation,
        messages,
        updatedAt: new Date(),
      };
      this.conversations.set(projectId, conversation);
    }
    
    return conversation;
  }

  async createDesignInput(insertInput: InsertDesignInput): Promise<DesignInput> {
    const id = randomUUID();
    const designInput: DesignInput = {
      ...insertInput,
      id,
      projectId: insertInput.projectId || null,
      figmaLink: insertInput.figmaLink || null,
      screenshots: insertInput.screenshots || [],
      targetComponents: insertInput.targetComponents || [],
      createdAt: new Date(),
    };
    this.designInputs.set(id, designInput);
    return designInput;
  }

  async getDesignInputsByProject(projectId: string): Promise<DesignInput[]> {
    return Array.from(this.designInputs.values()).filter(
      input => input.projectId === projectId
    );
  }
}

export const storage = new MemStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { 
  analyzeCodebase, 
  generateCode, 
  chatWithAI, 
  analyzeDesignImage,
  type ChatMessage,
  type CodeGenerationRequest 
} from "./services/openai";
import { insertProjectSchema, insertDesignInputSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create project" });
      }
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Update project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Analyze codebase
  app.post("/api/analyze-codebase", async (req, res) => {
    try {
      const { codebase } = req.body;
      if (!codebase) {
        return res.status(400).json({ message: "Codebase is required" });
      }
      
      const analysis = await analyzeCodebase(codebase);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Generate code
  app.post("/api/generate-code", async (req, res) => {
    try {
      const request: CodeGenerationRequest = req.body;
      
      if (!request.description || !request.targetComponents || request.targetComponents.length === 0) {
        return res.status(400).json({ message: "Description and target components are required" });
      }

      const result = await generateCode(request);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Chat with AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context, projectId } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }

      const response = await chatWithAI(messages, context);
      
      // Save conversation if projectId is provided
      if (projectId) {
        const updatedMessages = [...messages, { role: 'assistant', content: response, timestamp: new Date() }];
        await storage.updateConversation(projectId, updatedMessages);
      }

      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Upload and analyze design images
  app.post("/api/upload-design", upload.array('screenshots', 5), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "At least one image file is required" });
      }

      const analyses: string[] = [];
      const base64Images: string[] = [];

      for (const file of files) {
        const base64Image = file.buffer.toString('base64');
        base64Images.push(base64Image);
        
        const analysis = await analyzeDesignImage(base64Image);
        analyses.push(analysis);
      }

      res.json({ 
        analyses,
        base64Images,
        message: `Successfully analyzed ${files.length} design image(s)` 
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Create design input
  app.post("/api/design-inputs", async (req, res) => {
    try {
      const inputData = insertDesignInputSchema.parse(req.body);
      const designInput = await storage.createDesignInput(inputData);
      res.json(designInput);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid design input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create design input" });
      }
    }
  });

  // Get conversation for project
  app.get("/api/conversations/:projectId", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.projectId);
      res.json(conversation || { messages: [] });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

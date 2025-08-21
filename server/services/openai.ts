import OpenAI from "openai";

// Using GPT-4o mini for cost-effective component analysis and code generation
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ComponentAnalysis {
  components: string[];
  framework: string;
  suggestions: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CodeGenerationRequest {
  description: string;
  figmaLink?: string;
  screenshots?: string[];
  targetComponents: string[];
  existingCode?: string;
}

export interface CodeGenerationResponse {
  updatedCode: string;
  explanation: string;
  questions?: string[];
  dependencies?: string[];
}

export async function analyzeCodebase(codebase: string): Promise<ComponentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a React/Next.js code analysis expert. Analyze the provided codebase and extract information about components, framework, and provide suggestions for improvements. Respond with JSON in this format: { 'components': string[], 'framework': string, 'suggestions': string[] }",
        },
        {
          role: "user",
          content: `Analyze this codebase:\n\n${codebase}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      components: result.components || [],
      framework: result.framework || "Unknown",
      suggestions: result.suggestions || [],
    };
  } catch (error) {
    throw new Error("Failed to analyze codebase: " + (error as Error).message);
  }
}

export async function generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
  try {
    let messages: any[] = [
      {
        role: "system",
        content: "You are an expert React/Next.js developer. Generate clean, production-ready code based on user requirements. Always preserve existing functionality while implementing requested changes. Respond with JSON in this format: { 'updatedCode': string, 'explanation': string, 'questions': string[], 'dependencies': string[] }",
      }
    ];

    let userContent = `Generate updated React components based on this request:

Description: ${request.description}
Target Components: ${request.targetComponents.join(', ')}
`;

    if (request.figmaLink) {
      userContent += `\nFigma Link: ${request.figmaLink}`;
    }

    if (request.existingCode) {
      userContent += `\nExisting Code:\n${request.existingCode}`;
    }

    messages.push({
      role: "user",
      content: userContent,
    });

    // If screenshots are provided, add them to the conversation
    if (request.screenshots && request.screenshots.length > 0) {
      for (const screenshot of request.screenshots) {
        messages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: "Please also consider this design reference:"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${screenshot}`
              }
            }
          ],
        });
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      updatedCode: result.updatedCode || "",
      explanation: result.explanation || "",
      questions: result.questions || [],
      dependencies: result.dependencies || [],
    };
  } catch (error) {
    throw new Error("Failed to generate code: " + (error as Error).message);
  }
}

export async function chatWithAI(messages: ChatMessage[], context?: string): Promise<string> {
  try {
    const systemMessage = context 
      ? `You are a helpful AI assistant for WebCraft AI, a tool that helps users build websites with AI. Context: ${context}`
      : "You are a helpful AI assistant for WebCraft AI, a tool that helps users build websites with AI.";

    const openaiMessages = [
      { role: "system" as const, content: systemMessage },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Sorry, I couldn't process your request.";
  } catch (error) {
    throw new Error("Failed to chat with AI: " + (error as Error).message);
  }
}

export async function analyzeDesignImage(base64Image: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this design image and provide detailed description of the UI elements, layout, colors, typography, and any interactive components you can identify. Focus on aspects that would be useful for implementing this design in React/Next.js."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Could not analyze the image.";
  } catch (error) {
    throw new Error("Failed to analyze design image: " + (error as Error).message);
  }
}

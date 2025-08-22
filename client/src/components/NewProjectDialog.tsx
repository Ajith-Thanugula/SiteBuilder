import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const newProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  framework: z.string().min(1, "Framework is required"),
});

type NewProjectForm = z.infer<typeof newProjectSchema>;

interface NewProjectDialogProps {
  children: React.ReactNode;
}

export default function NewProjectDialog({ children }: NewProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [codebaseFile, setCodebaseFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<NewProjectForm>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      framework: "Next.js + Tailwind",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: NewProjectForm & { codebase?: string }) => {
      return apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setOpen(false);
      form.reset();
      setCodebaseFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error creating project",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleCodebaseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCodebaseFile(file);
    }
  };

  const onSubmit = async (data: NewProjectForm) => {
    let codebaseContent = "";
    
    if (codebaseFile) {
      try {
        if (codebaseFile.name.endsWith('.zip')) {
          // Use JSZip to extract real ZIP file contents
          const zip = new JSZip();
          const zipData = await codebaseFile.arrayBuffer();
          const zipContents = await zip.loadAsync(zipData);
          
          const files: Record<string, string> = {};
          const promises: Promise<void>[] = [];
          
          // Extract all files from the ZIP
          zipContents.forEach((relativePath, file) => {
            if (!file.dir) { // Only process files, not directories
              promises.push(
                file.async("text").then((content) => {
                  // Clean up the file path - specifically handle 'replit/' folder
                  let cleanPath = relativePath;
                  
                  // If file is inside 'replit/' folder, move it to root level
                  if (cleanPath.startsWith('replit/')) {
                    cleanPath = cleanPath.replace(/^replit\//, '');
                  }
                  
                  // Remove any other wrapper folders that might contain the main project
                  const pathParts = cleanPath.split('/');
                  if (pathParts.length > 1) {
                    // Check if this looks like an extracted project folder that should be flattened
                    const possibleProjectFolders = ['project', 'app', 'main', 'source'];
                    if (possibleProjectFolders.includes(pathParts[0].toLowerCase()) && pathParts.length > 2) {
                      // Remove the first folder level if it's likely a project wrapper folder
                      cleanPath = pathParts.slice(1).join('/');
                    }
                  }
                  
                  // Only add non-empty paths
                  if (cleanPath && cleanPath.trim()) {
                    files[cleanPath] = content;
                  }
                }).catch((error) => {
                  console.warn(`Failed to read file ${relativePath}:`, error);
                })
              );
            }
          });
          
          await Promise.all(promises);
          
          codebaseContent = JSON.stringify({
            type: 'zip',
            name: codebaseFile.name,
            size: codebaseFile.size,
            lastModified: codebaseFile.lastModified,
            files: files,
            fileCount: Object.keys(files).length
          });
          
          console.log('✅ Successfully extracted ZIP with', Object.keys(files).length, 'files');
          console.log('📁 Sample cleaned file paths:');
          Object.keys(files).slice(0, 15).forEach(path => {
            console.log('  -', path);
          });
          
          // Show root level files
          const rootFiles = Object.keys(files).filter(path => !path.includes('/'));
          console.log('📄 Root level files:', rootFiles);
          
        } else {
          // For text files, read the actual content
          codebaseContent = await codebaseFile.text();
        }
        
        console.log('Uploading project with codebase:', { 
          name: data.name, 
          fileName: codebaseFile.name, 
          fileSize: codebaseFile.size,
          codebaseLength: codebaseContent.length 
        });
        
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "File upload error",
          description: `Failed to process ${codebaseFile.name}: ${(error as Error).message}`,
          variant: "destructive",
        });
        return;
      }
    }

    createProjectMutation.mutate({
      ...data,
      codebase: codebaseContent || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="My React App" 
                      {...field} 
                      data-testid="input-project-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of your project..." 
                      {...field} 
                      data-testid="textarea-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-framework">
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Next.js + Tailwind">Next.js + Tailwind</SelectItem>
                      <SelectItem value="React + Tailwind">React + Tailwind</SelectItem>
                      <SelectItem value="React Native">React Native</SelectItem>
                      <SelectItem value="Vite + React">Vite + React</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Upload Existing Codebase (Optional)
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer block">
                <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-sm text-gray-600">
                  {codebaseFile ? codebaseFile.name : "Drop codebase files here or click to upload"}
                </p>
                <p className="text-xs text-gray-500 mt-1">ZIP, TXT, or individual files</p>
                <input
                  type="file"
                  accept=".zip,.txt,.js,.jsx,.ts,.tsx,.json"
                  onChange={handleCodebaseUpload}
                  className="hidden"
                  data-testid="input-codebase-upload"
                />
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createProjectMutation.isPending}
                data-testid="button-create-project"
              >
                {createProjectMutation.isPending ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
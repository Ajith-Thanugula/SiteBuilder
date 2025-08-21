import { useState } from "react";
import { Upload, Wand2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Component {
  id: string;
  name: string;
  checked: boolean;
}

export default function DesignInput() {
  const [description, setDescription] = useState("");
  const [figmaLink, setFigmaLink] = useState("");
  const [components, setComponents] = useState<Component[]>([
    { id: "header", name: "Header.tsx", checked: true },
    { id: "navigation", name: "Navigation.tsx", checked: false },
    { id: "searchbar", name: "SearchBar.tsx", checked: false },
  ]);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/upload-design", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload successful",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/generate-code", data);
    },
    onSuccess: () => {
      toast({
        title: "Preview generated",
        description: "Check the AI chat for the generated code",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("screenshots", file);
    });

    uploadMutation.mutate(formData);
  };

  const handleComponentToggle = (componentId: string) => {
    setComponents(prev =>
      prev.map(comp =>
        comp.id === componentId ? { ...comp, checked: !comp.checked } : comp
      )
    );
  };

  const handleSelectAll = () => {
    const allChecked = components.every(comp => comp.checked);
    setComponents(prev =>
      prev.map(comp => ({ ...comp, checked: !allChecked }))
    );
  };

  const handleGeneratePreview = () => {
    const selectedComponents = components.filter(comp => comp.checked).map(comp => comp.name);
    
    if (!description) {
      toast({
        title: "Description required",
        description: "Please provide a project description",
        variant: "destructive",
      });
      return;
    }

    if (selectedComponents.length === 0) {
      toast({
        title: "Components required",
        description: "Please select at least one component to modify",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      description,
      figmaLink: figmaLink || undefined,
      targetComponents: selectedComponents,
    });
  };

  return (
    <>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Describe Your Changes</h2>
        <p className="text-sm text-gray-600">Tell us what you want to modify, add, or improve in your application.</p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Description Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Description
          </label>
          <Textarea
            className="w-full h-32 resize-none"
            placeholder="I want to update the header navigation to include a search bar and user avatar dropdown. The search should be prominently displayed in the center..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid="textarea-description"
          />
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Resources
          </label>
          <div className="space-y-3">
            {/* Figma Link */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Figma Design Link
              </label>
              <Input
                type="url"
                placeholder="https://figma.com/file/..."
                value={figmaLink}
                onChange={(e) => setFigmaLink(e.target.value)}
                data-testid="input-figma-link"
              />
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Screenshots/References
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer block">
                <Upload className="mx-auto mb-2 text-2xl text-gray-400" size={32} />
                <p className="text-sm text-gray-600">Drop screenshots here or click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-file-upload"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Component Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Components
          </label>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Select components to modify:
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs text-primary hover:text-blue-700"
                data-testid="button-select-all"
              >
                Select All
              </Button>
            </div>
            <div className="space-y-2">
              {components.map((component) => (
                <label
                  key={component.id}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <Checkbox
                    checked={component.checked}
                    onCheckedChange={() => handleComponentToggle(component.id)}
                    data-testid={`checkbox-component-${component.id}`}
                  />
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-file-code text-gray-400"></i>
                    <span className="text-sm text-gray-700">{component.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            className="flex-1 bg-primary text-white hover:bg-blue-700 transition-colors"
            onClick={handleGeneratePreview}
            disabled={generateMutation.isPending}
            data-testid="button-generate-preview"
          >
            <Wand2 className="mr-2" size={16} />
            <span>{generateMutation.isPending ? "Generating..." : "Generate Preview"}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            data-testid="button-save"
          >
            <Save size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}

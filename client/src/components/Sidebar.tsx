import { useState } from "react";
import { Plus, Check, FileCode2, Smartphone, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewProjectDialog from "@/components/NewProjectDialog";
import type { Project } from "@shared/schema";

export default function Sidebar() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  
  // Initialize current project when projects load
  const effectiveCurrentProjectId = currentProjectId || projects[0]?.id || "";
  const currentProject = projects.find(p => p.id === effectiveCurrentProjectId) || projects[0];
  
  // Update current project ID when projects change
  if (!currentProjectId && projects.length > 0) {
    setCurrentProjectId(projects[0].id);
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <NewProjectDialog>
          <Button 
            className="w-full bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            data-testid="button-new-project"
          >
            <Plus size={16} />
            <span>New Project</span>
          </Button>
        </NewProjectDialog>
      </div>
      
      <div className="flex-1 px-6">
        {projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Projects</h3>
            
            {projects.length > 1 && (
              <div className="mb-3">
                <Select value={effectiveCurrentProjectId} onValueChange={setCurrentProjectId}>
                  <SelectTrigger className="w-full" data-testid="select-current-project">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentProject && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <i className="fas fa-react text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900" data-testid="text-project-name">
                      {currentProject.name}
                    </h4>
                    <p className="text-sm text-gray-500" data-testid="text-project-framework">
                      {currentProject.framework}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium" data-testid="text-project-progress">
                      {currentProject.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${currentProject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Workflow Steps</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
              <span className="text-sm text-green-800">Upload Codebase</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              <span className="text-sm text-blue-800">Design Input</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">3</div>
              <span className="text-sm text-gray-600">AI Analysis</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">4</div>
              <span className="text-sm text-gray-600">Code Generation</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">5</div>
              <span className="text-sm text-gray-600">Review & Apply</span>
            </div>
          </div>
        </div>

        {projects.length > 1 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">All Projects</h3>
            <div className="space-y-2">
              {projects.slice(0, 3).map((project) => (
                <div 
                  key={project.id}
                  onClick={() => setCurrentProjectId(project.id)}
                  className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    project.id === effectiveCurrentProjectId ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'hover:bg-gray-50'
                  }`}
                  data-testid={`project-item-${project.id}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    project.framework.includes('React Native') ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {project.framework.includes('React Native') ? (
                      <Smartphone size={16} className="text-accent" />
                    ) : (
                      <FileCode2 size={16} className="text-secondary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                    <p className="text-xs text-gray-500">{project.framework}</p>
                  </div>
                  {project.id === effectiveCurrentProjectId && (
                    <Check size={14} className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

import { Plus, Check, FileCode2, Smartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

export default function Sidebar() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const currentProject = projects[0]; // Use first project as current

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Button 
          className="w-full bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          data-testid="button-new-project"
        >
          <Plus size={16} />
          <span>New Project</span>
        </Button>
      </div>
      
      <div className="flex-1 px-6">
        {currentProject && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Current Project</h3>
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

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Projects</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileCode2 size={16} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Portfolio Site</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Smartphone size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mobile App</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

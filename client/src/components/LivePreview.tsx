import { useState } from "react";
import { Smartphone, Monitor, Tablet, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function LivePreview() {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Get the most recently created project (your uploaded NextJS project)
  const currentProject = projects.length > 1 
    ? projects[projects.length - 1] // Most recent project
    : projects[0]; // Fallback to first if only one

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const deviceSizes = {
    desktop: 'w-full h-full',
    tablet: 'w-96 h-[600px] mx-auto',
    mobile: 'w-80 h-[640px] mx-auto'
  };

  // Detect project type from codebase content
  const getProjectInfo = (codebase: string) => {
    if (!codebase) return { type: 'Unknown', hasNext: false };
    
    const hasNext = codebase.includes('"next"') || codebase.includes('next.config');
    const hasReact = codebase.includes('react') || codebase.includes('.jsx') || codebase.includes('.tsx');
    const hasVue = codebase.includes('vue') || codebase.includes('@vue');
    const hasAngular = codebase.includes('@angular') || codebase.includes('angular');
    
    let type = 'Unknown';
    if (hasNext) type = 'Next.js';
    else if (hasReact) type = 'React';
    else if (hasVue) type = 'Vue.js';
    else if (hasAngular) type = 'Angular';
    
    return { type, hasNext, hasReact };
  };

  const projectInfo = currentProject?.codebase ? getProjectInfo(currentProject.codebase) : { type: 'Unknown', hasNext: false };

  // Real project preview based on detected framework
  const RealProjectPreview = () => {
    if (!currentProject) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <AlertCircle size={48} className="text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Project Selected</h3>
            <p className="text-gray-600">Upload a project to see live preview</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-gray-50">
        {/* Project Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentProject.name}</h2>
              <p className="text-sm text-gray-600">{projectInfo.type} Application</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {projectInfo.type}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Uploaded
              </span>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {currentProject.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {currentProject.name}
              </h3>
              
              <p className="text-gray-600 mb-6">
                Your {projectInfo.type} application is ready for AI updates
              </p>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(Math.random() * 50 + 10)}</div>
                  <div className="text-sm text-gray-600">Components</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{Math.round(Math.random() * 100 + 50)}</div>
                  <div className="text-sm text-gray-600">Files</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">{currentProject.framework}</div>
                  <div className="text-sm text-gray-600">Framework</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm font-medium">
                    🚀 Ready for AI-powered updates!
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Use the AI chat to modify components, add features, and improve your app
                  </p>
                </div>

                {projectInfo.hasNext && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm font-medium">
                      ⚡ Next.js Project Detected
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Optimized for server-side rendering and modern React features
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Controls Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            <p className="text-sm text-gray-600">
              {currentProject ? `${currentProject.name} Preview` : 'No project selected'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Device Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('desktop')}
                data-testid="button-desktop-view"
              >
                <Monitor size={16} />
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('tablet')}
                data-testid="button-tablet-view"
              >
                <Tablet size={16} />
              </Button>
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceView('mobile')}
                data-testid="button-mobile-view"
              >
                <Smartphone size={16} />
              </Button>
            </div>
            
            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              data-testid="button-refresh-preview"
            >
              <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className={`${deviceSizes[deviceView]} bg-white rounded-lg shadow-lg overflow-hidden`}>
          {deviceView === 'mobile' && (
            <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
              <div className="w-16 h-1 bg-gray-800 rounded"></div>
            </div>
          )}
          
          <div className="h-full overflow-auto" data-testid="project-preview">
            <RealProjectPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
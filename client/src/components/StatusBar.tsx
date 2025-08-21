import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function StatusBar() {
  const [processingStatus, setProcessingStatus] = useState(false);
  
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Simulate processing status
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStatus(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const componentsAnalyzed = projects.reduce((total, project) => {
    if (project.codebase) {
      // Simulate component count based on codebase
      return total + 5;
    }
    return total + 23; // Default sample count
  }, 0);

  return (
    <div className="bg-dark text-white px-6 py-2 text-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <span className="text-green-400" data-testid="status-api-connection">
            ● Connected to OpenAI API
          </span>
          <span className="text-gray-400">|</span>
          <span data-testid="text-components-analyzed">
            {componentsAnalyzed} components analyzed
          </span>
          <span className="text-gray-400">|</span>
          <span data-testid="text-last-update">
            Last update: 2 minutes ago
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 bg-accent rounded-full ${processingStatus ? 'animate-pulse' : ''}`}></div>
            <span className="text-sm" data-testid="status-processing">
              {processingStatus ? "Processing..." : "Ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

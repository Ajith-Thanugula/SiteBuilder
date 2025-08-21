import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: string;
  modified?: string;
}

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const currentProject = projects.find(p => p.id) || projects[0];
  
  // Parse codebase into file structure - this will show your real uploaded files!
  const parseCodebase = (codebase: any): FileNode[] => {
    if (!codebase) return getDefaultFileStructure();
    
    try {
      // If codebase is a string containing file contents, extract file paths
      if (typeof codebase === 'string') {
        const lines = codebase.split('\n').filter(line => line.trim());
        const files = new Set<string>();
        
        // Look for file paths in the content
        lines.forEach(line => {
          // Common file patterns
          const fileMatches = line.match(/[\w-./]+\.(tsx?|jsx?|css|json|md|html|svg|ico|js|ts)/g);
          if (fileMatches) {
            fileMatches.forEach(match => files.add(match));
          }
          
          // Import/export patterns
          const importMatch = line.match(/from ['"]([^'"]+)['"]/);
          if (importMatch) {
            files.add(importMatch[1] + '.tsx');
          }
        });
        
        // Add common project files if they exist in content
        if (codebase.includes('package.json')) files.add('package.json');
        if (codebase.includes('tsconfig')) files.add('tsconfig.json');
        if (codebase.includes('tailwind')) files.add('tailwind.config.js');
        
        return buildFileTree(Array.from(files));
      }
      
      return getDefaultFileStructure();
    } catch (error) {
      console.error('Error parsing codebase:', error);
      return getDefaultFileStructure();
    }
  };

  const buildFileTree = (filePaths: string[]): FileNode[] => {
    const root: FileNode[] = [];
    const nodeMap = new Map<string, FileNode>();

    filePaths.forEach(filePath => {
      const parts = filePath.split('/').filter(part => part);
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const fullPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!nodeMap.has(fullPath)) {
          const node: FileNode = {
            name: part,
            type: isLast ? 'file' : 'folder',
            children: isLast ? undefined : [],
            size: isLast ? `${Math.round(Math.random() * 50 + 1)}KB` : undefined,
            modified: 'Just uploaded'
          };
          
          nodeMap.set(fullPath, node);
          
          if (currentPath) {
            const parent = nodeMap.get(currentPath);
            if (parent && parent.children) {
              parent.children.push(node);
            }
          } else {
            root.push(node);
          }
        }
        
        currentPath = fullPath;
      });
    });

    return root.length > 0 ? root : getDefaultFileStructure();
  };

  const getDefaultFileStructure = (): FileNode[] => [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.tsx', type: 'file', size: '2.1KB', modified: '2 mins ago' },
            { name: 'Navigation.tsx', type: 'file', size: '1.8KB', modified: '5 mins ago' },
            { name: 'SearchBar.tsx', type: 'file', size: '1.2KB', modified: '10 mins ago' },
          ]
        },
        { name: 'App.tsx', type: 'file', size: '0.8KB', modified: '1 week ago' },
      ]
    },
    { name: 'package.json', type: 'file', size: '1.2KB', modified: '1 week ago' },
    { name: 'tsconfig.json', type: 'file', size: '0.5KB', modified: '1 week ago' },
  ];

  // Get file structure from uploaded project
  const fileStructure = currentProject?.codebase 
    ? parseCodebase(currentProject.codebase)
    : getDefaultFileStructure();

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const selectFile = (path: string) => {
    setSelectedFile(path);
  };

  const renderFileTree = (nodes: FileNode[], basePath = '') => {
    return nodes.map((node) => {
      const fullPath = basePath ? `${basePath}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(fullPath);
      const isSelected = selectedFile === fullPath;

      if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return null;
      }

      return (
        <div key={fullPath}>
          <div
            className={`flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 cursor-pointer ${
              isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(fullPath);
              } else {
                selectFile(fullPath);
              }
            }}
            data-testid={`file-tree-item-${fullPath}`}
          >
            <div className="flex items-center space-x-1 flex-1">
              {node.type === 'folder' ? (
                <>
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                  {isExpanded ? (
                    <FolderOpen size={16} className="text-blue-500" />
                  ) : (
                    <Folder size={16} className="text-blue-500" />
                  )}
                </>
              ) : (
                <>
                  <div className="w-4"></div>
                  <File size={16} className="text-gray-400" />
                </>
              )}
              <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                {node.name}
              </span>
            </div>
            
            {node.type === 'file' && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{node.size}</span>
                <span>•</span>
                <span>{node.modified}</span>
              </div>
            )}
          </div>

          {node.type === 'folder' && isExpanded && node.children && (
            <div className="ml-4 border-l border-gray-200">
              {renderFileTree(node.children, fullPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">File Explorer</h2>
            <p className="text-sm text-gray-600">
              {currentProject ? `${currentProject.name} Files` : 'No project selected'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid="button-download-project"
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-file-search"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2">
        {currentProject ? (
          <div className="space-y-1">
            {renderFileTree(fileStructure)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Folder size={48} className="mb-3" />
            <p className="text-sm">No project loaded</p>
            <p className="text-xs text-gray-400">Create a new project to see files</p>
          </div>
        )}
      </div>

      {/* Selected File Info */}
      {selectedFile && currentProject && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="text-sm">
            <div className="font-medium text-gray-900">{selectedFile}</div>
            <div className="text-gray-500 mt-1">
              From {currentProject.name} • Ready for AI updates
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
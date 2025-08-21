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
  content?: string;
}

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components']));
  const [selectedFile, setSelectedFile] = useState<string | null>('src/components/Header.tsx');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Sample file structure - in real app this would come from uploaded codebase
  const sampleFileStructure: FileNode[] = [
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
            { name: 'UserMenu.tsx', type: 'file', size: '0.9KB', modified: '15 mins ago' },
          ]
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            { name: 'index.tsx', type: 'file', size: '1.5KB', modified: '1 hour ago' },
            { name: 'dashboard.tsx', type: 'file', size: '3.2KB', modified: '2 hours ago' },
            { name: 'profile.tsx', type: 'file', size: '2.8KB', modified: '1 day ago' },
          ]
        },
        {
          name: 'styles',
          type: 'folder',
          children: [
            { name: 'globals.css', type: 'file', size: '2.5KB', modified: '3 days ago' },
            { name: 'components.css', type: 'file', size: '1.9KB', modified: '2 days ago' },
          ]
        },
        { name: 'App.tsx', type: 'file', size: '0.8KB', modified: '1 week ago' },
        { name: 'main.tsx', type: 'file', size: '0.3KB', modified: '1 week ago' },
      ]
    },
    {
      name: 'public',
      type: 'folder',
      children: [
        { name: 'favicon.ico', type: 'file', size: '15KB', modified: '1 week ago' },
        { name: 'logo.svg', type: 'file', size: '2.3KB', modified: '1 week ago' },
      ]
    },
    { name: 'package.json', type: 'file', size: '1.2KB', modified: '1 week ago' },
    { name: 'tsconfig.json', type: 'file', size: '0.5KB', modified: '1 week ago' },
    { name: 'tailwind.config.js', type: 'file', size: '0.3KB', modified: '1 week ago' },
  ];

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

  const currentProject = projects[0];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">File Explorer</h2>
            <p className="text-sm text-gray-600">
              {currentProject ? `Browse ${currentProject.name} files` : 'No project selected'}
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
            {renderFileTree(sampleFileStructure)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Folder size={48} className="mb-3" />
            <p className="text-sm">No project loaded</p>
            <p className="text-xs text-gray-400">Create a new project to see files</p>
          </div>
        )}
      </div>

      {/* File Info */}
      {selectedFile && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="text-sm">
            <div className="font-medium text-gray-900">{selectedFile}</div>
            <div className="text-gray-500 mt-1">
              Ready for AI updates • Click "Generate Preview" to modify this file
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
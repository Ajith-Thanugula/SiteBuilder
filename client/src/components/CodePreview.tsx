import { useState } from "react";
import { Copy, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface CodePreviewProps {
  generatedCode?: string;
  fileName?: string;
}

export default function CodePreview({ generatedCode, fileName = "Component.tsx" }: CodePreviewProps) {
  const [activeFile, setActiveFile] = useState(fileName);
  const { toast } = useToast();

  const sampleCode = generatedCode || `import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">MyApp</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <img src="/avatar.jpg" alt="User" className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleCode);
    toast({
      title: "Code copied!",
      description: "Component code copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([sampleCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded!",
      description: `${activeFile} has been downloaded`,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Generated Code</h2>
            <p className="text-sm text-gray-600">Review and download your updated components</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              data-testid="button-copy-code"
            >
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              data-testid="button-download-code"
            >
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeFile} onValueChange={setActiveFile} className="h-full flex flex-col">
          <TabsList className="border-b border-gray-200 bg-gray-50 rounded-none justify-start">
            <TabsTrigger value="Component.tsx" className="px-4 py-2">
              Header.tsx
            </TabsTrigger>
            <TabsTrigger value="styles.css" className="px-4 py-2">
              styles.css
            </TabsTrigger>
            <TabsTrigger value="types.ts" className="px-4 py-2">
              types.ts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="Component.tsx" className="flex-1 m-0">
            <div className="h-full bg-gray-900 text-green-400 p-4 overflow-auto font-mono text-sm">
              <pre className="whitespace-pre-wrap" data-testid="code-content">
                {sampleCode}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="styles.css" className="flex-1 m-0">
            <div className="h-full bg-gray-900 text-green-400 p-4 overflow-auto font-mono text-sm">
              <pre className="whitespace-pre-wrap">
{`.header {
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
}

.search-container {
  flex: 1;
  max-width: 32rem;
  margin: 0 2rem;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}

.search-input:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  border-color: transparent;
}`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="types.ts" className="flex-1 m-0">
            <div className="h-full bg-gray-900 text-green-400 p-4 overflow-auto font-mono text-sm">
              <pre className="whitespace-pre-wrap">
{`export interface HeaderProps {
  user?: {
    name: string;
    avatar: string;
  };
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
}

export interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export interface UserMenuProps {
  user: {
    name: string;
    avatar: string;
  };
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
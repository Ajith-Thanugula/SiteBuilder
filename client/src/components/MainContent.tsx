import { useState } from "react";
import DesignInput from "@/components/DesignInput";
import AIChat from "@/components/AIChat";
import { Button } from "@/components/ui/button";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState<'design' | 'code' | 'preview' | 'files'>('design');

  const tabs = [
    { id: 'design' as const, label: 'Design Input' },
    { id: 'code' as const, label: 'Code Preview' },
    { id: 'preview' as const, label: 'Live Preview' },
    { id: 'files' as const, label: 'File Explorer' },
  ];

  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Left Panel - Input Section */}
            <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
              {activeTab === 'design' && <DesignInput />}
              {activeTab === 'code' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Code Preview</h2>
                  <p className="text-sm text-gray-600">Generated code will appear here.</p>
                </div>
              )}
              {activeTab === 'preview' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h2>
                  <p className="text-sm text-gray-600">Component preview will appear here.</p>
                </div>
              )}
              {activeTab === 'files' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">File Explorer</h2>
                  <p className="text-sm text-gray-600">Project files will appear here.</p>
                </div>
              )}
            </div>

            {/* Right Panel - AI Interaction */}
            <AIChat />
          </div>
        </div>
      </div>
    </main>
  );
}

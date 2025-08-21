import { useState } from "react";
import { Smartphone, Monitor, Tablet, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LivePreview() {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const deviceSizes = {
    desktop: 'w-full h-full',
    tablet: 'w-96 h-[600px] mx-auto',
    mobile: 'w-80 h-[640px] mx-auto'
  };

  // Sample component preview
  const ComponentPreview = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded"></div>
            <span className="ml-2 text-xl font-bold">MyApp</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V7a7 7 0 100-14 7 7 0 000 14v10z" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Controls Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            <p className="text-sm text-gray-600">See your component changes in real-time</p>
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
            
            <Button
              variant="outline"
              size="sm"
              data-testid="button-open-new-tab"
            >
              <ExternalLink size={16} className="mr-2" />
              Open
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className={`${deviceSizes[deviceView]} bg-white rounded-lg shadow-lg overflow-hidden`}>
          {deviceView === 'mobile' && (
            <div className="bg-black rounded-t-lg h-6 flex items-center justify-center">
              <div className="w-16 h-1 bg-gray-800 rounded"></div>
            </div>
          )}
          
          <div className="h-full overflow-auto" data-testid="component-preview">
            <ComponentPreview />
            
            {/* Sample page content */}
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to MyApp</h1>
                <p className="text-gray-600 mb-8">
                  This is a live preview of your updated header component. You can see how it looks 
                  and behaves in different screen sizes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Feature 1</h3>
                    <p className="text-gray-600 text-sm">Your updated component integrates seamlessly with existing content.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Feature 2</h3>
                    <p className="text-gray-600 text-sm">Responsive design works across all device sizes.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Feature 3</h3>
                    <p className="text-gray-600 text-sm">Modern styling matches your design requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
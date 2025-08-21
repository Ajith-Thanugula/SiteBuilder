import { Bell } from "lucide-react";

export default function TopNavigation() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-magic text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">WebCraft AI</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <a 
              href="#" 
              className="text-gray-700 hover:text-primary transition-colors"
              data-testid="nav-dashboard"
            >
              Dashboard
            </a>
            <a 
              href="#" 
              className="text-gray-700 hover:text-primary transition-colors"
              data-testid="nav-projects"
            >
              Projects
            </a>
            <a 
              href="#" 
              className="text-gray-700 hover:text-primary transition-colors"
              data-testid="nav-templates"
            >
              Templates
            </a>
            <a 
              href="#" 
              className="text-gray-700 hover:text-primary transition-colors"
              data-testid="nav-documentation"
            >
              Documentation
            </a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            data-testid="button-notifications"
          >
            <Bell size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
              alt="User profile" 
              className="w-8 h-8 rounded-full"
              data-testid="img-user-avatar"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

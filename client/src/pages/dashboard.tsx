import TopNavigation from "@/components/TopNavigation";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import StatusBar from "@/components/StatusBar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <TopNavigation />
      <div className="flex h-screen">
        <Sidebar />
        <MainContent />
      </div>
      <StatusBar />
    </div>
  );
}

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardTabs({ activeTab, setActiveTab }: DashboardTabsProps) {
  return (
    <div className="mb-5">
      <div className="bg-[#1A1A1A]/40 backdrop-blur-sm rounded-2xl p-2 border border-[#2A2A2A]/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] inline-flex">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative cursor-pointer ${
            activeTab === 'portfolio'
              ? 'text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
          }`}
        >
          YRT Portfolio
        </button>
        <button
          onClick={() => setActiveTab('distribute')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative cursor-pointer ${
            activeTab === 'distribute'
              ? 'text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
          }`}
        >
          Distribute Yield
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative cursor-pointer ${
            activeTab === 'activity'
              ? 'text-white'
              : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
          }`}
        >
          Activity History
        </button>
      </div>
    </div>
  );
}
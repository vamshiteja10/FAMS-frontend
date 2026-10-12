import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './pages/DashboardView';
import { ProfileLandView } from './pages/ProfileLandView';
import { CropManagementView } from './pages/CropManagementView';
import { RecordsMonitoringView } from './pages/RecordsMonitoringView';
import { ResourcesInfoView } from './pages/ResourcesInfoView';
import { AdminManagementView } from './pages/AdminManagementView';

export function App() {
  const [currentRole, setCurrentRole] = useState('ROLE_FARMER'); // ROLE_FARMER, ROLE_OFFICER, PUBLIC
  const [activeTab, setActiveTab] = useState('dashboard');

  const [activeFarmer] = useState({
    id: 1,
    username: 'farmer_ramesh',
    fullName: 'Ramesh Patel',
    email: 'ramesh.farmer@farmassist.in',
    phone: '9876543210',
    role: 'ROLE_FARMER'
  });

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'PUBLIC' && ['land', 'crops', 'records', 'admin'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
    if (newRole === 'ROLE_OFFICER' && activeTab === 'dashboard') {
      // keep on dashboard or allow officer tabs
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} currentRole={currentRole} />;
      case 'land':
        return <ProfileLandView currentRole={currentRole} activeFarmer={activeFarmer} />;
      case 'crops':
        return <CropManagementView activeFarmer={activeFarmer} setActiveTab={setActiveTab} />;
      case 'records':
        return <RecordsMonitoringView activeFarmer={activeFarmer} />;
      case 'resources':
        return <ResourcesInfoView />;
      case 'admin':
        return <AdminManagementView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} currentRole={currentRole} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
      />

      <div className="main-wrapper">
        <Navbar
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
          activeFarmer={activeFarmer}
        />

        <main className="page-content">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default App;

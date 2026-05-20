import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../shared/ui/components/Sidebar";
import Navbar from "../../../shared/ui/components/Navbar";
import DashboardHome from "./DashboardHome";
import JobListings from "../../jobs/pages/JobListings";
import UserResume from "../components/UserResume";
import UserSupport from "../components/UserSupport";
import UserCredits from "../components/UserCredits";
import ProfileModal from "../../profile/components/ProfileModal";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState();
  const [activeSection, setActiveSection] = useState('dashboard');
  const id = useParams();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);


  useEffect(() => {
    const findUserId = () => {
      setUserid(localStorage.getItem("userid"));
    };

    findUserId();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  const renderComponent = () => {
    switch(activeSection){
      case 'dashboard':
        return <DashboardHome />;
      case 'jobs':
        return <JobListings />;
      case 'applications':
        return <div className="p-6"><h1 className="text-2xl font-bold">Applications</h1><p>Applications page coming soon...</p></div>;
      case 'saved':
        return <div className="p-6"><h1 className="text-2xl font-bold">Saved Jobs</h1><p>Saved jobs page coming soon...</p></div>;
      case 'profile':
        return navigate(`/profile/${id.userid}`);
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Settings page coming soon...</p></div>;
      case 'resume':
        return <UserResume />;
      case 'support':
        return <UserSupport />;
      case 'credits':
        return <UserCredits />;
      default:
        return <DashboardHome />;
    }
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderComponent()}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default UserDashboard;
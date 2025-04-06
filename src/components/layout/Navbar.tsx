
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, MessageSquare, FileText, Upload, Home, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [active, setActive] = React.useState('dashboard');

  const NavItem = ({ 
    to, 
    icon: Icon, 
    label, 
    id 
  }: { 
    to: string; 
    icon: React.ElementType; 
    label: string; 
    id: string 
  }) => (
    <Link to={to} onClick={() => setActive(id)}>
      <Button 
        variant={active === id ? "default" : "ghost"} 
        className={cn(
          "flex items-center gap-2 w-full justify-start", 
          active === id ? "bg-primary text-primary-foreground" : ""
        )}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Button>
    </Link>
  );

  return (
    <nav className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="bg-primary rounded-md p-1">
          <TrendingUp className="text-primary-foreground h-6 w-6" />
        </div>
        <img src="/logo.png" alt="MarketMood Logo" className="h-8 w-auto" />
        <h1 className="text-xl font-bold">MarketMood</h1>
      </div>
      
      <div className="space-y-1">
        <NavItem to="/" icon={Home} label="Dashboard" id="dashboard" />
        <NavItem to="/sentiment" icon={Upload} label="Sentiment Analysis" id="sentiment" />
        <NavItem to="/fake-news" icon={FileText} label="Fake News Detection" id="fake-news" />
        <NavItem to="/chatbot" icon={MessageSquare} label="Market Assistant" id="chatbot" />
      </div>
    </nav>
  );
};

export default Navbar;

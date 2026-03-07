import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  Users, 
  Gavel, 
  ArrowRight, 
  ChevronRight, 
  BarChart3, 
  DollarSign, 
  LandPlot,
  Menu,
  X,
  Search,
  Filter,
  Info,
  Truck,
  Globe,
  FileSearch,
  Handshake,
  Sparkles,
  AlertTriangle,
  Headphones,
  Trophy,
  Sprout,
  Waves,
  Construction,
  Image,
  Video,
  PlayCircle,
  MessageSquare,
  Heart,
  Share2,
  TrendingDown,
  Activity,
  UserCircle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  FileText,
  History,
  Briefcase,
  ExternalLink,
  PieChart,
  Calculator,
  Zap,
  Layers,
  BarChart,
  ArrowUpRight,
  Target,
  Tag,
  Award,
  Store,
  AlertCircle,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
interface LandListing {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  size: number;
  type: 'agricultural' | 'hunting' | 'sporting' | 'horticulture' | 'fishing' | 'development';
  sector: string;
  risk_level: 'Low' | 'Medium' | 'High';
  project_stage: 'Seed' | 'Growth' | 'Mature';
  development_potential: 'Low' | 'Medium' | 'High';
  historical_yield?: number;
  image_url: string;
  roi_estimate: number;
  status: string;
  share_price: number;
  total_shares: number;
  match_score?: number;
  match_reason?: string;
}

interface Trade {
  id: number;
  user_id: number;
  user_name: string;
  listing_id: number;
  listing_title: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  created_at: string;
}

interface PortfolioItem {
  id: number;
  listing_id: number;
  title: string;
  quantity: number;
  share_price: number;
  image_url: string;
}

interface LeaderboardEntry {
  name: string;
  avatar_url: string;
  portfolio_value: number;
}

interface InvestorProfile {
  user_id: number;
  min_roi: number;
  max_risk: 'Low' | 'Medium' | 'High';
  min_historical_yield: number;
  preferred_sectors: string[];
  preferred_locations: string[];
  preferred_stages: string[];
  min_development_potential: 'Low' | 'Medium' | 'High';
  investment_history: string[];
}

interface LandownerProfile {
  user_id: number;
  total_acres: number;
  land_locations: string[];
  land_types: string[];
  ownership_documents_url: string;
}

interface FarmerProfile {
  user_id: number;
  specialization: string[];
  past_projects: string[];
  project_proposals: string[];
}

interface TakafulPool {
  id: number;
  name: string;
  description: string;
  risk_type: string;
  contribution_rate: number;
  total_fund: number;
  status: string;
}

interface TakafulContribution {
  id: number;
  user_id: number;
  pool_id: number;
  pool_name: string;
  risk_type: string;
  amount: number;
  created_at: string;
}

interface TakafulClaim {
  id: number;
  user_id: number;
  pool_id: number;
  pool_name: string;
  amount_requested: number;
  amount_approved: number;
  reason: string;
  status: string;
  evidence_url?: string;
  created_at: string;
}

interface SoilRecord {
  id: number;
  listing_id: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  recorded_at: string;
}

interface CropPlan {
  id: number;
  listing_id: number;
  crop_name: string;
  season: string;
  start_date: string;
  end_date: string;
  status: 'planned' | 'active' | 'completed';
  notes?: string;
}

interface WeatherForecast {
  date: string;
  temp: number;
  condition: string;
  humidity: number;
}

interface Brand {
  id: number;
  owner_id: number;
  name: string;
  logo_url: string;
  description: string;
  website: string;
  status: string;
  created_at: string;
}

interface BrandPartnership {
  id: number;
  brand_id: number;
  listing_id: number;
  status: string;
  brand_name?: string;
  brand_logo?: string;
  created_at: string;
}

interface LogisticsPartner {
  id: number;
  name: string;
  logo_url: string;
  description: string;
  service_type: string;
  coverage_area: string;
  status: string;
}

interface LogisticsPartnership {
  id: number;
  partner_id: number;
  listing_id: number;
  status: string;
  partner_name?: string;
  partner_logo?: string;
  service_type?: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'investor' | 'owner' | 'farmer';
  bio: string;
  avatar_url: string;
  verification_status: 'unverified' | 'pending' | 'verified';
  experience_years: number;
  profile?: InvestorProfile | LandownerProfile | FarmerProfile;
}

interface Post {
  id: number;
  author_id: number;
  author_name: string;
  author_avatar: string;
  author_role: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  created_at: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

interface Dispute {
  id: number;
  title: string;
  description: string;
  status: string;
  is_escalated: number;
  mediation_suggestions?: string;
  created_at: string;
  messages?: DisputeMessage[];
  documents?: DisputeDocument[];
}

interface DisputeMessage {
  id: number;
  sender_name: string;
  content: string;
  created_at: string;
}

interface DisputeDocument {
  id: number;
  name: string;
  url: string;
  created_at: string;
}

// Mock data for charts
const roiData = [
  { year: '2020', value: 4.2 },
  { year: '2021', value: 5.8 },
  { year: '2022', value: 7.1 },
  { year: '2023', value: 6.9 },
  { year: '2024', value: 8.5 },
  { year: '2025', value: 9.2 },
];

const landValueData = [
  { month: 'Jan', price: 4200 },
  { month: 'Feb', price: 4350 },
  { month: 'Mar', price: 4300 },
  { month: 'Apr', price: 4500 },
  { month: 'May', price: 4700 },
  { month: 'Jun', price: 4850 },
];

// Components
const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  currency, 
  setCurrency,
  currentUser,
  setCurrentUser
}: { 
  activeTab: string, 
  setActiveTab: (t: string) => void, 
  currency: string, 
  setCurrency: (c: any) => void,
  currentUser: User | null,
  setCurrentUser: (u: User | null) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const roles: ('investor' | 'owner' | 'farmer')[] = ['investor', 'owner', 'farmer'];

  const allNavGroups = [
    { 
      id: 'invest', 
      label: 'Invest', 
      roles: ['investor', 'owner'],
      items: [
        { id: 'marketplace', label: 'Marketplace', roles: ['investor', 'owner'] },
        { id: 'exchange', label: 'Live Exchange', roles: ['investor'] },
        { id: 'crowdfunding', label: 'Crowdfunding Concept', roles: ['investor'] },
        { id: 'takaful', label: 'Shariah Takaful', roles: ['investor', 'farmer'] }
      ]
    },
    { 
      id: 'portfolio_group', 
      label: 'Portfolio', 
      roles: ['investor', 'owner'],
      items: [
        { id: 'dashboard', label: 'Investor Dashboard', roles: ['investor'] },
        { id: 'land_management', label: 'Land Management', roles: ['owner'] },
        { id: 'analyzer', label: 'Investment Analyzer', roles: ['investor'] },
        { id: 'disputes', label: 'Disputes', roles: ['investor', 'owner', 'farmer'] }
      ]
    },
    { 
      id: 'network', 
      label: 'Network', 
      roles: ['investor', 'owner', 'farmer'],
      items: [
        { id: 'community', label: 'Community', roles: ['investor', 'owner', 'farmer'] },
        { id: 'farmer_tools', label: 'Farmer Dashboard', roles: ['farmer'] },
        { id: 'services', label: 'Services', roles: ['farmer', 'owner'] },
        { id: 'about', label: 'About Us', roles: ['investor', 'owner', 'farmer'] }
      ]
    },
    { id: 'profile', label: 'Profile', roles: ['investor', 'owner', 'farmer'] }
  ];

  const navGroups = allNavGroups
    .filter(group => !group.roles || (currentUser && group.roles.includes(currentUser.role)))
    .map(group => ({
      ...group,
      items: group.items?.filter(item => !item.roles || (currentUser && item.roles.includes(currentUser.role)))
    }))
    .filter(group => !group.items || group.items.length > 0);

  const isActive = (group: any) => {
    if (group.items) {
      return group.items.some((item: any) => item.id === activeTab);
    }
    return group.id === activeTab;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-ui-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group" 
              onClick={() => setActiveTab('home')}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center mr-2.5 shadow-md"
              >
                <LandPlot className="text-white w-5 h-5" />
              </motion.div>
              <span className="text-xl font-sans font-extrabold tracking-tight text-brand-950">stasso<span className="text-brand-600">land</span></span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center bg-ui-surface rounded-lg p-1 border border-ui-border mr-4">
              {(['USD', 'EUR', 'PKR'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "px-2 py-1 rounded text-[9px] font-bold transition-all",
                    currency === c ? "bg-white text-brand-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('home')}
              className={cn(
                "text-xs font-bold uppercase tracking-wider transition-all hover:text-brand-600 relative py-1",
                activeTab === 'home' ? "text-brand-600" : "text-slate-500"
              )}
            >
              Home
              {activeTab === 'home' && (
                <motion.div 
                  layoutId="navUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-600 rounded-full"
                />
              )}
            </button>

            {navGroups.map((group) => (
              <div 
                key={group.id} 
                className="relative"
                onMouseEnter={() => setHoveredItem(group.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => !group.items && setActiveTab(group.id)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider transition-all hover:text-brand-600 relative py-1 flex items-center gap-1",
                    isActive(group) ? "text-brand-600" : "text-slate-500"
                  )}
                >
                  {group.label}
                  {group.items && <ChevronRight className={cn("w-3 h-3 transition-transform", hoveredItem === group.id ? "rotate-90" : "")} />}
                  {isActive(group) && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-600 rounded-full"
                    />
                  )}
                </button>

                {group.items && (
                  <AnimatePresence>
                    {hoveredItem === group.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white border border-ui-border rounded-xl shadow-xl p-2 z-50"
                      >
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setHoveredItem(null);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors",
                              activeTab === item.id ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-ui-surface"
                            )}
                          >
                            {item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            
            <div className="h-6 w-px bg-ui-border mx-2" />
            
            <div className="relative">
              <button 
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 px-3 py-1.5 bg-ui-surface border border-ui-border rounded-lg hover:bg-white transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden border border-brand-200">
                  {currentUser?.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-4 h-4 text-brand-600" />
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-[9px] font-black text-brand-950 leading-none mb-0.5">{currentUser?.name || 'Guest'}</p>
                  <p className="text-[8px] font-bold text-brand-600 uppercase tracking-widest leading-none">{currentUser?.role || 'Select Role'}</p>
                </div>
                <ChevronRight className={cn("w-3 h-3 text-slate-400 transition-transform", showRoleSwitcher ? "rotate-90" : "")} />
              </button>

              <AnimatePresence>
                {showRoleSwitcher && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white border border-ui-border rounded-2xl shadow-2xl p-3 z-[100]"
                  >
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Switch Account Role</p>
                    <div className="space-y-1">
                      {roles.map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            if (currentUser) {
                              setCurrentUser({ ...currentUser, role });
                              setActiveTab('home');
                            }
                            setShowRoleSwitcher(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                            currentUser?.role === role ? "bg-brand-50 border border-brand-100" : "hover:bg-ui-surface border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            currentUser?.role === role ? "bg-brand-900 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600"
                          )}>
                            {role === 'investor' ? <TrendingUp className="w-4 h-4" /> : role === 'owner' ? <LandPlot className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                          </div>
                          <div className="text-left">
                            <p className={cn("text-[10px] font-bold uppercase tracking-widest", currentUser?.role === role ? "text-brand-900" : "text-slate-600")}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </p>
                            <p className="text-[8px] text-slate-400 font-medium">
                              {role === 'investor' ? 'Marketplace & Portfolio' : role === 'owner' ? 'Land & Asset Mgmt' : 'Farming & Operations'}
                            </p>
                          </div>
                          {currentUser?.role === role && <CheckCircle2 className="w-3 h-3 text-brand-600 ml-auto" />}
                        </button>
                      ))}
                    </div>
                    <div className="h-px bg-ui-border my-3" />
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-colors">
                      <X className="w-3 h-3" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="bg-brand-900 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10">
              Launch App
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-olive-900">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-olive-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button
                onClick={() => { setActiveTab('home'); setIsOpen(false); }}
                className="block w-full text-left px-3 py-3 text-base font-medium text-brand-950 hover:bg-ui-surface rounded-lg"
              >
                Home
              </button>
              {navGroups.map((group) => (
                <div key={group.id} className="space-y-1">
                  {group.items ? (
                    <>
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {group.label}
                      </div>
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "block w-full text-left px-6 py-2 text-sm font-medium rounded-lg transition-colors",
                            activeTab === item.id ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-ui-surface"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveTab(group.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "block w-full text-left px-3 py-3 text-base font-medium rounded-lg transition-colors",
                        activeTab === group.id ? "bg-brand-50 text-brand-600" : "text-brand-950 hover:bg-ui-surface"
                      )}
                    >
                      {group.label}
                    </button>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <button className="w-full bg-brand-900 text-white px-6 py-3 rounded-xl text-base font-medium shadow-lg">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AboutSection = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-6 border border-brand-100">
              Who We Are
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-black text-brand-950 mb-8 tracking-tight leading-tight">
              Pioneering the <span className="text-brand-600">Global Frontier</span> of Land Ownership.
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              stasso land is a team of agronomists, financial engineers, and technology pioneers dedicated to unlocking the value of the world's most fundamental asset: land. We believe that by combining traditional land stewardship with modern financial technology, we can create a more transparent, efficient, and inclusive global agricultural economy.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-2xl font-bold text-brand-950 mb-2">250k+</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Acres</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-brand-950 mb-2">15+</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Countries Active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-emerald-50 text-emerald-700 mb-6 border border-emerald-100">
                What We Do
              </div>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                    <Layers className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-950 mb-2">Fractional Ownership</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      We break down large-scale land assets into manageable digital shares, allowing individual and institutional investors to participate in high-yield agricultural projects with lower entry barriers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-950 mb-2">Institutional Due Diligence</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Every listing on our platform undergoes rigorous legal, environmental, and financial vetting. We handle the complexity of land titles and compliance so you can focus on your portfolio.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-950 mb-2">End-to-End Management</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      From precision farming and crop management to national logistics and market distribution, we provide the operational backbone to ensure your land assets reach their maximum yield potential.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Hero = ({ onExplore, currentUser, setActiveTab }: { onExplore: () => void, currentUser: User | null, setActiveTab: (t: string) => void }) => {
  const getHeroContent = () => {
    if (currentUser?.role === 'farmer') {
      return {
        badge: "Farmer Operations",
        title: "Scale Your <span className='text-brand-600'>Farming</span> with Precision.",
        description: "Access advanced soil analytics, weather forecasting, and global logistics partnerships. Agriwise provides the tools you need to maximize yield and connect with global investors.",
        primaryCTA: "Go to Farmer Dashboard",
        primaryAction: () => setActiveTab('farmer_tools'),
        secondaryCTA: "Explore Services",
        secondaryAction: () => setActiveTab('services')
      };
    }
    if (currentUser?.role === 'owner') {
      return {
        badge: "Land Management",
        title: "Maximize Your <span className='text-brand-600'>Land</span> Value.",
        description: "List your assets for fractional investment, track revenue from leases, and manage farming requests. Agriwise turns your land into a high-performance financial asset.",
        primaryCTA: "Manage My Land",
        primaryAction: () => setActiveTab('land_management'),
        secondaryCTA: "List New Land",
        secondaryAction: () => setActiveTab('marketplace')
      };
    }
    return {
      badge: "Grow your money",
      title: "Digitising the <span className='text-brand-600'>Most Ancient</span> Form of Asset.",
      description: "We grow your money.",
      primaryCTA: "Explore Marketplace",
      primaryAction: onExplore,
      secondaryCTA: "Investor Dashboard",
      secondaryAction: () => setActiveTab('dashboard')
    };
  };

  const content = getHeroContent();

  return (
    <div className="relative overflow-hidden bg-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-24 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-8 border border-brand-100">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2 animate-pulse" />
                {content.badge}
              </div>
              <h1 
                className="text-6xl md:text-8xl font-sans font-black text-brand-950 leading-[0.9] mb-10 tracking-tighter"
                dangerouslySetInnerHTML={{ __html: content.title }}
              />
              <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-xl">
                {content.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={content.primaryAction}
                  className="flex items-center justify-center px-10 py-5 bg-brand-900 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-2xl shadow-brand-900/20 group"
                >
                  {content.primaryCTA}
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={content.secondaryAction}
                  className="flex items-center justify-center px-10 py-5 bg-white border border-ui-border text-brand-950 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-ui-surface transition-all"
                >
                  {content.secondaryCTA}
                </motion.button>
              </div>
            </motion.div>
          </div>
          <div className="mt-16 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="bg-ui-surface border border-ui-border rounded-[48px] p-8 shadow-3xl">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <Globe className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-950">Global Index</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cross-Border Data</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-brand-600">+18.5%</p>
                    <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Avg. Global Yield</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: 'Global Land Value', value: '+$14.2B', trend: 'up' },
                    { label: 'Commodity Index', value: '+12.4%', trend: 'up' },
                    { label: 'Cross-Border Vol.', value: '$8.8B', trend: 'up' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-ui-border">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      <span className="text-sm font-mono font-bold text-brand-950">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-ui-border flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-ui-surface bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Investor" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">500+ Active Funds</p>
                </div>
              </div>
              
              {/* Floating element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 bg-brand-600 text-white p-6 rounded-3xl shadow-2xl"
              >
                <LandPlot className="w-8 h-8" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TokenPurchaseModal = ({ 
  listing, 
  onClose, 
  onSuccess, 
  formatCurrency 
}: { 
  listing: LandListing, 
  onClose: () => void, 
  onSuccess: () => void,
  formatCurrency: (a: number) => string 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1, // Mock user
          listing_id: listing.id,
          type: 'buy',
          quantity: quantity
        })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-950/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-[48px] p-10 shadow-2xl border border-ui-border"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-brand-950 tracking-tight">Token <span className="text-brand-600">Purchase</span></h3>
          <button onClick={onClose} className="p-2 hover:bg-ui-surface rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <img src={listing.image_url} alt={listing.title} className="w-20 h-20 rounded-2xl object-cover border border-ui-border" referrerPolicy="no-referrer" />
            <div>
              <h4 className="text-sm font-bold text-brand-950">{listing.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{listing.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-ui-surface p-4 rounded-2xl border border-ui-border">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Token Price</p>
              <p className="text-sm font-mono font-bold text-brand-950">{formatCurrency(listing.share_price)}</p>
            </div>
            <div className="bg-ui-surface p-4 rounded-2xl border border-ui-border">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available</p>
              <p className="text-sm font-mono font-bold text-brand-950">{listing.total_shares} Tokens</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity to Purchase</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl border border-ui-border flex items-center justify-center hover:bg-ui-surface transition-all"
              >
                <X className="w-4 h-4 rotate-45" />
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-grow text-center text-xl font-black text-brand-950 bg-ui-surface border border-ui-border rounded-xl py-3 focus:outline-none focus:border-brand-500"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-xl border border-ui-border flex items-center justify-center hover:bg-ui-surface transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-ui-border mb-8">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Investment</p>
            <p className="text-2xl font-black text-brand-900">{formatCurrency(listing.share_price * quantity)}</p>
          </div>
        </div>

        <button 
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full py-5 bg-brand-900 text-white rounded-[24px] text-xs font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-xl shadow-brand-900/20 flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <DollarSign className="w-4 h-4" />
              Confirm Token Purchase
            </>
          )}
        </button>
        <p className="mt-4 text-[9px] text-center text-slate-400 font-medium px-6">
          By confirming, you agree to the fractional ownership legal framework and Shariah-compliant investment protocols.
        </p>
      </motion.div>
    </div>
  );
};

const Marketplace = ({ formatCurrency }: { formatCurrency: (a: number) => string }) => {
  const [listings, setListings] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'agricultural' | 'hunting' | 'sporting' | 'horticulture' | 'fishing' | 'development'>('all');
  const [selectedListing, setSelectedListing] = useState<LandListing | null>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  }, []);

  const filteredListings = listings.filter(l => filter === 'all' || l.type === filter);

  return (
    <div className="py-24 bg-ui-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
              Live Marketplace
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-sans font-black text-brand-950 mb-4 tracking-tight"
            >
              Vetted <span className="text-brand-600">Land Assets</span>
            </motion.h2>
            <p className="text-slate-500 max-w-2xl font-medium">
              Institutional-grade agricultural and hunting land projects. Full legal, environmental, and financial due diligence on every listing.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-ui-border shadow-sm overflow-x-auto">
            {(['all', 'agricultural', 'hunting', 'sporting', 'horticulture', 'fishing', 'development'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all capitalize whitespace-nowrap",
                  filter === t ? "bg-brand-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white h-[500px] rounded-[32px] border border-ui-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={listing.id}
                className="group bg-white border border-ui-border rounded-[32px] overflow-hidden hover:border-brand-500 transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest text-white",
                      listing.type === 'agricultural' ? "bg-brand-600" : "bg-vibrant-orange"
                    )}>
                      {listing.type}
                    </span>
                    <span className="px-3 py-1 bg-brand-950/90 rounded-md text-[9px] font-bold uppercase tracking-widest text-white">
                      {listing.size} AC
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <MapPin className="w-3 h-3 mr-1.5 text-brand-500" />
                    {listing.location}
                  </div>
                  <h3 className="text-xl font-sans font-bold text-brand-950 mb-6 group-hover:text-brand-600 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-ui-border">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Token Price</p>
                      <p className="text-lg font-mono font-bold text-brand-950">{formatCurrency(listing.share_price)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Target ROI</p>
                      <p className="text-lg font-mono font-bold text-brand-600">{listing.roi_estimate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Tokens</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-950">{listing.total_shares}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedListing(listing)}
                    className="w-full flex items-center justify-center py-4 bg-brand-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-lg shadow-brand-900/10"
                  >
                    Buy Tokens
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedListing && (
            <TokenPurchaseModal 
              listing={selectedListing} 
              onClose={() => setSelectedListing(null)}
              onSuccess={() => {
                // Refresh listings or show success toast
                fetch('/api/listings')
                  .then(res => res.json())
                  .then(data => setListings(data));
              }}
              formatCurrency={formatCurrency}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const LandownerDashboard = ({ formatCurrency, setActiveTab }: { formatCurrency: (a: number) => string, setActiveTab: (t: string) => void }) => {
  const [myListings, setMyListings] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch('/api/listings'); // In a real app, filter by owner_id
        const data = await res.json();
        // Mock filtering for owner_id 2
        setMyListings(data.filter((l: any) => l.owner_id === 2));
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
      setLoading(false);
    };
    fetchMyListings();
  }, []);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
            Asset Management
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-black text-brand-950 mb-4 tracking-tight">
            Land <span className="text-brand-600">Portfolio</span>
          </h2>
          <p className="text-slate-500 font-medium">Manage your land assets, track revenue, and monitor farming operations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-950">My Active Listings</h3>
                <button className="bg-brand-900 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all">
                  List New Land
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-ui-surface rounded-3xl animate-pulse" />)}
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-16 bg-ui-surface rounded-[32px] border border-dashed border-ui-border">
                  <LandPlot className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">You haven't listed any land yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {myListings.map(listing => (
                    <div key={listing.id} className="p-6 bg-ui-surface rounded-[32px] border border-ui-border flex items-center justify-between group hover:border-brand-200 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-ui-border">
                          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-brand-950 mb-1">{listing.title}</h4>
                          <p className="text-[10px] text-slate-500 flex items-center mb-2">
                            <MapPin className="w-3 h-3 mr-1 text-brand-500" /> {listing.location}
                          </p>
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-[8px] font-bold uppercase tracking-widest border border-brand-100">
                              {listing.size} Acres
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-bold uppercase tracking-widest border border-emerald-100">
                              {listing.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Valuation</p>
                        <p className="text-lg font-mono font-bold text-brand-950 mb-3">{formatCurrency(listing.total_shares * listing.share_price)}</p>
                        <button className="text-brand-600 text-[10px] font-bold uppercase tracking-widest hover:underline">Manage Asset</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-brand-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-400 mb-8">Revenue Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-brand-300 uppercase tracking-widest mb-2">Monthly Lease</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(450000)}</p>
                    <p className="text-[9px] text-emerald-400 font-bold mt-1">+8.4% vs last month</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-300 uppercase tracking-widest mb-2">Token Dividends</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(125000)}</p>
                    <p className="text-[9px] text-emerald-400 font-bold mt-1">+12.1% vs last month</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-300 uppercase tracking-widest mb-2">Total Earnings</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(575000)}</p>
                    <p className="text-[9px] text-emerald-400 font-bold mt-1">On track for Q3 target</p>
                  </div>
                </div>
              </div>
              <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-950 mb-8">Management Requests</h3>
              <div className="space-y-6">
                {[
                  { farmer: "Ahmed Khan", land: "Indus Valley Plot A", type: "Crop Rotation Change", date: "2h ago" },
                  { farmer: "Zubair Ali", land: "Potohar Plateau Plot 4", type: "Logistics Partnership", date: "1d ago" }
                ].map((req, i) => (
                  <div key={i} className="pb-6 border-b border-ui-border last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold text-brand-950">{req.farmer}</h4>
                      <span className="text-[8px] text-slate-400 font-bold uppercase">{req.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-4">{req.type} for <span className="text-brand-600 font-bold">{req.land}</span></p>
                    <div className="flex gap-2">
                      <button className="flex-grow py-2 bg-brand-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all">Approve</button>
                      <button className="px-4 py-2 bg-ui-surface text-slate-400 border border-ui-border rounded-lg text-[9px] font-bold uppercase tracking-widest hover:text-rose-600 transition-all">Deny</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 p-10 rounded-[48px] border border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="text-white w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-amber-900">Active Disputes</h3>
              </div>
              <p className="text-xs text-amber-700 font-medium mb-6">You have 1 active dispute regarding boundary verification for Indus Valley Plot B.</p>
              <button 
                onClick={() => setActiveTab('disputes')}
                className="w-full py-3 bg-amber-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
              >
                View Dispute Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvestorDashboard = ({ formatCurrency }: { formatCurrency: (a: number) => string }) => {
  const [matches, setMatches] = useState<LandListing[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const userRes = await fetch('/api/users/1');
        const userData = await userRes.json();
        setUserProfile(userData);

        const res = await fetch('/api/matches/1');
        const data = await res.json();
        
        if (data.length > 0) {
          // Use Gemini to provide reasoning and scores
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const prompt = `
            As an AI investment advisor for Agriwise, analyze these land listings for an investor with the following profile:
            - Role: ${userData.role}
            - Min ROI: ${userData.profile?.min_roi}%
            - Max Risk: ${userData.profile?.max_risk}
            - Min Historical Yield: ${userData.profile?.min_historical_yield}%
            - Preferred Sectors: ${userData.profile?.preferred_sectors}
            - Preferred Locations: ${userData.profile?.preferred_locations}
            - Preferred Project Stages: ${userData.profile?.preferred_stages}
            - Min Development Potential: ${userData.profile?.min_development_potential}

            Listings:
            ${JSON.stringify(data.map((l: any) => ({ 
              id: l.id, 
              title: l.title, 
              roi: l.roi_estimate, 
              risk: l.risk_level, 
              sector: l.sector, 
              location: l.location,
              stage: l.project_stage,
              dev_potential: l.development_potential,
              hist_yield: l.historical_yield
            })))}

            For each listing, provide:
            1. A match_score (0-100) based on how well it fits the profile.
            2. A short match_reason (max 15 words) explaining why it's a good fit.

            Return ONLY a JSON array of objects with {id, match_score, match_reason}.
          `;

          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });

          const aiResults = JSON.parse(response.text || "[]");
          const enhancedMatches = data.map((l: any) => {
            const aiData = aiResults.find((r: any) => r.id === l.id);
            return {
              ...l,
              match_score: aiData?.match_score || 85,
              match_reason: aiData?.match_reason || "Strong alignment with your investment criteria."
            };
          }).sort((a: any, b: any) => (b.match_score || 0) - (a.match_score || 0));

          setMatches(enhancedMatches);
        } else {
          setMatches([]);
        }
      } catch (error) {
        console.error("AI Matching failed:", error);
        // Fallback to basic matches if AI fails
        const res = await fetch('/api/matches/1');
        const data = await res.json();
        setMatches(data);
      }
      setLoadingMatches(false);
    };

    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio/1');
        const data = await res.json();
        setPortfolio(data);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      }
      setLoadingPortfolio(false);
    };

    fetchMatches();
    fetchPortfolio();
  }, []);

  const totalPortfolioValue = portfolio.reduce((acc, item) => acc + (item.quantity * item.share_price), 0);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
            Portfolio Management
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-sans font-black text-brand-950 mb-4 tracking-tight"
          >
            Capital <span className="text-brand-600">Performance</span>
          </motion.h2>
          <p className="text-slate-500 font-medium">Real-time tracking of your agricultural asset portfolio.</p>
        </div>

        {/* AI Matching Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-950">AI-Powered Matches</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Based on your Investor Profile</p>
          </div>
          
          {loadingMatches ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-ui-surface h-48 rounded-3xl border border-ui-border" />)}
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {matches.map((match) => (
                <motion.div 
                  key={match.id}
                  whileHover={{ y: -5 }}
                  className="bg-ui-surface p-6 rounded-3xl border border-ui-border hover:border-brand-500 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-brand-600 text-white text-[8px] font-bold uppercase tracking-widest rounded-bl-xl">
                    {match.match_score}% Match
                  </div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-brand-50 text-brand-600 rounded text-[8px] font-bold uppercase tracking-widest border border-brand-100">
                          {match.roi_estimate}% Target ROI
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[8px] font-bold uppercase tracking-widest border border-blue-100">
                          {match.project_stage}
                        </span>
                        {match.historical_yield && (
                          <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[8px] font-bold uppercase tracking-widest border border-slate-100">
                            {match.historical_yield}% Hist. Yield
                          </span>
                        )}
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest",
                        match.risk_level === 'Low' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        match.risk_level === 'Medium' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-rose-50 text-rose-600 border border-rose-100"
                      )}>
                        {match.risk_level} Risk
                      </span>
                    </div>
                  <h4 className="text-sm font-bold text-brand-950 mb-1 group-hover:text-brand-600 transition-colors">{match.title}</h4>
                  <p className="text-[10px] text-slate-500 mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-brand-500" /> {match.location}
                  </p>
                  {match.match_reason && (
                    <p className="text-[9px] text-brand-700 font-medium mb-4 bg-brand-50/50 p-2 rounded-lg border border-brand-100/50">
                      <Sparkles className="w-2 h-2 inline mr-1" /> {match.match_reason}
                    </p>
                  )}
                  <button className="w-full py-2 bg-brand-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all">
                    View Opportunity
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-ui-surface p-12 rounded-[32px] border border-dashed border-ui-border text-center">
              <p className="text-slate-400 text-sm font-medium">No direct matches found. Try adjusting your investment criteria in your profile.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-ui-surface p-10 rounded-[32px] border border-ui-border">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-950">Yield Curve</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-brand-600 mr-2" />
                  Portfolio ROI
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={roiData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-brand-950 text-white p-10 rounded-[32px] shadow-2xl relative overflow-hidden group"
            >
              <div className="relative z-10">
                <p className="text-brand-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-4">AUM</p>
                <h4 className="text-5xl font-mono font-bold mb-8 tracking-tighter">{formatCurrency(totalPortfolioValue)}</h4>
                <div className="flex items-center text-brand-400 text-[10px] font-bold uppercase tracking-widest bg-white/5 w-fit px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <TrendingUp className="w-3 h-3 mr-2" />
                  +15.2% YTD
                </div>
              </div>
              <DollarSign className="absolute -bottom-6 -right-6 w-40 h-40 text-white/5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
            </motion.div>

            <div className="bg-white p-10 rounded-[32px] border border-ui-border shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-950 mb-8">Asset Valuation</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={landValueData}>
                    <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} dot={false} />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex items-center justify-between p-4 bg-ui-surface rounded-xl border border-ui-border">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg. PPSF</span>
                <span className="text-sm font-mono font-bold text-brand-950">Rs. 4,850</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-ui-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-ui-border flex items-center justify-between bg-ui-surface">
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-950">Active Positions</h3>
            <button className="text-brand-600 font-bold text-[10px] uppercase tracking-widest hover:underline">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white">
                  <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Asset Name</th>
                  <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Tokens Owned</th>
                  <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Token Price</th>
                  <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Value</th>
                  <th className="px-10 py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-border">
                {loadingPortfolio ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-8 text-center text-slate-400 text-xs">Loading positions...</td>
                  </tr>
                ) : portfolio.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-8 text-center text-slate-400 text-xs">No active positions found.</td>
                  </tr>
                ) : (
                  portfolio.map((item, idx) => (
                    <tr key={idx} className="hover:bg-ui-surface transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-ui-border" referrerPolicy="no-referrer" />
                          <span className="font-bold text-brand-950 text-sm">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-[11px] text-slate-500 font-bold uppercase tracking-wider">{item.quantity} Tokens</td>
                      <td className="px-10 py-8 font-mono font-bold text-brand-950 text-sm">{formatCurrency(item.share_price)}</td>
                      <td className="px-10 py-8 font-mono font-bold text-brand-600 text-sm">{formatCurrency(item.quantity * item.share_price)}</td>
                      <td className="px-10 py-8">
                        <button className="text-slate-400 hover:text-brand-900 font-bold text-[10px] uppercase tracking-widest transition-colors">Audit Report</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const DisputeModule = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newDispute, setNewDispute] = useState({ title: "", description: "" });
  const [generatingAI, setGeneratingAI] = useState(false);

  const fetchDisputes = async () => {
    const res = await fetch("/api/disputes");
    const data = await res.json();
    setDisputes(data);
    setLoading(false);
  };

  const fetchDisputeDetails = async (id: number) => {
    const res = await fetch(`/api/disputes/${id}`);
    const data = await res.json();
    setSelectedDispute(data);
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newDispute, initiator_id: 1 }),
    });
    if (res.ok) {
      setShowNewForm(false);
      setNewDispute({ title: "", description: "" });
      fetchDisputes();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !newMessage.trim()) return;
    const res = await fetch(`/api/disputes/${selectedDispute.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id: 1, sender_name: "Investor", content: newMessage }),
    });
    if (res.ok) {
      setNewMessage("");
      fetchDisputeDetails(selectedDispute.id);
    }
  };

  const handleUploadMock = async () => {
    if (!selectedDispute) return;
    const res = await fetch(`/api/disputes/${selectedDispute.id}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Evidence_Doc.pdf", url: "#", uploaded_by: 1 }),
    });
    if (res.ok) {
      fetchDisputeDetails(selectedDispute.id);
    }
  };

  const handleEscalate = async () => {
    if (!selectedDispute) return;
    const res = await fetch(`/api/disputes/${selectedDispute.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_escalated: 1, status: 'Escalated' }),
    });
    if (res.ok) {
      fetchDisputeDetails(selectedDispute.id);
    }
  };

  const generateAISuggestions = async () => {
    if (!selectedDispute) return;
    setGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this agricultural land dispute and provide 3-5 professional mediation suggestions. 
        Title: ${selectedDispute.title}
        Description: ${selectedDispute.description}
        
        Format the output in Markdown with clear headings.`,
      });

      const suggestions = response.text || "Unable to generate suggestions at this time.";
      
      // Save to backend
      await fetch(`/api/disputes/${selectedDispute.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediation_suggestions: suggestions }),
      });

      fetchDisputeDetails(selectedDispute.id);
    } catch (error) {
      console.error("AI Generation Error:", error);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="py-24 bg-ui-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
              Resolution Center
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-black text-brand-950 mb-4 tracking-tight">
              Dispute <span className="text-brand-600">Resolution</span>
            </h2>
            <p className="text-slate-500 max-w-2xl font-medium">
              Securely manage and resolve conflicts with transparent logging and professional mediation.
            </p>
          </div>
          {!showNewForm && !selectedDispute && (
            <button 
              onClick={() => setShowNewForm(true)}
              className="bg-brand-900 text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-lg"
            >
              Initiate Dispute
            </button>
          )}
        </div>

        {showNewForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[32px] border border-ui-border shadow-sm max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-bold text-brand-950 mb-8">New Dispute Case</h3>
            <form onSubmit={handleCreateDispute} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Case Title</label>
                <input 
                  required
                  value={newDispute.title}
                  onChange={e => setNewDispute({...newDispute, title: e.target.value})}
                  className="w-full bg-ui-surface border border-ui-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-600"
                  placeholder="e.g. Contractual Yield Mismatch"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={newDispute.description}
                  onChange={e => setNewDispute({...newDispute, description: e.target.value})}
                  className="w-full bg-ui-surface border border-ui-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-600"
                  placeholder="Provide detailed evidence and context..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-brand-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-950 transition-all"
                >
                  Submit Case
                </button>
                <button 
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="flex-1 bg-white border border-ui-border text-slate-500 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-ui-surface transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : selectedDispute ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[32px] border border-ui-border shadow-sm">
                <button 
                  onClick={() => setSelectedDispute(null)}
                  className="text-brand-600 text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center hover:underline"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Cases
                </button>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-950 mb-2">{selectedDispute.title}</h3>
                    <p className="text-slate-500 text-sm">{selectedDispute.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                      selectedDispute.is_escalated ? "bg-vibrant-rose/10 text-vibrant-rose border-vibrant-rose/20" : "bg-brand-50 text-brand-600 border-brand-100"
                    )}>
                      {selectedDispute.status}
                    </span>
                    {selectedDispute.is_escalated === 1 && (
                      <span className="flex items-center text-[9px] font-bold text-vibrant-rose uppercase tracking-widest">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Escalated to Support
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Suggestions Section */}
                <div className="mb-10 p-8 bg-brand-50 rounded-3xl border border-brand-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-600" />
                      <h4 className="text-sm font-bold text-brand-950 uppercase tracking-widest">AI Mediation Suggestions</h4>
                    </div>
                    <button 
                      onClick={generateAISuggestions}
                      disabled={generatingAI}
                      className="text-[10px] font-bold text-brand-600 uppercase tracking-widest hover:underline disabled:opacity-50"
                    >
                      {generatingAI ? "Generating..." : selectedDispute.mediation_suggestions ? "Regenerate" : "Generate Now"}
                    </button>
                  </div>
                  
                  {selectedDispute.mediation_suggestions ? (
                    <div className="prose prose-sm max-w-none text-slate-600">
                      <Markdown>{selectedDispute.mediation_suggestions}</Markdown>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No suggestions generated yet. Click "Generate Now" to get AI-powered mediation advice.
                    </p>
                  )}
                </div>
                
                <div className="border-t border-ui-border pt-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">Secure Communication Log</h4>
                  <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4">
                    {selectedDispute.messages?.map(msg => (
                      <div key={msg.id} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-brand-950">{msg.sender_name}</span>
                          <span className="text-[9px] text-slate-400">{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                        <div className="bg-ui-surface p-4 rounded-2xl rounded-tl-none text-sm text-slate-600 border border-ui-border">
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="flex-grow bg-ui-surface border border-ui-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-600"
                      placeholder="Type your message..."
                    />
                    <button className="bg-brand-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-ui-border shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-950">Evidence Vault</h4>
                  <button 
                    onClick={handleUploadMock}
                    className="text-brand-600 text-[9px] font-bold uppercase tracking-widest hover:underline"
                  >
                    Upload
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedDispute.documents?.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-ui-surface rounded-xl border border-ui-border group hover:border-brand-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-ui-border">
                          <FileSearch className="w-4 h-4 text-brand-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-brand-950 truncate max-w-[120px]">{doc.name}</p>
                          <p className="text-[9px] text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <a href={doc.url} className="text-slate-400 group-hover:text-brand-600">
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                  {(!selectedDispute.documents || selectedDispute.documents.length === 0) && (
                    <p className="text-[10px] text-slate-400 text-center py-8 italic">No documents uploaded yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-brand-950 text-white p-8 rounded-[32px] shadow-2xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-6">Resolution Progress</h4>
                <div className="space-y-6 mb-8">
                  {[
                    { label: 'Initiated', date: selectedDispute.created_at, done: true },
                    { label: 'Mediator Assigned', date: 'Pending', done: false },
                    { label: 'Review Phase', date: 'Pending', done: false },
                    { label: 'Resolved', date: 'Pending', done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          step.done ? "bg-brand-600 border-brand-600" : "border-brand-800"
                        )}>
                          {step.done && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        {i < 3 && <div className="w-px h-8 bg-brand-800" />}
                      </div>
                      <div>
                        <p className={cn("text-[11px] font-bold", step.done ? "text-white" : "text-brand-600")}>{step.label}</p>
                        <p className="text-[9px] text-brand-500">{step.date !== 'Pending' ? new Date(step.date).toLocaleDateString() : step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedDispute.is_escalated === 0 && (
                  <button 
                    onClick={handleEscalate}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    <Headphones className="w-4 h-4" />
                    Escalate to Support
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="animate-pulse bg-white h-64 rounded-[32px] border border-ui-border" />)
            ) : disputes.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-ui-border">
                <Gavel className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No active dispute cases found.</p>
              </div>
            ) : (
              disputes.map(dispute => (
                <motion.div 
                  key={dispute.id}
                  whileHover={{ y: -5 }}
                  onClick={() => fetchDisputeDetails(dispute.id)}
                  className="bg-white p-8 rounded-[32px] border border-ui-border shadow-sm cursor-pointer hover:border-brand-500 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-md text-[9px] font-bold uppercase tracking-widest border border-brand-100">
                      {dispute.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      Case #{dispute.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-950 mb-4 group-hover:text-brand-600 transition-colors">{dispute.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-8">{dispute.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-ui-border">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(dispute.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center text-brand-600 text-[9px] font-bold uppercase tracking-widest">
                      View Details <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

 const Services = () => {
  const features = [
    {
      icon: LandPlot,
      title: "Land Leasing",
      description: "Institutional-grade leasing frameworks for long-term agricultural asset optimization."
    },
    {
      icon: TrendingUp,
      title: "Capital Markets",
      description: "Direct access to high-yield agricultural debt and equity instruments for sophisticated investors."
    },
    {
      icon: Cpu,
      title: "AgriTech Stack",
      description: "Proprietary IoT and satellite data integration for real-time asset monitoring and yield auditing."
    },
    {
      icon: Activity,
      title: "Farmer Tools",
      description: "Advanced land management suite including soil health monitoring and crop rotation planning."
    },
    {
      icon: FileSearch,
      title: "Risk Analysis",
      description: "Comprehensive environmental, social, and governance (ESG) risk assessment for every asset."
    },
    {
      icon: Trophy,
      title: "Sporting Land",
      description: "Premium hunting, equestrian, and recreational land assets with managed biodiversity."
    },
    {
      icon: Sprout,
      title: "Horticulture",
      description: "Specialized high-value crop management for greenhouses, orchards, and vertical farming."
    },
    {
      icon: Waves,
      title: "Fishing & Aquaculture",
      description: "Sustainable water-based assets including commercial fisheries and inland aquaculture systems."
    },
    {
      icon: Construction,
      title: "Land Development",
      description: "Full-cycle development from raw land to optimized agricultural or recreational infrastructure."
    },
    {
      icon: Gavel,
      title: "Legal Framework",
      description: "Standardized arbitration and dispute resolution protocols for cross-border land transactions."
    },
    {
      icon: Truck,
      title: "Supply Chain",
      description: "Full-stack logistics and infrastructure support for farm-to-market commodity flow."
    },
    {
      icon: Globe,
      title: "Trade & Exports",
      description: "Facilitating national and international commodity trade with integrated compliance and regulatory oversight."
    },
    {
      icon: Handshake,
      title: "Strategic Advisory",
      description: "Bespoke consulting for large-scale land acquisition and agricultural development projects."
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-6 border border-brand-100">
            Infrastructure
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-sans font-black text-brand-950 mb-6 tracking-tight"
          >
            Institutional <span className="text-brand-600">Infrastructure</span>
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            stasso land provides the full-stack infrastructure required for modern agricultural land management and investment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {features.map((f, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="group"
            >
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-900 transition-all duration-300 shadow-sm">
                <f.icon className="w-5 h-5 text-brand-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-950 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-xs font-medium">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 bg-brand-950 rounded-[60px] p-12 md:p-24 relative overflow-hidden shadow-3xl shadow-brand-950/40">
          <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-24 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-sans font-bold text-white mb-8 leading-tight"
              >
                Ready to grow your <span className="italic text-brand-600 underline decoration-brand-600/30 underline-offset-8">land</span> legacy?
              </motion.h2>
              <p className="text-brand-300 text-xl mb-12 leading-relaxed">
                Join 5,000+ landowners and investors building the future of sustainable farming.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-500 transition-all shadow-xl shadow-brand-600/20"
                >
                  Join as Landowner
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md"
                >
                  Join as Investor
                </motion.button>
              </div>
            </div>
            <div className="mt-16 lg:mt-0 grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl"
                >
                  <p className="text-4xl font-bold text-brand-600 mb-2">120k</p>
                  <p className="text-[10px] text-brand-400 uppercase tracking-[0.2em] font-bold">Acres Managed</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl"
                >
                  <p className="text-4xl font-bold text-vibrant-amber mb-2">98%</p>
                  <p className="text-[10px] text-brand-400 uppercase tracking-[0.2em] font-bold">Success Rate</p>
                </motion.div>
              </div>
              <div className="space-y-6 pt-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl"
                >
                  <p className="text-4xl font-bold text-vibrant-sky mb-2">$12.4B</p>
                  <p className="text-[10px] text-brand-400 uppercase tracking-[0.2em] font-bold">Capital Deployed</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl"
                >
                  <p className="text-4xl font-bold text-vibrant-rose mb-2">7+</p>
                  <p className="text-[10px] text-brand-400 uppercase tracking-[0.2em] font-bold">Regions</p>
                </motion.div>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-vibrant-amber/20 rounded-full blur-[100px]" />
        </div>
      </div>
    </div>
  );
};


const Footer = () => {
  return (
    <footer className="bg-brand-950 text-white py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center mr-3">
                <LandPlot className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-sans font-extrabold tracking-tight">stasso<span className="text-brand-600">land</span></span>
            </div>
            <p className="text-brand-400 text-sm leading-relaxed font-medium">
              Grow your money with institutional-grade infrastructure for the future of agricultural land investment.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Platform</h4>
            <ul className="space-y-4 text-sm text-brand-400 font-medium">
              <li><button className="hover:text-brand-600 transition-colors">Marketplace</button></li>
              <li><button className="hover:text-brand-600 transition-colors">Investor Portal</button></li>
              <li><button className="hover:text-brand-600 transition-colors">Asset Management</button></li>
              <li><button className="hover:text-brand-600 transition-colors">Risk Analysis</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-brand-400 font-medium">
              <li><button className="hover:text-brand-600 transition-colors">About Us</button></li>
              <li><button className="hover:text-brand-600 transition-colors">Compliance</button></li>
              <li><button className="hover:text-brand-600 transition-colors">ESG Report</button></li>
              <li><button className="hover:text-brand-600 transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Newsletter</h4>
            <p className="text-xs text-brand-400 mb-6 font-medium">Get the latest market insights and asset reports.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-600 transition-colors"
              />
              <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-500 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500">
            © 2026 stasso land Capital. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-brand-500">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <button className="hover:text-white transition-colors">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LiveExchange = ({ formatCurrency }: { formatCurrency: (a: number) => string }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [listings, setListings] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTrade, setActiveTrade] = useState<{listing: LandListing, type: 'buy' | 'sell'} | null>(null);
  const [tradeQty, setTradeQty] = useState(1);

  const fetchData = async () => {
    const [tradesRes, portfolioRes, leaderboardRes, listingsRes] = await Promise.all([
      fetch('/api/trades'),
      fetch('/api/portfolio/1'),
      fetch('/api/leaderboard'),
      fetch('/api/listings')
    ]);
    
    setTrades(await tradesRes.json());
    setPortfolio(await portfolioRes.json());
    setLeaderboard(await leaderboardRes.json());
    setListings(await listingsRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s for "live" feel
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async () => {
    if (!activeTrade) return;
    const res = await fetch('/api/trade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1,
        listing_id: activeTrade.listing.id,
        type: activeTrade.type,
        quantity: tradeQty
      })
    });
    if (res.ok) {
      setActiveTrade(null);
      setTradeQty(1);
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || "Trade failed");
    }
  };

  return (
    <div className="py-24 bg-ui-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Trading Floor */}
          <div className="flex-grow space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-ui-border shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
                    Live Market
                  </div>
                  <h2 className="text-3xl font-sans font-black text-brand-950 tracking-tight">
                    Farm <span className="text-brand-600">Exchange</span>
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Market Open</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-6 rounded-2xl border border-ui-border hover:border-brand-300 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-brand-950">{listing.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{listing.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-brand-900">{formatCurrency(listing.share_price)}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Per Share</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActiveTrade({ listing, type: 'buy' })}
                        className="flex-grow py-3 bg-brand-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-lg shadow-brand-900/10"
                      >
                        Buy
                      </button>
                      <button 
                        onClick={() => setActiveTrade({ listing, type: 'sell' })}
                        className="flex-grow py-3 bg-white border border-ui-border text-brand-950 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-ui-surface transition-all"
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trades Ticker */}
            <div className="bg-white p-8 rounded-[32px] border border-ui-border shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {trades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 bg-ui-surface rounded-2xl border border-ui-border">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                        trade.type === 'buy' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {trade.type === 'buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-950">
                          <span className="text-slate-400">{trade.user_name}</span> {trade.type === 'buy' ? 'bought' : 'sold'} {trade.quantity} shares of {trade.listing_title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">{new Date(trade.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-brand-950">{formatCurrency(trade.price * trade.quantity)}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Total Value</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Portfolio & Leaderboard */}
          <div className="lg:w-96 space-y-8">
            {/* My Portfolio */}
            <div className="bg-brand-950 p-8 rounded-[32px] text-white shadow-2xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-6">My Live Portfolio</h3>
              <div className="space-y-6">
                {portfolio.length === 0 ? (
                  <p className="text-xs text-brand-600 font-medium">No active shares. Start trading to build your portfolio.</p>
                ) : (
                  portfolio.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.image_url} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                        <div>
                          <p className="text-xs font-bold">{item.title}</p>
                          <p className="text-[10px] text-brand-500">{item.quantity} Shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold">{formatCurrency(item.quantity * item.share_price)}</p>
                        <p className="text-[8px] text-emerald-400 font-bold">+2.4%</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold mb-1">Total Portfolio Value</p>
                <p className="text-3xl font-black">{formatCurrency(portfolio.reduce((acc, item) => acc + (item.quantity * item.share_price), 0))}</p>
              </div>
            </div>

            {/* Competition Leaderboard */}
            <div className="bg-white p-8 rounded-[32px] border border-ui-border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-vibrant-amber" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Top Investors</h3>
              </div>
              <div className="space-y-6">
                {leaderboard.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-300 w-4">{i + 1}</span>
                      <img src={entry.avatar_url} className="w-8 h-8 rounded-full border border-ui-border" />
                      <p className="text-xs font-bold text-brand-950">{entry.name}</p>
                    </div>
                    <p className="text-xs font-black text-brand-900">{formatCurrency(entry.portfolio_value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      <AnimatePresence>
        {activeTrade && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTrade(null)}
              className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-brand-950 tracking-tight">
                      {activeTrade.type === 'buy' ? 'Buy' : 'Sell'} <span className="text-brand-600">Shares</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{activeTrade.listing.title}</p>
                  </div>
                  <button onClick={() => setActiveTrade(null)} className="p-2 hover:bg-ui-surface rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={tradeQty}
                      onChange={(e) => setTradeQty(parseInt(e.target.value) || 0)}
                      className="w-full bg-ui-surface border border-ui-border rounded-2xl px-6 py-4 text-lg font-bold focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <div className="p-6 bg-ui-surface rounded-2xl border border-ui-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-slate-500">Price per share</span>
                      <span className="text-xs font-bold">{formatCurrency(activeTrade.listing.share_price)}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-ui-border">
                      <span className="text-sm font-bold text-brand-950">Total Value</span>
                      <span className="text-sm font-black text-brand-900">{formatCurrency(activeTrade.listing.share_price * tradeQty)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleTrade}
                    className={cn(
                      "w-full py-5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-xl",
                      activeTrade.type === 'buy' 
                        ? "bg-brand-900 text-white hover:bg-brand-950 shadow-brand-900/20" 
                        : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20"
                    )}
                  >
                    Confirm {activeTrade.type === 'buy' ? 'Purchase' : 'Sale'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !mediaUrl) return;
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        author_id: 1, 
        content: newPostContent,
        media_url: mediaUrl,
        media_type: mediaType
      }),
    });
    if (res.ok) {
      setNewPostContent("");
      setMediaUrl("");
      setMediaType(null);
      fetchPosts();
    }
  };

  const handleMockUpload = (type: 'image' | 'video') => {
    // Mocking an upload by providing a random relevant URL
    const mockUrls = {
      image: [
        'https://picsum.photos/seed/farm_post1/800/600',
        'https://picsum.photos/seed/farm_post2/800/600',
        'https://picsum.photos/seed/farm_post3/800/600'
      ],
      video: [
        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        'https://www.w3schools.com/html/mov_bbb.mp4'
      ]
    };
    const urls = mockUrls[type];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    setMediaUrl(randomUrl);
    setMediaType(type);
  };

  const handleCreateComment = async (postId: number) => {
    if (!newCommentContent.trim()) return;
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author_id: 1, content: newCommentContent }),
    });
    if (res.ok) {
      setNewCommentContent("");
      setActiveCommentPostId(null);
      fetchPosts();
    }
  };

  return (
    <div className="py-24 bg-ui-surface min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
            Community Hub
          </div>
          <h2 className="text-4xl font-sans font-black text-brand-950 mb-4 tracking-tight">
            Share <span className="text-brand-600">Experiences</span>
          </h2>
          <p className="text-slate-500 font-medium">Connect with investors and land owners to build a sustainable future together.</p>
        </div>

        {/* Create Post */}
        <div className="bg-white p-6 rounded-[32px] border border-ui-border shadow-sm mb-10">
          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your experience or ask a question..."
              className="w-full bg-ui-surface border border-ui-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-600 mb-4 min-h-[100px]"
            />
            
            {mediaUrl && (
              <div className="relative mb-4 rounded-2xl overflow-hidden border border-ui-border">
                {mediaType === 'image' ? (
                  <img src={mediaUrl} alt="Preview" className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-slate-900 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-50" />
                    <p className="text-white text-xs ml-2">Video Preview Attached</p>
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => { setMediaUrl(""); setMediaType(null); }}
                  className="absolute top-2 right-2 bg-brand-950/50 text-white p-1 rounded-full hover:bg-brand-950 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMockUpload('image')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-ui-surface transition-all"
                >
                  <Image className="w-4 h-4 text-brand-600" />
                  Photo
                </button>
                <button
                  type="button"
                  onClick={() => handleMockUpload('video')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-ui-surface transition-all"
                >
                  <Video className="w-4 h-4 text-vibrant-rose" />
                  Video
                </button>
              </div>
              <button
                type="submit"
                className="bg-brand-900 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-lg"
              >
                Post Experience
              </button>
            </div>
          </form>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-white h-48 rounded-[32px] border border-ui-border" />)}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[32px] border border-ui-border shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={post.author_avatar} alt={post.author_name} className="w-12 h-12 rounded-full border-2 border-brand-100" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-brand-950">{post.author_name}</h4>
                      <span className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-[8px] font-bold uppercase tracking-widest border border-brand-100">
                        {post.author_role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{post.content}</p>
                
                {post.media_url && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-ui-border bg-slate-50">
                    {post.media_type === 'image' ? (
                      <img 
                        src={post.media_url} 
                        alt="Post media" 
                        className="w-full h-auto max-h-[500px] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <video 
                        src={post.media_url} 
                        controls 
                        className="w-full h-auto max-h-[500px]"
                      />
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-6 pt-6 border-t border-ui-border">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Like</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{post.comments.length} Comments</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post.id && (
                  <div className="mt-8 space-y-6 pt-8 border-t border-ui-border">
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <img src={comment.author_avatar} alt={comment.author_name} className="w-8 h-8 rounded-full border border-brand-100" />
                          <div className="bg-ui-surface p-4 rounded-2xl rounded-tl-none flex-grow">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-brand-950">{comment.author_name}</span>
                              <span className="text-[8px] text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-600">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-grow bg-ui-surface border border-ui-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-600"
                      />
                      <button 
                        onClick={() => handleCreateComment(post.id)}
                        className="bg-brand-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CrowdfundingConcept = ({ formatCurrency }: { formatCurrency: (a: number) => string }) => {
  const steps = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Fractionalization",
      description: `Large-scale agricultural land is divided into thousands of digital shares, making high-value assets accessible for as little as ${formatCurrency(5000)}.`
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Pooling",
      description: "Investors pool their capital to acquire vetted land. This collective power allows for institutional-grade management and economies of scale."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Liquidity",
      description: "Unlike traditional land, your shares can be traded instantly on our Live Exchange, providing flexibility and exit options whenever you need."
    },
    {
      icon: <Sprout className="w-8 h-8" />,
      title: "Yield Harvesting",
      description: "Earn regular dividends from crop harvests and benefit from long-term land value appreciation as the project matures."
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-6 border border-brand-100">
            How it Works
          </div>
          <h2 className="text-5xl font-sans font-black text-brand-950 mb-6 tracking-tight">
            The <span className="text-brand-600">Crowdfunding</span> Revolution
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            Agriwise dismantles the barriers to land ownership. We use crowdfunding to democratize agricultural wealth, allowing everyone to own a piece of the earth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-ui-surface rounded-[40px] border border-ui-border hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-900/5 transition-all group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-brand-900 group-hover:text-white transition-colors">
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-brand-950 mb-4 tracking-tight">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 bg-brand-950 rounded-[64px] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl">
          <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-20 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight leading-tight">
                Why <span className="text-brand-400">Crowdfunded</span> Land?
              </h3>
              <div className="space-y-8">
                {[
                  { t: "Lower Entry Barrier", d: "Start with small amounts instead of needing millions for a full plot." },
                  { t: "Diversification", d: "Spread your investment across multiple farms, crops, and regions." },
                  { t: "Professional Management", d: "Expert farmers and agronomists manage the land for you." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-brand-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{item.t}</h4>
                      <p className="text-brand-200/70 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-16 lg:mt-0">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-10">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-xl font-bold">Growth Comparison</h4>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-400" />
                    <div className="w-3 h-3 rounded-full bg-slate-600" />
                  </div>
                </div>
                <div className="space-y-8">
                  {[
                    { label: 'Agriwise Land Shares', val: '18.4%', w: '100%', color: 'bg-brand-400' },
                    { label: 'Traditional Real Estate', val: '12.2%', w: '65%', color: 'bg-slate-500' },
                    { label: 'Stock Market (KSE-100)', val: '9.8%', w: '50%', color: 'bg-slate-600' },
                    { label: 'Savings Account', val: '6.5%', w: '35%', color: 'bg-slate-700' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-200">{item.label}</span>
                        <span className="text-xs font-mono font-bold">{item.val}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: item.w }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                          className={`h-full ${item.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-10 text-[10px] text-brand-300/50 font-bold uppercase tracking-[0.2em] text-center">
                  * Based on 5-year historical average returns in Pakistan
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
};

const InvestmentAnalyzer = () => {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(5);
  const [expectedYield, setExpectedYield] = useState(12);

  const calculateReturns = () => {
    const total = amount * Math.pow(1 + expectedYield / 100, years);
    const profit = total - amount;
    return { total, profit };
  };

  const { total, profit } = calculateReturns();

  const riskFactors = [
    { label: 'Weather Resilience', score: 85, color: 'emerald' },
    { label: 'Market Demand', score: 92, color: 'brand' },
    { label: 'Legal Compliance', score: 100, color: 'emerald' },
    { label: 'Infrastructure', score: 78, color: 'amber' },
  ];

  return (
    <div className="py-24 bg-ui-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
            Analytical Engine
          </div>
          <h2 className="text-5xl font-sans font-black text-brand-950 mb-4 tracking-tight">
            Investment <span className="text-brand-600">Analyzer</span>
          </h2>
          <p className="text-slate-500 max-w-2xl font-medium">
            Project your returns, assess risk profiles, and compare agricultural assets with institutional-grade data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Calculator Panel */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-ui-border shadow-sm">
              <div className="flex items-center gap-3 mb-10">
                <Calculator className="w-6 h-6 text-brand-600" />
                <h3 className="text-xl font-black text-brand-950 tracking-tight">ROI Calculator</h3>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Investment Amount (Rs.)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-ui-surface border border-ui-border rounded-2xl px-6 py-4 text-xl font-black focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Time Horizon (Years)</label>
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" min="1" max="20" 
                      value={years}
                      onChange={e => setYears(Number(e.target.value))}
                      className="flex-grow h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                    <span className="w-12 text-center font-black text-brand-950">{years}y</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Expected Annual Yield (%)</label>
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" min="5" max="30" step="0.5"
                      value={expectedYield}
                      onChange={e => setExpectedYield(Number(e.target.value))}
                      className="flex-grow h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                    <span className="w-12 text-center font-black text-brand-950">{expectedYield}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-900 p-10 rounded-[40px] text-white shadow-2xl">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-300 mb-6">Projected Outcome</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">Total Value</p>
                  <p className="text-4xl font-black tracking-tight">Rs. {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">Net Profit</p>
                  <p className="text-2xl font-black text-emerald-400">+Rs. {profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[40px] border border-ui-border shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-brand-950 tracking-tight">Risk Assessment</h3>
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="space-y-8">
                  {riskFactors.map((factor, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{factor.label}</span>
                        <span className="text-xs font-black text-brand-950">{factor.score}/100</span>
                      </div>
                      <div className="h-2 bg-ui-surface rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.score}%` }}
                          className={`h-full ${factor.color === 'emerald' ? 'bg-emerald-500' : factor.color === 'brand' ? 'bg-brand-600' : 'bg-amber-500'}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-ui-border shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-brand-950 tracking-tight">Market Trends</h3>
                  <TrendingUp className="w-6 h-6 text-brand-600" />
                </div>
                <div className="h-48 flex items-end gap-3">
                  {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="flex-grow flex flex-col items-center gap-3">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="w-full bg-brand-50 rounded-t-xl border-t-2 border-brand-200 relative group"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-950 text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          +{(h/10).toFixed(1)}%
                        </div>
                      </motion.div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">M{i+1}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                  * Aggregated data from national agricultural commodity boards and land registry offices.
                </p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-ui-border shadow-sm">
              <div className="flex items-center gap-3 mb-10">
                <Target className="w-6 h-6 text-brand-600" />
                <h3 className="text-xl font-black text-brand-950 tracking-tight">Strategic Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { t: "Optimal Crop Mix", d: "Current soil data suggests a 60/40 Wheat-Canola rotation for maximum yield.", icon: <Sprout className="w-5 h-5" /> },
                  { t: "Logistics Score", d: "Proximity to the CPEC corridor increases asset liquidity by 14.2%.", icon: <Truck className="w-5 h-5" /> },
                  { t: "Climate Outlook", d: "Stable water table projections for the next 10 years in this region.", icon: <Waves className="w-5 h-5" /> }
                ].map((insight, i) => (
                  <div key={i} className="p-6 bg-ui-surface rounded-3xl border border-ui-border">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm text-brand-600">
                      {insight.icon}
                    </div>
                    <h4 className="text-xs font-bold text-brand-950 mb-2">{insight.t}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{insight.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfileManagement = ({ currentUser, setCurrentUser }: { currentUser: User | null, setCurrentUser: (u: User | null) => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'role_specific' | 'verification'>('general');

  const sectors = ['crops', 'livestock', 'forestry', 'aquaculture', 'horticulture'];
  const locations = ['Punjab, Pakistan', 'Sindh, Pakistan', 'Khyber Pakhtunkhwa, Pakistan', 'Balochistan, Pakistan', 'Gilgit-Baltistan, Pakistan', 'Azad Kashmir, Pakistan'];
  const landTypes = ['agricultural', 'hunting', 'sporting', 'horticulture', 'fishing', 'development'];

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      const res = await fetch(`/api/users/${currentUser.id}`);
      const data = await res.json();
      
      // Sync with currentUser role if changed via Navbar
      data.role = currentUser.role;

      // Parse JSON fields in profile
      if (data.profile) {
        if (data.role === 'investor') {
          data.profile.preferred_sectors = JSON.parse(data.profile.preferred_sectors || "[]");
          data.profile.preferred_locations = JSON.parse(data.profile.preferred_locations || "[]");
          data.profile.preferred_stages = JSON.parse(data.profile.preferred_stages || "[]");
          data.profile.investment_history = JSON.parse(data.profile.investment_history || "[]");
        } else if (data.role === 'owner') {
          data.profile.land_locations = JSON.parse(data.profile.land_locations || "[]");
          data.profile.land_types = JSON.parse(data.profile.land_types || "[]");
        } else if (data.role === 'farmer') {
          data.profile.specialization = JSON.parse(data.profile.specialization || "[]");
          data.profile.past_projects = JSON.parse(data.profile.past_projects || "[]");
          data.profile.project_proposals = JSON.parse(data.profile.project_proposals || "[]");
        }
      } else {
        // Initialize empty profile if not exists
        if (data.role === 'investor') {
          data.profile = { 
            min_roi: 5, 
            max_risk: 'Medium', 
            min_historical_yield: 0,
            preferred_sectors: [], 
            preferred_locations: [], 
            preferred_stages: ['Growth', 'Mature'],
            min_development_potential: 'Medium',
            investment_history: [] 
          };
        } else if (data.role === 'owner') {
          data.profile = { total_acres: 0, land_locations: [], land_types: [], ownership_documents_url: '' };
        } else if (data.role === 'farmer') {
          data.profile = { specialization: [], past_projects: [], project_proposals: [] };
        }
      }
      
      setUser(data);
      setLoading(false);
    };
    fetchData();
  }, [currentUser?.id, currentUser?.role]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await Promise.all([
        fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: user.name, 
            bio: user.bio, 
            role: user.role, 
            experience_years: user.experience_years,
            verification_status: user.verification_status 
          })
        }),
        fetch(`/api/profiles/${user.role}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, ...user.profile })
        })
      ]);
      setCurrentUser(user);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to update profile.");
    }
    setSaving(false);
  };

  const toggleItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  const updateProfile = (updates: any) => {
    if (!user) return;
    setUser({
      ...user,
      profile: { ...user.profile, ...updates }
    });
  };

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Profile Data...</p>
    </div>
  );

  return (
    <div className="py-24 bg-ui-surface min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
              Account Management
            </div>
            <h2 className="text-4xl font-sans font-black text-brand-950 mb-4 tracking-tight">
              Detailed <span className="text-brand-600">Profile</span>
            </h2>
            <p className="text-slate-500 font-medium">Manage your identity, experience, and role-specific details on Agriwise.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-900 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-xl shadow-brand-900/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 bg-white p-1.5 rounded-2xl border border-ui-border mb-8 shadow-sm">
          <button 
            onClick={() => setActiveSubTab('general')}
            className={cn(
              "flex-grow py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
              activeSubTab === 'general' ? "bg-brand-900 text-white shadow-lg" : "text-slate-500 hover:bg-ui-surface"
            )}
          >
            General Info
          </button>
          <button 
            onClick={() => setActiveSubTab('role_specific')}
            className={cn(
              "flex-grow py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
              activeSubTab === 'role_specific' ? "bg-brand-900 text-white shadow-lg" : "text-slate-500 hover:bg-ui-surface"
            )}
          >
            {user?.role === 'investor' ? 'Investment Criteria' : user?.role === 'owner' ? 'Land Portfolio' : 'Project Proposals'}
          </button>
          <button 
            onClick={() => setActiveSubTab('verification')}
            className={cn(
              "flex-grow py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
              activeSubTab === 'verification' ? "bg-brand-900 text-white shadow-lg" : "text-slate-500 hover:bg-ui-surface"
            )}
          >
            Verification Status
          </button>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-ui-border shadow-sm">
          <AnimatePresence mode="wait">
            {activeSubTab === 'general' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-ui-surface rounded-[32px] border border-ui-border">
                  <div className="relative group">
                    <img src={user?.avatar_url} alt={user?.name} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" />
                    <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Image className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                      <input 
                        value={user?.name}
                        onChange={e => setUser(user ? {...user, name: e.target.value} : null)}
                        className="text-2xl font-black text-brand-950 bg-transparent border-b-2 border-transparent hover:border-brand-200 focus:border-brand-600 focus:outline-none text-center md:text-left"
                      />
                      <div className="flex justify-center md:justify-start gap-2">
                        <select 
                          value={user?.role}
                          onChange={e => {
                            const newRole = e.target.value as 'investor' | 'owner' | 'farmer';
                            if (user) {
                              setUser({...user, role: newRole});
                              // Initialize empty profile if role changes
                              if (newRole === 'investor') {
                                user.profile = { user_id: user.id, min_roi: 5, max_risk: 'Medium', min_historical_yield: 0, preferred_sectors: [], preferred_locations: [], preferred_stages: ['Growth', 'Mature'], min_development_potential: 'Medium', investment_history: [] };
                              } else if (newRole === 'owner') {
                                user.profile = { user_id: user.id, total_acres: 0, land_locations: [], land_types: [], ownership_documents_url: '' };
                              } else if (newRole === 'farmer') {
                                user.profile = { user_id: user.id, specialization: [], past_projects: [], project_proposals: [] };
                              }
                            }
                          }}
                          className="px-3 py-1 bg-brand-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest focus:outline-none cursor-pointer border-none appearance-none"
                        >
                          <option value="investor">Investor</option>
                          <option value="owner">Landowner</option>
                          <option value="farmer">Farmer</option>
                        </select>
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
                          user?.verification_status === 'verified' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                          user?.verification_status === 'pending' ? "bg-amber-50 text-amber-600 border border-amber-100" : 
                          "bg-slate-50 text-slate-400 border border-slate-200"
                        )}>
                          {user?.verification_status === 'verified' ? <ShieldCheck className="w-3 h-3" /> : 
                           user?.verification_status === 'pending' ? <Clock className="w-3 h-3" /> : 
                           <ShieldAlert className="w-3 h-3" />}
                          {user?.verification_status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Professional Bio</label>
                      <textarea 
                        value={user?.bio}
                        onChange={e => setUser(user ? {...user, bio: e.target.value} : null)}
                        rows={4}
                        className="w-full bg-ui-surface border border-ui-border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-brand-600 transition-colors"
                        placeholder="Describe your background and goals..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Experience (Years)</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number"
                          value={user?.experience_years}
                          onChange={e => setUser(user ? {...user, experience_years: parseInt(e.target.value) || 0} : null)}
                          className="w-24 bg-ui-surface border border-ui-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-brand-600"
                        />
                        <span className="text-xs text-slate-500 font-medium">Years in the agricultural sector</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Account Role</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['investor', 'owner', 'farmer'].map((r) => (
                          <button
                            key={r}
                            onClick={() => setUser(user ? {...user, role: r as any} : null)}
                            className={cn(
                              "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                              user?.role === r ? "bg-brand-900 text-white border-brand-900 shadow-lg" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                            )}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-[10px] text-slate-400 leading-relaxed italic">
                        Changing your role will update the profile fields available to you.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'role_specific' && (
              <motion.div 
                key="role_specific"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {user?.role === 'investor' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Preferred Project Stages</label>
                        <div className="flex flex-wrap gap-2">
                          {['Seed', 'Growth', 'Mature'].map(stage => (
                            <button
                              key={stage}
                              onClick={() => updateProfile({ preferred_stages: toggleItem((user.profile as InvestorProfile).preferred_stages, stage) })}
                              className={cn(
                                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                                (user.profile as InvestorProfile).preferred_stages.includes(stage) ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                              )}
                            >
                              {stage}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Min Development Potential</label>
                        <div className="flex gap-2">
                          {['Low', 'Medium', 'High'].map(level => (
                            <button
                              key={level}
                              onClick={() => updateProfile({ min_development_potential: level })}
                              className={cn(
                                "flex-grow py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                                (user.profile as InvestorProfile).min_development_potential === level ? "bg-brand-900 text-white border-brand-900 shadow-lg" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                              )}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Minimum ROI (%)</label>
                        <input 
                          type="range" min="0" max="30" step="0.5"
                          value={(user.profile as InvestorProfile).min_roi}
                          onChange={e => updateProfile({ min_roi: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-xs font-bold text-brand-950">Target: {(user.profile as InvestorProfile).min_roi}%</span>
                          <span className="text-xs text-slate-400">30% Max</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Risk Tolerance</label>
                        <div className="flex gap-2">
                          {['Low', 'Medium', 'High'].map(level => (
                            <button
                              key={level}
                              onClick={() => updateProfile({ max_risk: level })}
                              className={cn(
                                "flex-grow py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                                (user.profile as InvestorProfile).max_risk === level ? "bg-brand-900 text-white border-brand-900 shadow-lg" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                              )}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Min Historical Yield (%)</label>
                      <input 
                        type="range" min="0" max="20" step="0.5"
                        value={(user.profile as InvestorProfile).min_historical_yield}
                        onChange={e => updateProfile({ min_historical_yield: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs font-bold text-brand-950">Target: {(user.profile as InvestorProfile).min_historical_yield}%</span>
                        <span className="text-xs text-slate-400">20% Max</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Investment History</label>
                      <div className="space-y-3">
                        {(user.profile as InvestorProfile).investment_history?.map((hist, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-ui-surface rounded-xl border border-ui-border">
                            <History className="w-4 h-4 text-brand-600" />
                            <span className="text-sm text-brand-950 font-medium">{hist}</span>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const val = prompt("Enter past investment detail:");
                            if (val) updateProfile({ investment_history: [...((user.profile as InvestorProfile).investment_history || []), val] });
                          }}
                          className="w-full py-4 border-2 border-dashed border-ui-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand-300 hover:text-brand-600 transition-all"
                        >
                          + Add Past Investment
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Preferred Sectors</label>
                        <div className="flex flex-wrap gap-2">
                          {sectors.map(s => (
                            <button
                              key={s}
                              onClick={() => updateProfile({ preferred_sectors: toggleItem((user.profile as InvestorProfile).preferred_sectors, s) })}
                              className={cn(
                                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                                (user.profile as InvestorProfile).preferred_sectors.includes(s) ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Preferred Locations</label>
                        <div className="flex flex-wrap gap-2">
                          {locations.map(l => (
                            <button
                              key={l}
                              onClick={() => updateProfile({ preferred_locations: toggleItem((user.profile as InvestorProfile).preferred_locations, l) })}
                              className={cn(
                                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                                (user.profile as InvestorProfile).preferred_locations.includes(l) ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                              )}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'owner' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Total Land Area (Acres)</label>
                        <div className="relative">
                          <LandPlot className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input 
                            type="number"
                            value={(user.profile as LandownerProfile).total_acres}
                            onChange={e => updateProfile({ total_acres: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-ui-surface border border-ui-border rounded-2xl pl-12 pr-6 py-4 text-lg font-black focus:outline-none focus:border-brand-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Ownership Documents</label>
                        <div className="p-6 border-2 border-dashed border-ui-border rounded-2xl bg-ui-surface flex flex-col items-center justify-center text-center">
                          <FileText className="w-8 h-8 text-slate-300 mb-3" />
                          <p className="text-xs text-slate-500 font-medium mb-4">Upload verified land titles or lease agreements.</p>
                          <button className="px-6 py-2 bg-white border border-ui-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Browse Files
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Land Types Owned</label>
                        <div className="flex flex-wrap gap-2">
                          {landTypes.map(t => (
                            <button
                              key={t}
                              onClick={() => updateProfile({ land_types: toggleItem((user.profile as LandownerProfile).land_types, t) })}
                              className={cn(
                                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                                (user.profile as LandownerProfile).land_types.includes(t) ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Land Locations</label>
                        <div className="flex flex-wrap gap-2">
                          {locations.map(l => (
                            <button
                              key={l}
                              onClick={() => updateProfile({ land_locations: toggleItem((user.profile as LandownerProfile).land_locations, l) })}
                              className={cn(
                                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                                (user.profile as LandownerProfile).land_locations.includes(l) ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                              )}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'farmer' && (
                  <div className="space-y-10">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Specializations</label>
                      <div className="flex flex-wrap gap-2">
                        {sectors.map(s => (
                          <button
                            key={s}
                            onClick={() => updateProfile({ specialization: toggleItem((user.profile as FarmerProfile).specialization, s) })}
                            className={cn(
                              "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                              (user.profile as FarmerProfile).specialization.includes(s) ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-white text-slate-500 border-ui-border hover:border-brand-200"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Project Proposals</label>
                        <div className="space-y-4">
                          {(user.profile as FarmerProfile).project_proposals?.map((prop, i) => (
                            <div key={i} className="p-5 bg-ui-surface rounded-2xl border border-ui-border group relative">
                              <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="w-4 h-4 text-brand-600" />
                                <h5 className="text-xs font-bold text-brand-950">Proposal #{i+1}</h5>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{prop}</p>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const val = prompt("Enter your project proposal summary:");
                              if (val) updateProfile({ project_proposals: [...((user.profile as FarmerProfile).project_proposals || []), val] });
                            }}
                            className="w-full py-4 border-2 border-dashed border-ui-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand-300 hover:text-brand-600 transition-all"
                          >
                            + Draft New Proposal
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Past Projects</label>
                        <div className="space-y-4">
                          {(user.profile as FarmerProfile).past_projects?.map((proj, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-ui-surface rounded-2xl border border-ui-border">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Briefcase className="w-5 h-5 text-brand-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-brand-950">{proj}</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Completed Project</p>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const val = prompt("Enter past project name:");
                              if (val) updateProfile({ past_projects: [...((user.profile as FarmerProfile).past_projects || []), val] });
                            }}
                            className="w-full py-4 border-2 border-dashed border-ui-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-brand-300 hover:text-brand-600 transition-all"
                          >
                            + Add Past Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSubTab === 'verification' && (
              <motion.div 
                key="verification"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="p-8 bg-ui-surface rounded-[32px] border border-ui-border">
                  <div className="flex items-center gap-6 mb-8">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                      user?.verification_status === 'verified' ? "bg-emerald-600 text-white" : 
                      user?.verification_status === 'pending' ? "bg-amber-500 text-white" : 
                      "bg-slate-200 text-slate-500"
                    )}>
                      {user?.verification_status === 'verified' ? <ShieldCheck className="w-8 h-8" /> : 
                       user?.verification_status === 'pending' ? <Clock className="w-8 h-8" /> : 
                       <ShieldAlert className="w-8 h-8" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-brand-950 tracking-tight">Verification <span className="text-brand-600">Status</span></h4>
                      <p className="text-xs text-slate-500 font-medium">Your current status is: <span className="font-bold uppercase text-brand-900">{user?.verification_status}</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-ui-border shadow-sm">
                      <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                        <FileSearch className="w-5 h-5" />
                      </div>
                      <h5 className="text-xs font-bold text-brand-950 mb-2">Identity Proof</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Valid CNIC or Passport required for all users.</p>
                      <button className="text-[10px] font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Upload <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-ui-border shadow-sm">
                      <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h5 className="text-xs font-bold text-brand-950 mb-2">Address Verification</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Utility bill or bank statement from the last 3 months.</p>
                      <button className="text-[10px] font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Upload <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-ui-border shadow-sm">
                      <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                        <Gavel className="w-5 h-5" />
                      </div>
                      <h5 className="text-xs font-bold text-brand-950 mb-2">Legal Documents</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Tax registration or business license (if applicable).</p>
                      <button className="text-[10px] font-bold text-brand-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Upload <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-950 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black mb-4 tracking-tight">Agriwise <span className="text-brand-400">Trust Protocol</span></h4>
                    <p className="text-sm text-brand-300 leading-relaxed mb-8 max-w-2xl">
                      Our verification process ensures that every participant on the platform is authentic. Verified users gain access to higher investment limits, priority dispute resolution, and exclusive land listings.
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-widest">Enhanced Security</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-widest">Priority Support</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-widest">Verified Badge</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Takaful = ({ formatCurrency }: { formatCurrency: (a: number) => string }) => {
  const [pools, setPools] = useState<TakafulPool[]>([]);
  const [contributions, setContributions] = useState<TakafulContribution[]>([]);
  const [claims, setClaims] = useState<TakafulClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pools' | 'my_participation' | 'claims'>('pools');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poolsRes, contRes, claimsRes] = await Promise.all([
          fetch('/api/takaful/pools'),
          fetch('/api/takaful/my-contributions/1'),
          fetch('/api/takaful/my-claims/1')
        ]);
        
        const [poolsData, contData, claimsData] = await Promise.all([
          poolsRes.json(),
          contRes.json(),
          claimsRes.json()
        ]);

        setPools(poolsData);
        setContributions(contData);
        setClaims(claimsData);
      } catch (error) {
        console.error("Error fetching Takaful data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClaim = async () => {
    const poolId = prompt("Enter Pool ID:");
    const amount = prompt("Enter Amount Requested:");
    const reason = prompt("Enter Reason for Claim:");
    
    if (poolId && amount && reason) {
      try {
        const res = await fetch('/api/takaful/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 1,
            pool_id: parseInt(poolId),
            amount_requested: parseFloat(amount),
            reason
          })
        });
        if (res.ok) {
          alert("Claim submitted successfully for review.");
          // Refresh claims
          const claimsRes = await fetch('/api/takaful/my-claims/1');
          setClaims(await claimsRes.json());
        }
      } catch (error) {
        console.error("Error submitting claim:", error);
      }
    }
  };

  return (
    <div className="py-24 bg-ui-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-emerald-50 text-emerald-700 mb-4 border border-emerald-100">
            Ethical Protection
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-black text-brand-950 mb-4 tracking-tight">
            Shariah <span className="text-brand-600">Takaful</span> Mechanism
          </h2>
          <p className="text-slate-500 max-w-2xl font-medium">
            A cooperative risk-sharing model based on the principles of brotherhood (Ukhuwah) and mutual assistance (Ta'awun). Protect your agricultural investments through our community-governed pools.
          </p>
        </div>

        <div className="flex gap-4 mb-12 border-b border-ui-border pb-4 overflow-x-auto">
          {[
            { id: 'pools', label: 'Available Pools', icon: Layers },
            { id: 'my_participation', label: 'My Participation', icon: ShieldCheck },
            { id: 'claims', label: 'Claims & Resolution', icon: Gavel }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-brand-900 text-white shadow-lg" : "text-slate-400 hover:text-brand-600"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'pools' && (
            <motion.div
              key="pools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {pools.map(pool => (
                <div key={pool.id} className="bg-white p-8 rounded-[32px] border border-ui-border shadow-sm hover:border-brand-500 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-brand-950 mb-2 group-hover:text-brand-600 transition-colors">{pool.name}</h4>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">{pool.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Type</span>
                      <span className="text-xs font-bold text-brand-950">{pool.risk_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contribution</span>
                      <span className="text-xs font-bold text-emerald-600">{pool.contribution_rate}% of Investment</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Fund</span>
                      <span className="text-xs font-bold text-brand-950">{formatCurrency(pool.total_fund)}</span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-brand-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-lg shadow-brand-900/10">
                    Join Pool
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'my_participation' && (
            <motion.div
              key="participation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {contributions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-ui-border">
                  <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">You haven't joined any Takaful pools yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {contributions.map(cont => (
                    <div key={cont.id} className="bg-white p-6 rounded-2xl border border-ui-border flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center border border-brand-100">
                          <History className="w-6 h-6 text-brand-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-brand-950">{cont.pool_name}</h5>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cont.risk_type} Protection</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold text-brand-950">{formatCurrency(cont.amount)}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(cont.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'claims' && (
            <motion.div
              key="claims"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">My Claims History</h4>
                <button 
                  onClick={handleClaim}
                  className="px-6 py-2 bg-brand-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all"
                >
                  File New Claim
                </button>
              </div>

              {claims.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-ui-border">
                  <Gavel className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No claims filed yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {claims.map(claim => (
                    <div key={claim.id} className="bg-white p-8 rounded-[32px] border border-ui-border">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            claim.status === 'approved' ? "bg-emerald-50 text-emerald-600" :
                            claim.status === 'pending' ? "bg-amber-50 text-amber-600" :
                            "bg-rose-50 text-rose-600"
                          )}>
                            {claim.status === 'approved' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-brand-950">{claim.pool_name}</h5>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Claim #{claim.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                            claim.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            claim.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                            {claim.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-ui-surface p-4 rounded-2xl mb-6">
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{claim.reason}"</p>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-ui-border">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                          <p className="text-sm font-mono font-bold text-brand-950">{formatCurrency(claim.amount_requested)}</p>
                        </div>
                        {claim.status === 'approved' && (
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Approved Amount</p>
                            <p className="text-sm font-mono font-bold text-emerald-600">{formatCurrency(claim.amount_approved)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FarmerTools = ({ formatCurrency }: { formatCurrency: (a: number) => string }) => {
  const [activeSubTab, setActiveSubTab] = useState<'soil' | 'crops' | 'weather' | 'brands' | 'logistics'>('soil');
  const [soilRecords, setSoilRecords] = useState<SoilRecord[]>([]);
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [myBrands, setMyBrands] = useState<Brand[]>([]);
  const [partnerships, setPartnerships] = useState<BrandPartnership[]>([]);
  const [logisticsPartners, setLogisticsPartners] = useState<LogisticsPartner[]>([]);
  const [logisticsPartnerships, setLogisticsPartnerships] = useState<LogisticsPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState(1);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: '', description: '', website: '', logo_url: '' });
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [soilRes, cropsRes, weatherRes, brandsRes, myBrandsRes, partnershipsRes, logisticsPartnersRes, logisticsPartnershipsRes] = await Promise.all([
          fetch(`/api/land-management/soil/${selectedListingId}`),
          fetch(`/api/land-management/crop-plans/${selectedListingId}`),
          fetch(`/api/weather/Punjab`),
          fetch(`/api/brands`),
          fetch(`/api/brands/my/2`), // Mock user 2 is owner/farmer
          fetch(`/api/brand-partnerships/${selectedListingId}`),
          fetch(`/api/logistics-partners`),
          fetch(`/api/logistics-partnerships/${selectedListingId}`)
        ]);
        setSoilRecords(await soilRes.json());
        setCropPlans(await cropsRes.json());
        const weatherData = await weatherRes.json();
        setWeather(weatherData.forecast);
        setBrands(await brandsRes.json());
        setMyBrands(await myBrandsRes.json());
        setPartnerships(await partnershipsRes.json());
        setLogisticsPartners(await logisticsPartnersRes.json());
        setLogisticsPartnerships(await logisticsPartnershipsRes.json());
      } catch (error) {
        console.error("Failed to fetch farmer tools data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedListingId]);

  const handleCreateBrand = async () => {
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBrand, owner_id: 2 })
      });
      if (res.ok) {
        const data = await res.json();
        setMyBrands([...myBrands, { ...newBrand, id: data.id, owner_id: 2, status: 'active', created_at: new Date().toISOString() } as Brand]);
        setCreateSuccess(true);
        setTimeout(() => {
          setShowBrandModal(false);
          setCreateSuccess(false);
          setNewBrand({ name: '', description: '', website: '', logo_url: '' });
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to create brand:", error);
    }
  };

  const handleRequestPartnership = async (brandId: number) => {
    try {
      const res = await fetch('/api/brand-partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brandId, listing_id: selectedListingId })
      });
      if (res.ok) {
        const brand = brands.find(b => b.id === brandId);
        setPartnerships([...partnerships, { 
          brand_id: brandId, 
          listing_id: selectedListingId, 
          status: 'pending', 
          brand_name: brand?.name, 
          brand_logo: brand?.logo_url,
          created_at: new Date().toISOString() 
        } as BrandPartnership]);
      }
    } catch (error) {
      console.error("Failed to request partnership:", error);
    }
  };

  const handleRequestLogistics = async (partnerId: number) => {
    try {
      const res = await fetch('/api/logistics-partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id: partnerId, listing_id: selectedListingId })
      });
      if (res.ok) {
        const partner = logisticsPartners.find(p => p.id === partnerId);
        setLogisticsPartnerships([...logisticsPartnerships, { 
          partner_id: partnerId, 
          listing_id: selectedListingId, 
          status: 'pending', 
          partner_name: partner?.name, 
          partner_logo: partner?.logo_url,
          service_type: partner?.service_type,
          created_at: new Date().toISOString() 
        } as LogisticsPartnership]);
      }
    } catch (error) {
      console.error("Failed to request logistics partnership:", error);
    }
  };

  return (
    <div className="py-24 bg-ui-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-50 text-brand-700 mb-4 border border-brand-100">
            Farmer Infrastructure
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-black text-brand-950 mb-4 tracking-tight">
            Land <span className="text-brand-600">Management</span> Tools
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl">
            Precision tools for modern agriculture. Monitor soil health, plan crop rotations, and stay ahead of weather patterns.
          </p>
        </div>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
          {[
            { id: 'soil', label: 'Soil Health', icon: Activity },
            { id: 'crops', label: 'Crop Rotation', icon: Sprout },
            { id: 'weather', label: 'Weather Forecast', icon: Waves },
            { id: 'brands', label: 'Brands & Partnerships', icon: Award },
            { id: 'logistics', label: 'Logistics', icon: Truck }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                activeSubTab === tab.id 
                  ? "bg-brand-900 text-white border-brand-900 shadow-xl shadow-brand-900/20" 
                  : "bg-white text-slate-400 border-ui-border hover:border-brand-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-white h-64 rounded-[40px] border border-ui-border" />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeSubTab === 'soil' && (
              <motion.div
                key="soil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-brand-950">Nutrient Levels</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-brand-600" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nitrogen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-vibrant-amber" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phosphorus</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={soilRecords.slice().reverse()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="recorded_at" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                            tickFormatter={(val) => new Date(val).toLocaleDateString()}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="nitrogen" stroke="#1e293b" strokeWidth={3} dot={{ r: 4, fill: '#1e293b' }} />
                          <Line type="monotone" dataKey="phosphorus" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-ui-border">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Soil pH Balance</h5>
                      <div className="flex items-end gap-4">
                        <p className="text-5xl font-black text-brand-950">{soilRecords[0]?.ph || 'N/A'}</p>
                        <div className="mb-2">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[8px] font-bold uppercase tracking-widest border border-emerald-100">Optimal</span>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500 font-medium">Your soil pH is within the ideal range for wheat and cotton rotation.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-ui-border">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Moisture Content</h5>
                      <div className="flex items-end gap-4">
                        <p className="text-5xl font-black text-brand-600">{soilRecords[0]?.moisture || 'N/A'}%</p>
                        <div className="mb-2 text-brand-500">
                          <Waves className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500 font-medium">Moisture levels are stable. Next irrigation cycle recommended in 3 days.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-brand-950 p-10 rounded-[48px] text-white shadow-2xl">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-8">Recent Soil Tests</h4>
                    <div className="space-y-6">
                      {soilRecords.map(record => (
                        <div key={record.id} className="flex justify-between items-center pb-6 border-b border-white/10 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-bold">{new Date(record.recorded_at).toLocaleDateString()}</p>
                            <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Standard Audit</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono font-bold">pH {record.ph}</p>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Healthy</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                      Request New Audit
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'crops' && (
              <motion.div
                key="crops"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm">
                  <div className="flex items-center justify-between mb-12">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-brand-950">Rotation Timeline</h4>
                    <button className="px-6 py-2 bg-brand-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all">
                      Add New Plan
                    </button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100" />
                    <div className="space-y-12">
                      {cropPlans.map((plan, idx) => (
                        <div key={plan.id} className="relative pl-24">
                          <div className={cn(
                            "absolute left-6 top-0 w-4 h-4 rounded-full border-4 border-white shadow-md z-10",
                            plan.status === 'active' ? "bg-brand-600 scale-125" : "bg-slate-300"
                          )} />
                          <div className="bg-ui-surface p-8 rounded-[32px] border border-ui-border group hover:border-brand-300 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h5 className="text-xl font-black text-brand-950">{plan.crop_name}</h5>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border",
                                    plan.status === 'active' ? "bg-brand-50 text-brand-600 border-brand-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                  )}>
                                    {plan.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{plan.season} • {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-4">
                                <div className="text-center px-6 py-3 bg-white rounded-2xl border border-ui-border">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Yield</p>
                                  <p className="text-sm font-black text-brand-950">8.5 Tons/AC</p>
                                </div>
                                <div className="text-center px-6 py-3 bg-white rounded-2xl border border-ui-border">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Level</p>
                                  <p className="text-sm font-black text-emerald-600">Low</p>
                                </div>
                              </div>
                            </div>
                            {plan.notes && (
                              <div className="mt-6 pt-6 border-t border-ui-border">
                                <p className="text-xs text-slate-500 leading-relaxed italic">"{plan.notes}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'weather' && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-8"
              >
                <div className="lg:col-span-1">
                  <div className="bg-brand-900 p-10 rounded-[48px] text-white shadow-2xl h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-8">
                        <MapPin className="w-4 h-4 text-brand-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Punjab, Pakistan</span>
                      </div>
                      <div className="mb-12">
                        <p className="text-7xl font-black mb-4">{weather[0]?.temp}°</p>
                        <p className="text-xl font-bold">{weather[0]?.condition}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-4 border-t border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Humidity</span>
                        <span className="text-sm font-bold">{weather[0]?.humidity}%</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-t border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Wind Speed</span>
                        <span className="text-sm font-bold">12 km/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm h-full">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-brand-950 mb-12">5-Day Forecast</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      {weather.map((day, i) => (
                        <div key={i} className="bg-ui-surface p-6 rounded-3xl border border-ui-border text-center group hover:border-brand-500 transition-all">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-brand-900 group-hover:text-white transition-all">
                            {day.condition.includes('Sunny') ? <Zap className="w-6 h-6" /> : <Waves className="w-6 h-6" />}
                          </div>
                          <p className="text-2xl font-black text-brand-950 mb-1">{day.temp}°</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day.condition}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-12 p-8 bg-brand-50 rounded-[32px] border border-brand-100 flex items-center gap-6">
                      <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <AlertTriangle className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-brand-950 mb-1">Weather Advisory</h5>
                        <p className="text-xs text-brand-700 font-medium">Light showers expected on March 7th. Adjust irrigation schedules accordingly to prevent waterlogging.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-brand-950">My Brands</h4>
                        <button 
                          onClick={() => setShowBrandModal(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-brand-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-lg shadow-brand-900/20"
                        >
                          <Plus className="w-4 h-4" />
                          Create New Brand
                        </button>
                      </div>

                      {myBrands.length === 0 ? (
                        <div className="text-center py-16 bg-ui-surface rounded-[32px] border border-dashed border-ui-border">
                          <Store className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 font-medium">You haven't created any brands yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {myBrands.map(brand => (
                            <div key={brand.id} className="bg-ui-surface p-6 rounded-[32px] border border-ui-border group hover:border-brand-300 transition-all">
                              <div className="flex items-center gap-4 mb-4">
                                <img src={brand.logo_url} alt={brand.name} className="w-12 h-12 rounded-xl object-cover border border-ui-border" referrerPolicy="no-referrer" />
                                <div>
                                  <h5 className="text-sm font-bold text-brand-950">{brand.name}</h5>
                                  <p className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">{brand.status}</p>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{brand.description}</p>
                              <div className="flex items-center justify-between pt-4 border-t border-ui-border">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                  Created {new Date(brand.created_at).toLocaleDateString()}
                                </span>
                                <button className="text-brand-600 text-[9px] font-bold uppercase tracking-widest hover:underline">
                                  Manage Brand
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-brand-950 mb-10">Brand Partnerships</h4>
                      {partnerships.length === 0 ? (
                        <div className="text-center py-16 bg-ui-surface rounded-[32px] border border-dashed border-ui-border">
                          <Handshake className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 font-medium">No active partnerships for this land.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {partnerships.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-6 bg-ui-surface rounded-[24px] border border-ui-border">
                              <div className="flex items-center gap-4">
                                <img src={p.brand_logo} alt={p.brand_name} className="w-10 h-10 rounded-lg object-cover border border-ui-border" referrerPolicy="no-referrer" />
                                <div>
                                  <h5 className="text-xs font-bold text-brand-950">{p.brand_name}</h5>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Partnership #{p.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest border",
                                  p.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                )}>
                                  {p.status}
                                </span>
                                <button className="text-slate-400 hover:text-rose-600 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-brand-950 p-10 rounded-[48px] text-white shadow-2xl">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-8">Available Brands</h4>
                      <div className="space-y-6">
                        {brands.filter(b => !myBrands.some(mb => mb.id === b.id)).map(brand => (
                          <div key={brand.id} className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4 mb-3">
                              <img src={brand.logo_url} alt={brand.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
                              <div>
                                <h5 className="text-xs font-bold">{brand.name}</h5>
                                <p className="text-[9px] text-brand-500 font-bold uppercase tracking-widest">Global Partner</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mb-4">{brand.description}</p>
                            <button 
                              onClick={() => handleRequestPartnership(brand.id)}
                              disabled={partnerships.some(p => p.brand_id === brand.id)}
                              className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all"
                            >
                              {partnerships.some(p => p.brand_id === brand.id) ? 'Request Sent' : 'Request Partnership'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {showBrandModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-950/40 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white w-full max-w-lg rounded-[48px] p-10 shadow-2xl border border-ui-border"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-brand-950 tracking-tight">Create Your <span className="text-brand-600">Brand</span></h3>
                        <button onClick={() => setShowBrandModal(false)} className="p-2 hover:bg-ui-surface rounded-full transition-colors">
                          <X className="w-6 h-6 text-slate-400" />
                        </button>
                      </div>
                      
                      {createSuccess ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-20 text-center"
                        >
                          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <h4 className="text-xl font-black text-brand-950 mb-2">Brand Created!</h4>
                          <p className="text-slate-500 font-medium">Your new agricultural brand has been launched successfully.</p>
                        </motion.div>
                      ) : (
                        <>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Brand Name</label>
                              <input 
                                type="text" 
                                value={newBrand.name}
                                onChange={e => setNewBrand({...newBrand, name: e.target.value})}
                                className="w-full px-6 py-4 bg-ui-surface border border-ui-border rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all"
                                placeholder="e.g. Indus Valley Gold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                              <textarea 
                                value={newBrand.description}
                                onChange={e => setNewBrand({...newBrand, description: e.target.value})}
                                className="w-full px-6 py-4 bg-ui-surface border border-ui-border rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all h-32 resize-none"
                                placeholder="Tell the story of your brand..."
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Website</label>
                                <input 
                                  type="text" 
                                  value={newBrand.website}
                                  onChange={e => setNewBrand({...newBrand, website: e.target.value})}
                                  className="w-full px-6 py-4 bg-ui-surface border border-ui-border rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all"
                                  placeholder="https://..."
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Logo URL</label>
                                <input 
                                  type="text" 
                                  value={newBrand.logo_url}
                                  onChange={e => setNewBrand({...newBrand, logo_url: e.target.value})}
                                  className="w-full px-6 py-4 bg-ui-surface border border-ui-border rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={handleCreateBrand}
                            className="w-full mt-10 py-5 bg-brand-900 text-white rounded-[24px] text-xs font-bold uppercase tracking-widest hover:bg-brand-950 transition-all shadow-xl shadow-brand-900/20"
                          >
                            Launch Brand
                          </button>
                        </>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSubTab === 'logistics' && (
              <motion.div
                key="logistics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[48px] border border-ui-border shadow-sm">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-brand-950 mb-10">Active Logistics</h4>
                      {logisticsPartnerships.length === 0 ? (
                        <div className="text-center py-16 bg-ui-surface rounded-[32px] border border-dashed border-ui-border">
                          <Truck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 font-medium">No logistics partners connected yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {logisticsPartnerships.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-6 bg-ui-surface rounded-[24px] border border-ui-border">
                              <div className="flex items-center gap-4">
                                <img src={p.partner_logo} alt={p.partner_name} className="w-10 h-10 rounded-lg object-cover border border-ui-border" referrerPolicy="no-referrer" />
                                <div>
                                  <h5 className="text-xs font-bold text-brand-950">{p.partner_name}</h5>
                                  <p className="text-[9px] text-brand-600 font-bold uppercase tracking-widest">{p.service_type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest border",
                                  p.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                )}>
                                  {p.status}
                                </span>
                                <button className="text-slate-400 hover:text-rose-600 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex items-center gap-6">
                      <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <MapPin className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-brand-950 mb-1">Logistics Optimization</h5>
                        <p className="text-xs text-brand-700 font-medium">Based on your current crop rotation, we recommend Cold Chain partners for the upcoming harvest season.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-brand-950 p-10 rounded-[48px] text-white shadow-2xl">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-8">Available Partners</h4>
                      <div className="space-y-6">
                        {logisticsPartners.filter(lp => !logisticsPartnerships.some(p => p.partner_id === lp.id)).map(partner => (
                          <div key={partner.id} className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4 mb-3">
                              <img src={partner.logo_url} alt={partner.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
                              <div>
                                <h5 className="text-xs font-bold">{partner.name}</h5>
                                <p className="text-[9px] text-brand-500 font-bold uppercase tracking-widest">{partner.service_type}</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mb-4">{partner.description}</p>
                            <div className="flex items-center gap-2 mb-4">
                              <MapPin className="w-3 h-3 text-brand-500" />
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{partner.coverage_area} Coverage</span>
                            </div>
                            <button 
                              onClick={() => handleRequestLogistics(partner.id)}
                              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all"
                            >
                              Connect Partner
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currency, setCurrency] = useState<'PKR' | 'USD' | 'EUR'>('USD');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/1');
        const data = await res.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const formatCurrency = (amount: number) => {
    const rates = { PKR: 1, USD: 0.0036, EUR: 0.0033 };
    const symbols = { PKR: 'Rs.', USD: '$', EUR: '€' };
    const converted = amount * rates[currency];
    
    return `${symbols[currency]} ${converted.toLocaleString(undefined, { 
      maximumFractionDigits: currency === 'PKR' ? 0 : 2,
      minimumFractionDigits: currency === 'PKR' ? 0 : 2
    })}`;
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currency={currency} 
        setCurrency={setCurrency}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onExplore={() => setActiveTab('marketplace')} currentUser={currentUser} setActiveTab={setActiveTab} />
              <AboutSection />
              <Services />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AboutSection />
            </motion.div>
          )}
          
          {activeTab === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Marketplace formatCurrency={formatCurrency} />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <InvestorDashboard formatCurrency={formatCurrency} />
            </motion.div>
          )}

          {activeTab === 'land_management' && (
            <motion.div
              key="land_management"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LandownerDashboard formatCurrency={formatCurrency} setActiveTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Community />
            </motion.div>
          )}

          {activeTab === 'exchange' && (
            <motion.div
              key="exchange"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LiveExchange formatCurrency={formatCurrency} />
            </motion.div>
          )}

          {activeTab === 'takaful' && (
            <motion.div
              key="takaful"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Takaful formatCurrency={formatCurrency} />
            </motion.div>
          )}

          {activeTab === 'crowdfunding' && (
            <motion.div
              key="crowdfunding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CrowdfundingConcept formatCurrency={formatCurrency} />
            </motion.div>
          )}

          {activeTab === 'analyzer' && (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <InvestmentAnalyzer />
            </motion.div>
          )}

          {activeTab === 'disputes' && (
            <motion.div
              key="disputes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DisputeModule />
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Services />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <UserProfileManagement currentUser={currentUser} setCurrentUser={setCurrentUser} />
            </motion.div>
          )}

          {activeTab === 'farmer_tools' && (
            <motion.div
              key="farmer_tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FarmerTools formatCurrency={formatCurrency} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Zap, 
  LayoutDashboard, 
  Layers, 
  Users, 
  Target, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

import { OverviewView } from './views/OverviewView';
import { ProjectsKanbanView } from './views/ProjectsKanbanView';
import { CrmPipelineView } from './views/CrmPipelineView';
import { TrafficAnalyticsView } from './views/TrafficAnalyticsView';
import { FinancialDreView } from './views/FinancialDreView';
import { AutomatedReportsView } from './views/AutomatedReportsView';
import { TeamPermissionsView } from './views/TeamPermissionsView';
import { SecurityAuditView } from './views/SecurityAuditView';

interface DashboardLayoutProps {
  onReturnToLanding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onReturnToLanding }) => {
  const { currentUser, agency, logout, loginDemo, isCeo } = useAuth();
  const { notifications, markNotificationAsRead } = useData();

  const [currentView, setCurrentView] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard, permission: true },
    { id: 'projects', label: 'Projetos & Criativos', icon: Layers, permission: currentUser?.permissions.canManageProjects },
    { id: 'crm', label: 'CRM & Maps Scraper', icon: Users, permission: currentUser?.permissions.canManageCrm },
    { id: 'traffic', label: 'Tráfego & Analytics', icon: Target, permission: currentUser?.permissions.canViewTraffic },
    { id: 'financial', label: 'Financeiro & DRE', icon: DollarSign, permission: currentUser?.permissions.canViewFinancial },
    { id: 'reports', label: 'Relatórios Automáticos', icon: FileText, permission: currentUser?.permissions.canExportReports },
    { id: 'team', label: 'Equipe & Permissões', icon: ShieldCheck, permission: true },
    { id: 'security', label: 'Segurança & Auditoria', icon: Lock, permission: true },
  ];

  const handleSelectNav = (viewId: string) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  const handleSwitchRole = (role: UserRole) => {
    loginDemo(role);
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111114] border-b border-zinc-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black">
            <Zap className="w-4 h-4 fill-zinc-950" />
          </div>
          <span className="font-bold text-sm text-white">AgencyOS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-zinc-400 hover:text-white relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between
        transition-transform duration-200 md:translate-x-0 md:static
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Branding */}
        <div className="p-5 border-b border-zinc-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black shadow-sm">
              <Zap className="w-4 h-4 fill-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">AgencyOS</span>
                <span className="text-[10px] font-mono px-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">v2.6</span>
              </div>
              <div className="text-[10px] text-zinc-500">por Techify • {agency.name}</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Módulos Operacionais
          </div>

          {navItems.map(item => {
            if (!item.permission) return null;
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Agency Bottom Status Card */}
        <div className="p-4 border-t border-zinc-800/70 space-y-3 bg-[#0a0a0d]">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span>{agency.name}</span>
              <span className="text-emerald-400 font-bold uppercase">{agency.plan}</span>
            </div>
            <div className="text-sm font-bold text-white">
              R$ {agency.mrr.toLocaleString('pt-BR')} <span className="text-[10px] font-normal text-zinc-400">MRR</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Firestore Sync Online</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={onReturnToLanding}
              className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <ExternalLink className="w-3 h-3" />
              Página Inicial
            </button>
            <button
              onClick={logout}
              className="text-zinc-400 hover:text-red-400 flex items-center gap-1 text-[11px]"
            >
              <LogOut className="w-3 h-3" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-[#0a0a0d] border-b border-zinc-800/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              AGENCYOS / {navItems.find(n => n.id === currentView)?.label.toUpperCase()}
            </span>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sincronização Ativa em Tempo Real</span>
            </div>
          </div>

          {/* User Controls & Quick Role Switcher */}
          <div className="flex items-center gap-4">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1 text-xs text-zinc-300">
                <span className="text-zinc-500 text-[10px] uppercase font-mono">Cargo Atual:</span>
                <span className="font-bold text-white capitalize">{currentUser?.role.replace('_', ' ')}</span>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1 hover:text-white transition"
                  title="Simular outro papel da agência"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Role Switcher Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#121215] border border-zinc-800 rounded-xl p-2 shadow-2xl z-50 text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] text-zinc-500 font-mono uppercase">
                    Alternar Papel (Teste RBAC):
                  </div>
                  <button
                    onClick={() => handleSwitchRole('ceo')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-800 flex items-center justify-between text-zinc-300 hover:text-white"
                  >
                    <span>👑 CEO / Administrador</span>
                    {currentUser?.role === 'ceo' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('traffic_manager')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-800 flex items-center justify-between text-zinc-300 hover:text-white"
                  >
                    <span>📊 Gestor de Tráfego</span>
                    {currentUser?.role === 'traffic_manager' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('designer')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-800 flex items-center justify-between text-zinc-300 hover:text-white"
                  >
                    <span>🎨 Designer Criativo</span>
                    {currentUser?.role === 'designer' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('sdr')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-800 flex items-center justify-between text-zinc-300 hover:text-white"
                  >
                    <span>💼 Comercial / SDR</span>
                    {currentUser?.role === 'sdr' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  
                  <div className="pt-2 border-t border-zinc-800/80">
                    <button
                      onClick={logout}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3 h-3" />
                      Desconectar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="btn-topbar-notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-zinc-950 font-bold text-[9px] flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#121215] border border-zinc-800 rounded-xl p-3 shadow-2xl z-50 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white text-xs">Notificações Críticas</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{unreadNotifications.length} novas</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-lg border transition cursor-pointer ${
                          !n.read 
                            ? 'bg-zinc-900/90 border-zinc-700/80 text-white' 
                            : 'bg-zinc-900/30 border-transparent text-zinc-400'
                        }`}
                      >
                        <div className="font-bold text-xs">{n.title}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{n.message}</div>
                        <div className="text-[9px] text-zinc-500 mt-1">{n.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                {currentUser?.displayName.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white">{currentUser?.displayName}</div>
                <div className="text-[10px] text-zinc-500">{currentUser?.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* View Content Renderer */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentView === 'overview' && <OverviewView onNavigate={setCurrentView} />}
          {currentView === 'projects' && <ProjectsKanbanView />}
          {currentView === 'crm' && <CrmPipelineView />}
          {currentView === 'traffic' && <TrafficAnalyticsView />}
          {currentView === 'financial' && <FinancialDreView />}
          {currentView === 'reports' && <AutomatedReportsView />}
          {currentView === 'team' && <TeamPermissionsView />}
          {currentView === 'security' && <SecurityAuditView />}
        </main>
      </div>
    </div>
  );
};

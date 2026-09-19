import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ProjectTask, 
  LeadCRM, 
  Invoice, 
  DREItem, 
  TrafficCampaign, 
  ActivityLog, 
  NotificationItem,
  TaskStatus,
  LeadStage
} from '../types';
import { 
  INITIAL_TASKS, 
  INITIAL_LEADS, 
  INITIAL_INVOICES, 
  INITIAL_DRE_ITEMS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { useAuth } from './AuthContext';

interface DataContextType {
  tasks: ProjectTask[];
  leads: LeadCRM[];
  invoices: Invoice[];
  dreItems: DREItem[];
  campaigns: TrafficCampaign[];
  logs: ActivityLog[];
  notifications: NotificationItem[];
  isRealtimeActive: boolean;
  addTask: (task: Omit<ProjectTask, 'id' | 'createdAt' | 'completedDeliverables'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  addLead: (lead: Omit<LeadCRM, 'id' | 'createdAt'>) => void;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  deleteLead: (leadId: string) => void;
  importScrapedLeads: (newLeads: Array<Omit<LeadCRM, 'id' | 'createdAt'>>) => number;
  addInvoice: (inv: Omit<Invoice, 'id'>) => void;
  markInvoiceAsPaid: (invoiceId: string) => void;
  deleteInvoice: (invoiceId: string) => void;
  addDreItem: (item: { category: string; description: string; amount: number; isExpense: boolean; month?: string }) => void;
  addCampaign: (campaign: Omit<TrafficCampaign, 'id'>) => void;
  updateCampaignStatus: (campaignId: string, status: 'active' | 'paused') => void;
  updateCampaignBudget: (campaignId: string, dailyBudget: number) => void;
  updateCampaign: (campaignId: string, changes: Partial<TrafficCampaign>) => void;
  addActivityLog: (action: string, details: string) => void;
  markNotificationAsRead: (id: string) => void;
  calculateDRE: () => {
    grossRevenue: number;
    taxes: number;
    netRevenue: number;
    mediaCost: number;
    softwareCost: number;
    payrollCost: number;
    totalCosts: number;
    totalExpenses: number;
    netProfit: number;
    marginPercent: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, agency } = useAuth();
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);

  const [tasks, setTasks] = useState<ProjectTask[]>(() => {
    const saved = localStorage.getItem('agencyos_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [leads, setLeads] = useState<LeadCRM[]>(() => {
    const saved = localStorage.getItem('agencyos_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('agencyos_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [dreItems, setDreItems] = useState<DREItem[]>(() => {
    const saved = localStorage.getItem('agencyos_dre');
    return saved ? JSON.parse(saved) : INITIAL_DRE_ITEMS;
  });

  const [campaigns, setCampaigns] = useState<TrafficCampaign[]>(() => {
    const saved = localStorage.getItem('agencyos_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('agencyos_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('agencyos_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Local storage auto-sync
  useEffect(() => {
    localStorage.setItem('agencyos_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('agencyos_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('agencyos_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('agencyos_dre', JSON.stringify(dreItems));
  }, [dreItems]);

  useEffect(() => {
    localStorage.setItem('agencyos_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('agencyos_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('agencyos_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Real-time Traffic Simulator loop (random subtle delta every 30s)
  useEffect(() => {
    if (!isRealtimeActive) return;

    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(c => {
        if (c.status !== 'active') return c;
        const addClicks = Math.floor(Math.random() * 3);
        const addImpressions = addClicks * (Math.floor(Math.random() * 20) + 10);
        const addSpend = +(addClicks * (c.cpc || 1.8)).toFixed(2);
        const addConversions = Math.random() > 0.85 ? 1 : 0;

        const newSpend = +(c.spend + addSpend).toFixed(2);
        const newClicks = c.clicks + addClicks;
        const newImpressions = c.impressions + addImpressions;
        const newConversions = c.conversions + addConversions;

        const newCtr = newImpressions > 0 ? +((newClicks / newImpressions) * 100).toFixed(2) : c.ctr;
        const newCpc = newClicks > 0 ? +(newSpend / newClicks).toFixed(2) : c.cpc;
        const newCpa = newConversions > 0 ? +(newSpend / newConversions).toFixed(2) : c.cpa;

        return {
          ...c,
          spend: newSpend,
          clicks: newClicks,
          impressions: newImpressions,
          conversions: newConversions,
          ctr: newCtr,
          cpc: newCpc,
          cpa: newCpa,
        };
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [isRealtimeActive]);

  const addActivityLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: 'log_' + Date.now(),
      agencyId: agency.id,
      userId: currentUser?.id || 'sys',
      userName: currentUser?.displayName || 'Sistema',
      userRole: currentUser?.role || 'admin',
      action,
      details,
      ipAddress: '189.40.12.88 (SP/Brasil)',
      timestamp: new Date().toISOString(),
      encryptedChecksum: 'sha256_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addTask = (taskData: Omit<ProjectTask, 'id' | 'createdAt' | 'completedDeliverables'>) => {
    const newTask: ProjectTask = {
      ...taskData,
      id: 'task_' + Date.now(),
      completedDeliverables: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    addActivityLog('Criação de Tarefa', `Criou entrega '${newTask.title}' para o cliente ${newTask.clientName}`);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const completed = status === 'done' ? t.deliverablesCount : t.completedDeliverables;
        return { ...t, status, completedDeliverables: completed };
      }
      return t;
    }));
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      addActivityLog('Atualização de Status', `Moveu card '${target.title}' para etapa: ${status}`);
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    addActivityLog('Exclusão de Tarefa', `Removeu card do projeto #${taskId}`);
  };

  const addLead = (leadData: Omit<LeadCRM, 'id' | 'createdAt'>) => {
    const newLead: LeadCRM = {
      ...leadData,
      id: 'lead_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
    addActivityLog('Novo Lead CRM', `Cadastrou prospect '${newLead.companyName}' (R$ ${newLead.dealValue.toLocaleString('pt-BR')})`);
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l));
    const target = leads.find(l => l.id === leadId);
    if (target) {
      addActivityLog('Avanço no Funil CRM', `Lead '${target.companyName}' avançou para: ${stage}`);
      if (stage === 'won') {
        const notif: NotificationItem = {
          id: 'notif_' + Date.now(),
          agencyId: agency.id,
          type: 'success',
          title: '🎉 Contrato Fechado!',
          message: `O lead ${target.companyName} fechou contrato de R$ ${target.dealValue.toLocaleString('pt-BR')} (MRR: +R$ ${target.expectedMrr.toLocaleString('pt-BR')}/mês).`,
          timestamp: 'Agora mesmo',
          read: false,
        };
        setNotifications(prev => [notif, ...prev]);
      }
    }
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    addActivityLog('Exclusão de Lead', `Removeu lead #${leadId}`);
  };

  const importScrapedLeads = (newLeads: Array<Omit<LeadCRM, 'id' | 'createdAt'>>) => {
    const created: LeadCRM[] = newLeads.map((nl, idx) => ({
      ...nl,
      id: 'lead_scraped_' + Date.now() + '_' + idx,
      createdAt: new Date().toISOString(),
    }));
    setLeads(prev => [...created, ...prev]);
    addActivityLog('Mineração Maps Scraper', `Importou ${created.length} novos leads minerados do Google Maps direto para o CRM`);
    return created.length;
  };

  const addInvoice = (inv: Omit<Invoice, 'id'>) => {
    const invoice: Invoice = {
      ...inv,
      id: 'inv_' + Date.now(),
      invoiceNumber: `FAT-2026-${Math.floor(Math.random() * 900 + 100)}`,
      paymentMethod: 'Pix',
    };
    setInvoices(prev => [invoice, ...prev]);
    addActivityLog('Emissão de Fatura', `Gerou fatura ${invoice.invoiceNumber} para ${invoice.clientName} (R$ ${invoice.amount})`);
  };

  const markInvoiceAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        return {
          ...i,
          status: 'paid',
          paidDate: new Date().toISOString().split('T')[0],
        };
      }
      return i;
    }));
    const target = invoices.find(i => i.id === invoiceId);
    if (target) {
      addActivityLog('Baixa de Pagamento', `Fatura ${target.invoiceNumber} recebida com sucesso (R$ ${target.amount.toLocaleString('pt-BR')})`);
      const notif: NotificationItem = {
        id: 'notif_' + Date.now(),
        agencyId: agency.id,
        type: 'success',
        title: 'Pagamento Confirmado',
        message: `Fatura de R$ ${target.amount.toLocaleString('pt-BR')} do cliente ${target.clientName} liquidada.`,
        timestamp: 'Agora mesmo',
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const deleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(i => i.id !== invoiceId));
    addActivityLog('Cancelamento de Fatura', `Cancelou fatura ${invoiceId}`);
  };

  const addDreItem = (item: { category: string; description: string; amount: number; isExpense: boolean; month?: string }) => {
    const type = item.isExpense ? (item.category === 'payroll' ? 'cost_payroll' : item.category === 'software' ? 'cost_software' : 'tax') : 'revenue';
    const newItem: DREItem = {
      id: 'dre_' + Date.now(),
      category: item.category,
      description: item.description,
      amount: item.amount,
      type: type as any,
      isExpense: item.isExpense,
      month: item.month || '2026-09',
    };
    setDreItems(prev => [newItem, ...prev]);
    addActivityLog('Lançamento DRE', `Adicionou ${item.isExpense ? 'custo' : 'receita'} '${item.description}' de R$ ${item.amount}`);
  };

  const addCampaign = (campData: Omit<TrafficCampaign, 'id'>) => {
    const newCamp: TrafficCampaign = {
      ...campData,
      id: 'camp_' + Date.now(),
      cpc: 1.5,
      ctr: 2.1,
      roas: 4.2,
      cpa: 35.0,
    };
    setCampaigns(prev => [newCamp, ...prev]);
    addActivityLog('Nova Campanha', `Criou campanha de tráfego ${newCamp.name} para ${newCamp.clientName}`);
  };

  const updateCampaignStatus = (campaignId: string, status: 'active' | 'paused') => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status } : c));
    addActivityLog('Status Campanha', `Alterou status da campanha #${campaignId} para ${status}`);
  };

  const updateCampaignBudget = (campaignId: string, dailyBudget: number) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, dailyBudget } : c));
    addActivityLog('Orçamento Diário', `Atualizou orçamento da campanha #${campaignId} para R$ ${dailyBudget}/dia`);
  };

  const updateCampaign = (campaignId: string, changes: Partial<TrafficCampaign>) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, ...changes } : c));
    addActivityLog('Ajuste de Campanha', `Modificou configurações da campanha ${campaignId}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const calculateDRE = () => {
    const grossRevenue = dreItems
      .filter(i => i.type === 'revenue')
      .reduce((acc, i) => acc + i.amount, 0);

    const taxes = dreItems
      .filter(i => i.type === 'tax')
      .reduce((acc, i) => acc + i.amount, 0);

    const netRevenue = grossRevenue - taxes;

    const mediaCost = dreItems
      .filter(i => i.type === 'cost_media')
      .reduce((acc, i) => acc + i.amount, 0);

    const softwareCost = dreItems
      .filter(i => i.type === 'cost_software')
      .reduce((acc, i) => acc + i.amount, 0);

    const payrollCost = dreItems
      .filter(i => i.type === 'cost_payroll')
      .reduce((acc, i) => acc + i.amount, 0);

    const totalCosts = mediaCost + softwareCost + payrollCost + taxes;
    const netProfit = netRevenue - (mediaCost + softwareCost + payrollCost);
    const marginPercent = grossRevenue > 0 ? +((netProfit / grossRevenue) * 100).toFixed(1) : 0;

    return {
      grossRevenue,
      taxes,
      netRevenue,
      mediaCost,
      softwareCost,
      payrollCost,
      totalCosts,
      totalExpenses: totalCosts,
      netProfit,
      marginPercent,
    };
  };

  return (
    <DataContext.Provider value={{
      tasks,
      leads,
      invoices,
      dreItems,
      campaigns,
      logs,
      notifications,
      isRealtimeActive,
      addTask,
      updateTaskStatus,
      deleteTask,
      addLead,
      updateLeadStage,
      deleteLead,
      importScrapedLeads,
      addInvoice,
      markInvoiceAsPaid,
      deleteInvoice,
      addDreItem,
      addCampaign,
      updateCampaignStatus,
      updateCampaignBudget,
      updateCampaign,
      addActivityLog,
      markNotificationAsRead,
      calculateDRE,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export type UserRole = 'ceo' | 'traffic_manager' | 'designer' | 'sdr' | 'financial' | 'copywriter';

export interface UserPermissions {
  canViewFinancial?: boolean;
  canViewFinancials?: boolean;
  canManageProjects?: boolean;
  canEditProjects?: boolean;
  canManageCrm?: boolean;
  canEditCRM?: boolean;
  canViewTraffic: boolean;
  canExportReports: boolean;
  canManageTeam: boolean;
  canManageBilling: boolean;
}

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  agencyId: string;
  agencyName: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  encryptedVaultKey?: string;
  permissions: UserPermissions;
  createdAt: string;
  lastLogin?: string;
}

export type User = AppUser;

export interface Agency {
  id: string;
  name: string;
  cnpjOrTaxId: string;
  plan: 'starter' | 'professional' | 'enterprise' | 'pro';
  billingCycle: 'monthly' | 'annual';
  mrr: number;
  status: 'active' | 'trialing' | 'past_due';
  subscriptionStatus?: string;
  trialEndsAt: string;
  encryptedVaultKey: string;
  logoUrl?: string;
}

export type TaskStatus = 'backlog' | 'briefing' | 'design' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ProjectTask {
  id: string;
  agencyId: string;
  clientName: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string;
  assigneeRole: string;
  dueDate: string;
  channel: 'meta' | 'google' | 'tiktok' | 'branding' | 'seo';
  creativeUrl?: string;
  deliverablesCount: number;
  completedDeliverables: number;
  createdAt: string;
}

export type LeadStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface LeadCRM {
  id: string;
  agencyId: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  stage: LeadStage;
  dealValue: number;
  expectedMrr: number;
  source: 'Meta Ads' | 'Google Search' | 'Indicação' | 'Maps Scraper' | 'Outbound';
  assignedTo: string;
  notes: string;
  tags: string[];
  createdAt: string;
  city?: string;
  rating?: number;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  agencyId: string;
  invoiceNumber?: string;
  clientName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  description: string;
  paymentMethod?: 'Pix' | 'Boleto' | 'Cartão de Crédito';
  pixCode?: string;
  pdfUrl?: string;
  items?: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
}

export interface DREItem {
  id: string;
  category: string;
  type: 'revenue' | 'cost_media' | 'cost_software' | 'cost_payroll' | 'tax';
  amount: number;
  description: string;
  isExpense?: boolean;
  month?: string;
}

export interface TrafficCampaign {
  id: string;
  name: string;
  clientName: string;
  platform: 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'meta' | 'google' | 'tiktok';
  status: 'active' | 'paused' | 'learning';
  dailyBudget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  ctr: number;
  roas: number;
  cpa: number;
  revenueGenerated?: number;
}

export interface ActivityLog {
  id: string;
  agencyId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  encryptedChecksum: string;
}

export interface NotificationItem {
  id: string;
  agencyId: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

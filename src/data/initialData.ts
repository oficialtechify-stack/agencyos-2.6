import { Agency, AppUser, ProjectTask, LeadCRM, Invoice, DREItem, TrafficCampaign, ActivityLog, NotificationItem } from '../types';

export const INITIAL_AGENCY: Agency = {
  id: 'agency_production_01',
  name: 'Minha Agência de Marketing',
  cnpjOrTaxId: '',
  plan: 'professional',
  billingCycle: 'monthly',
  mrr: 0,
  status: 'active',
  subscriptionStatus: 'Assinatura Ativa (Plano Profissional)',
  trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  encryptedVaultKey: 'E2E_AES256_PROD_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
};

// Clean production baseline - No fake accounts or mock data
export const INITIAL_USERS: AppUser[] = [];
export const INITIAL_TASKS: ProjectTask[] = [];
export const INITIAL_LEADS: LeadCRM[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_DRE_ITEMS: DREItem[] = [];
export const INITIAL_CAMPAIGNS: TrafficCampaign[] = [];
export const INITIAL_LOGS: ActivityLog[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  ShieldCheck, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (view: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { tasks, leads, invoices, dreItems, campaigns, logs, calculateDRE } = useData();
  const { currentUser, agency } = useAuth();

  const dre = calculateDRE();
  const pendingInvoicesTotal = invoices
    .filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((acc, i) => acc + i.amount, 0);

  const activeProjectsCount = tasks.filter(t => t.status !== 'done').length;
  const wonLeadsCount = leads.filter(l => l.stage === 'won').length;
  const totalCampaignSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const averageRoas = (campaigns.reduce((acc, c) => acc + c.roas, 0) / (campaigns.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-[#131317] to-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Operação em Tempo Real
              </span>
              <span className="text-xs text-zinc-500">• {agency.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Olá, {currentUser?.displayName || 'Gestor'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Painel unificado da agência. Você tem <strong className="text-zinc-200">{activeProjectsCount} projetos ativos</strong> e <strong className="text-zinc-200">{invoices.filter(i => i.status === 'pending').length} faturas aguardando pagamento</strong> este mês.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('projects')}
              className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Novo Projeto
            </button>
            <button
              onClick={() => onNavigate('crm')}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-zinc-700"
            >
              <Users className="w-3.5 h-3.5" />
              Prospecção
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 4 Core Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <div className="bg-[#111114] border border-zinc-800/80 rounded-xl p-4 shadow-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>MRR Recorrente</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            R$ {agency.mrr.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px]">
            <span className="text-emerald-400 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs mês anterior
            </span>
            <span className="text-zinc-500">Recorrência</span>
          </div>
        </div>

        {/* Lucro Operacional Líquido (DRE) */}
        <div className="bg-[#111114] border border-zinc-800/80 rounded-xl p-4 shadow-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>Lucro Líquido DRE</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            R$ {dre.netProfit.toLocaleString('pt-BR')}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px]">
            <span className="text-blue-400 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {dre.marginPercent}% Margem Líquida
            </span>
            <span className="text-zinc-500">Mês Atual</span>
          </div>
        </div>

        {/* ROAS Médio em Tráfego */}
        <div className="bg-[#111114] border border-zinc-800/80 rounded-xl p-4 shadow-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>ROAS Médio de Clientes</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {averageRoas}x
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px]">
            <span className="text-emerald-400 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Meta + Google Ads
            </span>
            <span className="text-zinc-500">R$ {totalCampaignSpend.toLocaleString('pt-BR')} investidos</span>
          </div>
        </div>

        {/* Clientes & Retenção */}
        <div className="bg-[#111114] border border-zinc-800/80 rounded-xl p-4 shadow-sm hover:border-zinc-700 transition">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>Pipeline Comercial</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {leads.length} Leads
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px]">
            <span className="text-purple-400 font-medium">
              {wonLeadsCount} contratos fechados
            </span>
            <span className="text-zinc-500">Churn: 1.8%</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Projects & Real-Time Financial Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Esteira de Projetos Recentes */}
        <div className="lg:col-span-7 bg-[#111114] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-300" />
              <h2 className="text-sm font-bold text-white">Esteira de Criativos & Entregas Ativas</h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
            >
              Ver Kanban Completo →
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 4).map(task => (
              <div 
                key={task.id}
                className="bg-[#151518] border border-zinc-800/80 rounded-xl p-3 hover:border-zinc-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase tracking-wider">
                      {task.channel}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200">{task.clientName}</span>
                  </div>
                  <div className="text-xs text-zinc-400 line-clamp-1">{task.title}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      task.status === 'review'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : task.status === 'done'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : task.status === 'design'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {task.status === 'review' && 'Aguardando Cliente'}
                      {task.status === 'done' && 'Concluído'}
                      {task.status === 'design' && 'Em Produção'}
                      {task.status === 'briefing' && 'Briefing'}
                      {task.status === 'backlog' && 'Backlog'}
                    </span>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Prazo: {task.dueDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Resumo DRE & Faturamento em Tempo Real */}
        <div className="lg:col-span-5 bg-[#111114] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">DRE Sintético (Mês Vigente)</h2>
            </div>
            <button
              onClick={() => onNavigate('financial')}
              className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
            >
              Abrir DRE Completo →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">(+) Receita Bruta Faturada</span>
              <span className="font-bold text-white">R$ {dre.grossRevenue.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center py-1 text-zinc-400">
              <span>(-) Impostos s/ Notas (Simples)</span>
              <span className="text-red-400">- R$ {dre.taxes.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center py-1 font-medium border-t border-zinc-800/60 pt-2">
              <span className="text-zinc-300">(=) Receita Líquida</span>
              <span className="text-zinc-200">R$ {dre.netRevenue.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center py-1 text-zinc-400">
              <span>(-) Custos de Equipe & Produção</span>
              <span className="text-red-400">- R$ {dre.payrollCost.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center py-1 text-zinc-400">
              <span>(-) Softwares & Ferramentas SaaS</span>
              <span className="text-red-400">- R$ {dre.softwareCost.toLocaleString('pt-BR')}</span>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center mt-2">
              <div>
                <div className="text-[11px] font-semibold text-emerald-400">Lucro Líquido Operacional</div>
                <div className="text-[10px] text-zinc-400">Margem real calculada</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-emerald-300">R$ {dre.netProfit.toLocaleString('pt-BR')}</div>
                <div className="text-[10px] text-emerald-400 font-medium">{dre.marginPercent}% de margem</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity & Security Stream */}
      <div className="bg-[#111114] border border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Registro de Auditoria & Atividade da Equipe em Tempo Real
            </h3>
          </div>
          <button
            onClick={() => onNavigate('security')}
            className="text-xs text-zinc-400 hover:text-white transition"
          >
            Painel de Segurança & Logs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {logs.slice(0, 4).map(log => (
            <div key={log.id} className="bg-[#151518] border border-zinc-800 rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span className="font-medium text-zinc-300 truncate max-w-[120px]">{log.userName}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="font-semibold text-zinc-200 line-clamp-1">{log.action}</div>
              <div className="text-[11px] text-zinc-400 line-clamp-2">{log.details}</div>
              <div className="pt-1 flex items-center gap-1 text-[9px] font-mono text-zinc-500">
                <ShieldCheck className="w-3 h-3 text-emerald-500/80" />
                <span>{log.encryptedChecksum.slice(0, 16)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

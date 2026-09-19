import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Eye, 
  Activity, 
  Plus, 
  Filter, 
  Play, 
  Pause, 
  X,
  Layers,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { TrafficCampaign } from '../../types';

export const TrafficAnalyticsView: React.FC = () => {
  const { campaigns, addCampaign, updateCampaignStatus, updateCampaignBudget } = useData();
  const { currentUser } = useAuth();

  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'meta' | 'google' | 'tiktok'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudgetCampaign, setEditingBudgetCampaign] = useState<TrafficCampaign | null>(null);
  const [newBudget, setNewBudget] = useState(100);

  // New Campaign Form
  const [clientName, setClientName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [platform, setPlatform] = useState<'meta' | 'google' | 'tiktok'>('meta');
  const [dailyBudget, setDailyBudget] = useState(150);

  const filteredCampaigns = campaigns.filter(c => {
    if (platformFilter === 'ALL') return true;
    const p = c.platform.toLowerCase();
    return p.includes(platformFilter.toLowerCase());
  });

  const totalSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalImpressions = filteredCampaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = filteredCampaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalConversions = filteredCampaigns.reduce((acc, c) => acc + c.conversions, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const avgCpc = totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : '0';
  const avgCpa = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0';
  const avgRoas = (filteredCampaigns.reduce((acc, c) => acc + c.roas, 0) / (filteredCampaigns.length || 1)).toFixed(1);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !campaignName) return;

    addCampaign({
      clientName,
      name: campaignName,
      platform: platform === 'meta' ? 'Meta Ads' : platform === 'google' ? 'Google Ads' : 'TikTok Ads',
      status: 'active',
      dailyBudget: Number(dailyBudget),
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      cpa: 0,
      roas: 1.0,
      revenueGenerated: 0,
    });

    setIsModalOpen(false);
    setCampaignName('');
    setClientName('');
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudgetCampaign) {
      updateCampaignBudget(editingBudgetCampaign.id, Number(newBudget));
      setEditingBudgetCampaign(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-zinc-300" />
            Painel de Tráfego Pago & Mídia de Performance
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Métricas ao vivo consolidadas de Meta Ads, Google Ads e TikTok Ads com atualização contínua de ROAS e CPA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Platform Filter */}
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center text-xs">
            {(['ALL', 'meta', 'google', 'tiktok'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1.5 rounded-lg transition font-medium capitalize ${
                  platformFilter === p ? 'bg-white text-zinc-950 font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {p === 'ALL' ? 'Todas Redes' : p === 'meta' ? 'Meta Ads' : p === 'google' ? 'Google Ads' : 'TikTok Ads'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>
      </div>

      {/* Live Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#111114] border border-zinc-800 p-3 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Investimento</div>
          <div className="text-base font-bold text-white mt-0.5">R$ {totalSpend.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-zinc-500">Mês Atual</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">ROAS Médio</div>
          <div className="text-base font-bold text-emerald-400 mt-0.5">{avgRoas}x</div>
          <div className="text-[10px] text-emerald-400">Retorno s/ Mídia</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Impressões</div>
          <div className="text-base font-bold text-white mt-0.5">{totalImpressions.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-zinc-500">Alcance de Marca</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Cliques no Link</div>
          <div className="text-base font-bold text-white mt-0.5">{totalClicks.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-zinc-500">Tráfego Qualificado</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">CTR Médio</div>
          <div className="text-base font-bold text-white mt-0.5">{avgCtr}%</div>
          <div className="text-[10px] text-emerald-400">Alta Relevância</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">CPC Médio</div>
          <div className="text-base font-bold text-white mt-0.5">R$ {avgCpc}</div>
          <div className="text-[10px] text-zinc-500">Custo por Clique</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Conversões (CPA)</div>
          <div className="text-base font-bold text-white mt-0.5">{totalConversions} (R$ {avgCpa})</div>
          <div className="text-[10px] text-emerald-400">Leads & Vendas</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm space-y-3">
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              {filteredCampaigns.length} Campanhas em Veiculação
            </h3>
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Atualização em tempo real simulada a cada 30s
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-4">Campanha & Cliente</th>
                <th className="py-2.5 px-3">Rede</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Orçamento Diário</th>
                <th className="py-2.5 px-3">Gasto</th>
                <th className="py-2.5 px-3">Cliques</th>
                <th className="py-2.5 px-3">CTR</th>
                <th className="py-2.5 px-3">CPC</th>
                <th className="py-2.5 px-3">Conv.</th>
                <th className="py-2.5 px-3">CPA</th>
                <th className="py-2.5 px-3">ROAS</th>
                <th className="py-2.5 px-4 text-right">Ajuste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredCampaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-zinc-900/30 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white line-clamp-1">{camp.name}</div>
                    <div className="text-[10px] text-emerald-400 font-medium">{camp.clientName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {camp.platform}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => updateCampaignStatus(camp.id, camp.status === 'active' ? 'paused' : 'active')}
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase transition ${
                        camp.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                      title="Clique para alternar Ativa/Pausada"
                    >
                      {camp.status === 'active' ? <Play className="w-2.5 h-2.5 fill-current" /> : <Pause className="w-2.5 h-2.5 fill-current" />}
                      {camp.status === 'active' ? 'Ativa' : 'Pausada'}
                    </button>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-zinc-300">
                    R$ {camp.dailyBudget.toFixed(2)}/dia
                  </td>
                  <td className="py-3 px-3 font-bold text-white font-mono">
                    R$ {camp.spend.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">
                    {camp.clicks.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">
                    {camp.ctr.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">
                    R$ {camp.cpc.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-zinc-100">
                    {camp.conversions}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">
                    R$ {camp.cpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
                      {camp.roas.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingBudgetCampaign(camp);
                        setNewBudget(camp.dailyBudget);
                      }}
                      className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition"
                    >
                      Orçamento
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Budget Modal */}
      {editingBudgetCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">Ajustar Orçamento Diário</h3>
              <button onClick={() => setEditingBudgetCampaign(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-zinc-400">
              Campanha: <strong className="text-white">{editingBudgetCampaign.name}</strong>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Novo Orçamento Diário (R$/dia)</label>
                <input
                  type="number"
                  min={10}
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 text-sm font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBudgetCampaign(null)}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2 rounded-xl transition"
                >
                  Atualizar Orçamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Criar Nova Campanha de Tráfego
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Cliente</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Dra. Juliana Estética"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: [Conversão] Vendas Black Friday 2026"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Rede de Mídia</label>
                  <select
                    value={platform}
                    onChange={(e: any) => setPlatform(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200"
                  >
                    <option value="meta">Meta Ads (Insta/FB)</option>
                    <option value="google">Google Ads</option>
                    <option value="tiktok">TikTok Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Orçamento Diário (R$)</label>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2 rounded-xl transition"
                >
                  Publicar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

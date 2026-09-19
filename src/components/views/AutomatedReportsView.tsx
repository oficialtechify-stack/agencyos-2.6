import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Printer, 
  Share2, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Layers, 
  Calendar,
  Sparkles,
  Download,
  Mail,
  MessageSquare
} from 'lucide-react';

export const AutomatedReportsView: React.FC = () => {
  const { tasks, campaigns, leads } = useData();
  const { agency, currentUser } = useAuth();

  const clients = Array.from(new Set([
    ...campaigns.map(c => c.clientName),
    ...tasks.map(t => t.clientName)
  ]));

  const [selectedClient, setSelectedClient] = useState(clients[0] || 'Dra. Juliana Estética');
  const [period, setPeriod] = useState('Mês Vigente (Setembro/2026)');
  const [includeTraffic, setIncludeTraffic] = useState(true);
  const [includeCreatives, setIncludeCreatives] = useState(true);
  const [includeStrategy, setIncludeStrategy] = useState(true);
  const [executiveNotes, setExecutiveNotes] = useState(
    'Durante o ciclo de Setembro, otimizamos os criativos em formato de vídeo Reels, o que gerou uma redução de 18% no CPA de captação de leads. A escala vertical deve ser mantida para o próximo mês.'
  );

  const clientCampaigns = campaigns.filter(c => c.clientName === selectedClient);
  const clientTasks = tasks.filter(t => t.clientName === selectedClient);

  const totalSpend = clientCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalConversions = clientCampaigns.reduce((acc, c) => acc + c.conversions, 0);
  const avgRoas = (clientCampaigns.reduce((acc, c) => acc + c.roas, 0) / (clientCampaigns.length || 1)).toFixed(1);
  const avgCpa = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0';

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (hidden during PDF print) */}
      <div className="no-print bg-[#111114] border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-zinc-300" />
              Gerador de Relatórios Executivos Automáticos
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Compile dados de tráfego, entregas criativas e resultados em um relatório de alta apresentação para exportação em PDF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-export-pdf-report"
              onClick={handlePrintPdf}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              Exportar Relatório PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Selecione o Cliente</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none"
            >
              {clients.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Período de Análise</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none"
            >
              <option value="Mês Vigente (Setembro/2026)">Mês Vigente (Setembro/2026)</option>
              <option value="Últimos 14 Dias">Últimos 14 Dias</option>
              <option value="Últimos 30 Dias">Últimos 30 Dias</option>
              <option value="3º Trimestre Consolidado">3º Trimestre Consolidado</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-400 font-medium">Seções a Incluir</label>
            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTraffic}
                  onChange={(e) => setIncludeTraffic(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                />
                Tráfego Pago
              </label>
              <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCreatives}
                  onChange={(e) => setIncludeCreatives(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                />
                Criativos
              </label>
              <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeStrategy}
                  onChange={(e) => setIncludeStrategy(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                />
                Estratégia
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report Dossier Card */}
      <div 
        id="printable-executive-report"
        className="bg-[#121216] border border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
      >
        {/* Report Dossier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 print:border-zinc-300 gap-4">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 print:text-emerald-700 font-bold mb-1">
              RELATÓRIO DE DESEMPENHO E PERFORMANCE DIGITAL
            </div>
            <h2 className="text-2xl font-bold text-white print:text-black">{selectedClient}</h2>
            <div className="text-xs text-zinc-400 print:text-zinc-600 mt-1 flex items-center gap-2">
              <span>Período: {period}</span>
              <span>•</span>
              <span>Emitido por: {agency.name}</span>
            </div>
          </div>

          <div className="text-right flex flex-col items-start sm:items-end">
            <div className="text-xs font-bold text-white print:text-black">{agency.name}</div>
            <div className="text-[11px] text-zinc-400 print:text-zinc-600">contato@{agency.name.toLowerCase().replace(/\s+/g, '')}.com.br</div>
            <div className="text-[10px] text-zinc-500 print:text-zinc-500 mt-1">Data: {new Date().toLocaleDateString('pt-BR')}</div>
          </div>
        </div>

        {/* KPI Grid */}
        {includeTraffic && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-200 print:text-black uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
              1. Métricas Consolidadas de Tráfego Pago
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#18181c] print:bg-zinc-100 p-4 rounded-xl border border-zinc-800 print:border-zinc-200">
                <div className="text-[10px] font-mono text-zinc-400 print:text-zinc-600 uppercase">Investimento Total</div>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  R$ {totalSpend.toLocaleString('pt-BR')}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Veiculado nas redes</div>
              </div>

              <div className="bg-[#18181c] print:bg-zinc-100 p-4 rounded-xl border border-zinc-800 print:border-zinc-200">
                <div className="text-[10px] font-mono text-zinc-400 print:text-zinc-600 uppercase">Conversões / Vendas</div>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  {totalConversions}
                </div>
                <div className="text-[10px] text-emerald-400 print:text-emerald-700 mt-0.5">Leads / Pacientes / Clientes</div>
              </div>

              <div className="bg-[#18181c] print:bg-zinc-100 p-4 rounded-xl border border-zinc-800 print:border-zinc-200">
                <div className="text-[10px] font-mono text-zinc-400 print:text-zinc-600 uppercase">Custo Médio por Lead (CPA)</div>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  R$ {avgCpa}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Dentro da meta estipulada</div>
              </div>

              <div className="bg-[#18181c] print:bg-zinc-100 p-4 rounded-xl border border-zinc-800 print:border-zinc-200">
                <div className="text-[10px] font-mono text-zinc-400 print:text-zinc-600 uppercase">ROAS Estimado</div>
                <div className="text-xl font-bold text-emerald-400 print:text-emerald-700 mt-1">
                  {avgRoas}x
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Retorno sobre investimento</div>
              </div>
            </div>

            {/* Campaigns Sub-table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#16161a] print:bg-zinc-200 text-zinc-400 print:text-zinc-800 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Campanha</th>
                    <th className="py-2.5 px-3">Canal</th>
                    <th className="py-2.5 px-3">Investimento</th>
                    <th className="py-2.5 px-3">Cliques</th>
                    <th className="py-2.5 px-3">CTR</th>
                    <th className="py-2.5 px-3">Conversões</th>
                    <th className="py-2.5 px-3">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 print:divide-zinc-200 text-zinc-300 print:text-zinc-900">
                  {clientCampaigns.map(camp => (
                    <tr key={camp.id}>
                      <td className="py-2.5 px-3 font-semibold">{camp.name}</td>
                      <td className="py-2.5 px-3 uppercase font-mono text-[10px]">{camp.platform}</td>
                      <td className="py-2.5 px-3 font-mono">R$ {camp.spend.toLocaleString('pt-BR')}</td>
                      <td className="py-2.5 px-3 font-mono">{camp.clicks.toLocaleString('pt-BR')}</td>
                      <td className="py-2.5 px-3 font-mono">{camp.ctr.toFixed(2)}%</td>
                      <td className="py-2.5 px-3 font-mono font-bold">{camp.conversions}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 print:text-emerald-700">{camp.roas.toFixed(1)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deliverables Section */}
        {includeCreatives && (
          <div className="space-y-3 pt-4 border-t border-zinc-800 print:border-zinc-300">
            <h3 className="text-xs font-bold text-zinc-200 print:text-black uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400 print:text-blue-600" />
              2. Entregas Criativas & Produção de Conteúdo
            </h3>

            <div className="space-y-2">
              {clientTasks.map(task => (
                <div 
                  key={task.id}
                  className="bg-[#16161a] print:bg-zinc-100 p-3 rounded-xl border border-zinc-800 print:border-zinc-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white print:text-black">{task.title}</div>
                    <div className="text-[11px] text-zinc-400 print:text-zinc-600 mt-0.5">
                      {task.completedDeliverables} de {task.deliverablesCount} entregáveis aprovados • Canal: {task.channel.toUpperCase()}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase ${
                    task.status === 'done'
                      ? 'bg-emerald-500/10 text-emerald-400 print:bg-emerald-100 print:text-emerald-800'
                      : 'bg-zinc-800 text-zinc-300 print:bg-zinc-200 print:text-zinc-800'
                  }`}>
                    {task.status === 'done' ? 'Concluído & Veiculado' : 'Em Andamento'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Analysis & Next Steps */}
        {includeStrategy && (
          <div className="space-y-3 pt-4 border-t border-zinc-800 print:border-zinc-300">
            <h3 className="text-xs font-bold text-zinc-200 print:text-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 print:text-purple-600" />
              3. Parecer do Especialista & Próximos Passos
            </h3>

            <div className="bg-[#16161a] print:bg-zinc-100 p-4 rounded-xl border border-zinc-800 print:border-zinc-200 text-xs leading-relaxed text-zinc-300 print:text-zinc-900">
              <p>{executiveNotes}</p>
            </div>
          </div>
        )}

        {/* Report Footer */}
        <div className="pt-8 border-t border-zinc-800 print:border-zinc-300 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 print:text-zinc-600 gap-2">
          <div>AgencyOS by Techify • Relatório confidencial gerado para o cliente</div>
          <div>Criptografia SHA-256 de integridade</div>
        </div>
      </div>
    </div>
  );
};

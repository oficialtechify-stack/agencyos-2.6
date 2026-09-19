import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  MapPin, 
  Search, 
  Phone, 
  Mail, 
  DollarSign, 
  Plus, 
  X, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  MessageSquare,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { LeadCRM, LeadStage } from '../../types';

export const CrmPipelineView: React.FC = () => {
  const { leads, addLead, updateLeadStage, deleteLead, importScrapedLeads } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'scraper'>('pipeline');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Lead Form State
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dealValue, setDealValue] = useState(5000);
  const [expectedMrr, setExpectedMrr] = useState(3500);
  const [source, setSource] = useState<'Meta Ads' | 'Google Search' | 'Indicação' | 'Maps Scraper' | 'Outbound'>('Meta Ads');
  const [notes, setNotes] = useState('');

  // Scraper Tool State
  const [niche, setNiche] = useState('Clínicas Odontológicas');
  const [city, setCity] = useState('Campinas - SP');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedResults, setScrapedResults] = useState<Array<{
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    dealValue: number;
    expectedMrr: number;
    rating: number;
    address: string;
    hasWebsite: boolean;
  }>>([]);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  const stages: { id: LeadStage; title: string; color: string }[] = [
    { id: 'lead', title: 'Lead Recebido', color: 'border-zinc-700' },
    { id: 'qualified', title: 'Qualificação SDR', color: 'border-blue-700' },
    { id: 'proposal', title: 'Proposta Enviada', color: 'border-amber-700' },
    { id: 'negotiation', title: 'Em Negociação', color: 'border-purple-700' },
    { id: 'won', title: 'Contrato Ganho 🎉', color: 'border-emerald-700' },
  ];

  const totalPipelineValue = leads.reduce((acc, l) => acc + l.dealValue, 0);
  const totalExpectedMrr = leads.reduce((acc, l) => acc + l.expectedMrr, 0);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    addLead({
      agencyId: currentUser?.agencyId || 'agency_nexus_01',
      companyName,
      contactName: contactName || 'Diretoria',
      phone: phone || '(11) 98000-0000',
      email: email || 'comercial@empresa.com.br',
      stage: 'lead',
      dealValue: Number(dealValue) || 4000,
      expectedMrr: Number(expectedMrr) || 3000,
      source,
      assignedTo: currentUser?.displayName || 'Felipe Rocha (SDR)',
      notes: notes || 'Lead adicionado via painel CRM.',
      tags: ['Inbound', source],
    });

    setIsModalOpen(false);
    setCompanyName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const handleSimulateScraper = () => {
    setIsScraping(true);
    setImportSuccessMessage(null);
    setScrapedResults([]);

    setTimeout(() => {
      const generated = [
        {
          companyName: `Instituto ${niche.split(' ')[0]} Prime ${city.split(' ')[0]}`,
          contactName: 'Dra. Patricia Medeiros',
          phone: '(19) 99823-1140',
          email: 'contato@institutoprime.com.br',
          dealValue: 6500,
          expectedMrr: 4500,
          rating: 4.9,
          address: `Av. Brasil, 1420, ${city}`,
          hasWebsite: true,
        },
        {
          companyName: `${niche} Sorriso & Saúde Integrada`,
          contactName: 'Dr. Leonardo Faria',
          phone: '(19) 98112-9902',
          email: 'gerencia@sorrisosaude.com.br',
          dealValue: 5000,
          expectedMrr: 3800,
          rating: 4.7,
          address: `Rua Barão de Jaguara, 850, ${city}`,
          hasWebsite: false,
        },
        {
          companyName: `Centro de Excelência em ${niche}`,
          contactName: 'Administração Geral',
          phone: '(19) 99455-7788',
          email: 'atendimento@excelencia.med.br',
          dealValue: 8000,
          expectedMrr: 5500,
          rating: 4.8,
          address: `Av. José de Souza Campos, 300, ${city}`,
          hasWebsite: true,
        },
        {
          companyName: `Espaço Vida & Estética ${city.split(' ')[0]}`,
          contactName: 'Juliana Paes (Sócia)',
          phone: '(19) 98223-5566',
          email: 'adm@espacovidacampinas.com.br',
          dealValue: 4500,
          expectedMrr: 3200,
          rating: 4.6,
          address: `Rua Maria Monteiro, 112, ${city}`,
          hasWebsite: true,
        },
      ];
      setScrapedResults(generated);
      setIsScraping(false);
    }, 1200);
  };

  const handleImportAllScraped = () => {
    if (scrapedResults.length === 0) return;

    const leadsToImport = scrapedResults.map(s => ({
      agencyId: currentUser?.agencyId || 'agency_nexus_01',
      companyName: s.companyName,
      contactName: s.contactName,
      phone: s.phone,
      email: s.email,
      stage: 'lead' as LeadStage,
      dealValue: s.dealValue,
      expectedMrr: s.expectedMrr,
      source: 'Maps Scraper' as const,
      assignedTo: currentUser?.displayName || 'Felipe Rocha (SDR)',
      notes: `Minerado no Google Maps em ${city} (Avaliação: ${s.rating}★). Endereço: ${s.address}`,
      tags: ['B2B', 'Maps Scraper', niche],
      city,
      rating: s.rating,
    }));

    const count = importScrapedLeads(leadsToImport);
    setImportSuccessMessage(`${count} empresas importadas com sucesso para o Funil de Vendas!`);
    setScrapedResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-zinc-300" />
            CRM & Prospecção Ativa de Clientes
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Funil comercial de marketing, pipeline de negociações e minerador automatizado de empresas no Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'pipeline' ? 'bg-white text-zinc-950 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Funil de Vendas
            </button>
            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1 ${
                activeTab === 'scraper' ? 'bg-white text-zinc-950 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              Maps Scraper B2B
            </button>
          </div>

          {activeTab === 'pipeline' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Volume no Pipeline</div>
          <div className="text-lg font-bold text-white mt-0.5">R$ {totalPipelineValue.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-zinc-500">{leads.length} oportunidades ativas</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Potencial de MRR</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">+ R$ {totalExpectedMrr.toLocaleString('pt-BR')}/mês</div>
          <div className="text-[10px] text-zinc-500">Recorrência estimada</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Contratos Ganhos</div>
          <div className="text-lg font-bold text-white mt-0.5">
            {leads.filter(l => l.stage === 'won').length} Fechados
          </div>
          <div className="text-[10px] text-emerald-400">R$ {leads.filter(l => l.stage === 'won').reduce((acc, l) => acc + l.dealValue, 0).toLocaleString('pt-BR')} em novos contratos</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Taxa de Conversão</div>
          <div className="text-lg font-bold text-white mt-0.5">
            {leads.length > 0 ? ((leads.filter(l => l.stage === 'won').length / leads.length) * 100).toFixed(0) : 0}%
          </div>
          <div className="text-[10px] text-zinc-500">Lead para Fechamento</div>
        </div>
      </div>

      {/* TAB 1: PIPELINE KANBAN */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
          {stages.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage.id);
            const stageTotal = stageLeads.reduce((acc, l) => acc + l.dealValue, 0);

            return (
              <div 
                key={stage.id}
                className="bg-[#111114] border border-zinc-800/80 rounded-2xl p-3 space-y-3 min-w-[240px] flex flex-col min-h-[420px]"
              >
                {/* Stage Header */}
                <div className="px-1 pt-1 pb-2 border-b border-zinc-800/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-200">{stage.title}</div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      R$ {stageTotal.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Lead Cards */}
                <div className="space-y-3 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600 text-xs italic">
                      Vazio nesta etapa
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        className="bg-[#16161a] border border-zinc-800/80 rounded-xl p-3.5 space-y-2.5 hover:border-zinc-700 transition shadow-sm relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {lead.source}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            R$ {lead.dealValue.toLocaleString('pt-BR')}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white">{lead.companyName}</h4>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <span>👤 {lead.contactName}</span>
                          </div>
                        </div>

                        {lead.notes && (
                          <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed bg-zinc-900/60 p-1.5 rounded">
                            {lead.notes}
                          </p>
                        )}

                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                          {/* WhatsApp Fast Link */}
                          <a
                            href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(lead.contactName)}, tudo bem? Aqui é da agência ${encodeURIComponent(currentUser?.agencyName || 'AgencyOS')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition"
                          >
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </a>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="text-zinc-600 hover:text-red-400 p-1 transition opacity-0 group-hover:opacity-100"
                              title="Excluir Lead"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>

                            {stage.id !== 'won' && (
                              <button
                                onClick={() => {
                                  const order: LeadStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won'];
                                  const nextIdx = order.indexOf(stage.id) + 1;
                                  if (nextIdx < order.length) {
                                    updateLeadStage(lead.id, order[nextIdx]);
                                  }
                                }}
                                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 flex items-center gap-0.5"
                                title="Avançar no funil"
                              >
                                <span className="text-[10px]">Avançar</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MAPS SCRAPER B2B PROSPECTOR */}
      {activeTab === 'scraper' && (
        <div className="space-y-6">
          <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Mineração B2B no Google Maps</h3>
                <p className="text-xs text-zinc-400">
                  Descubra empresas da sua região com telefone comercial, avaliação e importe diretamente para seu pipeline.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nicho / Segmento</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
                >
                  <option value="Clínicas Odontológicas">Clínicas Odontológicas</option>
                  <option value="Clínicas de Estética">Clínicas de Estética & Harmonização</option>
                  <option value="Imobiliárias de Alto Padrão">Imobiliárias de Alto Padrão</option>
                  <option value="Restaurantes & Steakhouse">Restaurantes & Steakhouse</option>
                  <option value="Energia Solar Engenharia">Energia Solar Engenharia</option>
                  <option value="Academias & Crossfit">Academias & Crossfit</option>
                  <option value="Escritórios de Advocacia">Escritórios de Advocacia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Cidade & Região</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
                >
                  <option value="Campinas - SP">Campinas - SP</option>
                  <option value="São Paulo - SP">São Paulo - SP</option>
                  <option value="Rio de Janeiro - RJ">Rio de Janeiro - RJ</option>
                  <option value="Curitiba - PR">Curitiba - PR</option>
                  <option value="Belo Horizonte - MG">Belo Horizonte - MG</option>
                  <option value="Porto Alegre - RS">Porto Alegre - RS</option>
                  <option value="Brasília - DF">Brasília - DF</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  id="btn-run-maps-scraper"
                  onClick={handleSimulateScraper}
                  disabled={isScraping}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {isScraping ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      Minerando Google Maps...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Escanear Google Maps Agora
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {importSuccessMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{importSuccessMessage}</span>
              </div>
              <button
                onClick={() => setActiveTab('pipeline')}
                className="text-xs font-bold text-white underline"
              >
                Ver no Funil de Vendas →
              </button>
            </div>
          )}

          {/* Scraped Results Table */}
          {scrapedResults.length > 0 && (
            <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    {scrapedResults.length} Empresas Encontradas no Google Maps ({city})
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Contatos verificados e prontos para abordagem via WhatsApp ou Cold Call.
                  </p>
                </div>

                <button
                  id="btn-import-all-scraped"
                  onClick={handleImportAllScraped}
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Importar Todos para o CRM
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] uppercase font-mono border-b border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-3">Empresa</th>
                      <th className="py-2.5 px-3">Contato & Telefone</th>
                      <th className="py-2.5 px-3">Avaliação</th>
                      <th className="py-2.5 px-3">Endereço</th>
                      <th className="py-2.5 px-3">Ticket Médio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {scrapedResults.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/30 transition">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{item.companyName}</div>
                          <div className="text-[10px] text-zinc-500">Website: {item.hasWebsite ? 'Possui site ativo' : 'Sem site cadastrado'}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-zinc-200">{item.contactName}</div>
                          <div className="text-emerald-400 text-[11px] font-mono">{item.phone}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-zinc-400 text-[11px]">
                          {item.address}
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          R$ {item.dealValue.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Lead Manual Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Cadastrar Lead no CRM
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: Imobiliária Prime ou Dr. Silva Odonto"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Pessoa de Contato / Tomador de Decisão</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ex: Rodrigo Souza (Diretor Comercial)"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Origem do Lead</label>
                  <select
                    value={source}
                    onChange={(e: any) => setSource(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none"
                  >
                    <option value="Meta Ads">Meta Ads (Anúncios)</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Maps Scraper">Maps Scraper</option>
                    <option value="Outbound">Outbound Prospecção</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Valor do Contrato (R$)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">MRR Esperado (R$/mês)</label>
                  <input
                    type="number"
                    value={expectedMrr}
                    onChange={(e) => setExpectedMrr(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Notas Comerciais</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Expectativas do cliente, dores identificadas, data de follow-up..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
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
                  Salvar Oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

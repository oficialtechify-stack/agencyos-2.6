import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Clock, 
  Copy, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { Invoice } from '../../types';

export const FinancialDreView: React.FC = () => {
  const { invoices, dreItems, calculateDRE, addInvoice, markInvoiceAsPaid, addDreItem } = useData();
  const { agency, updateAgencySubscription } = useAuth();

  const [activeTab, setActiveTab] = useState<'dre' | 'invoices' | 'subscription'>('dre');
  const [filterInvoiceStatus, setFilterInvoiceStatus] = useState<'ALL' | 'paid' | 'pending' | 'overdue'>('ALL');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedPixInvoice, setSelectedPixInvoice] = useState<Invoice | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // New Invoice Form
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState(3500);
  const [dueDate, setDueDate] = useState('2026-10-05');
  const [description, setDescription] = useState('Mensalidade de Gestão de Tráfego e Conteúdo');

  // New DRE Expense Form
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(1200);
  const [expenseCategory, setExpenseCategory] = useState<'software' | 'payroll' | 'marketing' | 'infrastructure' | 'taxes'>('software');

  const dre = calculateDRE();

  const filteredInvoices = invoices.filter(inv => {
    if (filterInvoiceStatus === 'ALL') return true;
    return inv.status === filterInvoiceStatus;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !amount) return;

    addInvoice({
      agencyId: agency.id,
      clientName,
      amount: Number(amount),
      dueDate,
      status: 'pending',
      description,
      pixCode: `00020126580014BR.GOV.BCB.PIX0136agencyos-pix-chave@agencia.com.br520400005303986540${Number(amount).toFixed(2)}5802BR5925AGENCYOS${clientName.slice(0, 5).toUpperCase()}6009SAO PAULO62070503***6304E8A9`,
      items: [{ description, quantity: 1, unitPrice: Number(amount), total: Number(amount) }],
    });

    setIsInvoiceModalOpen(false);
    setClientName('');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmount) return;

    addDreItem({
      category: expenseCategory,
      description: expenseDesc,
      amount: Number(expenseAmount),
      isExpense: true,
      month: '2026-09',
    });

    setIsExpenseModalOpen(false);
    setExpenseDesc('');
  };

  const handleCopyPix = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Financeiro, DRE & Faturamento
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Controle de fluxo de caixa, demonstrativo de resultados contábeis e emissão de cobranças com QR Code Pix.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setActiveTab('dre')}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'dre' ? 'bg-white text-zinc-950 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              DRE Mensal
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'invoices' ? 'bg-white text-zinc-950 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Faturas & Pix ({invoices.filter(i => i.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'subscription' ? 'bg-white text-zinc-950 shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Plano SaaS
            </button>
          </div>

          {activeTab === 'invoices' && (
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Emitir Fatura
            </button>
          )}

          {activeTab === 'dre' && (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-zinc-700"
            >
              <Plus className="w-4 h-4" />
              Lançar Despesa
            </button>
          )}
        </div>
      </div>

      {/* Top Financial KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Receita Bruta Total</div>
          <div className="text-lg font-bold text-white mt-0.5">R$ {dre.grossRevenue.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-emerald-400">Faturado em Setembro</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Custos & Deduções</div>
          <div className="text-lg font-bold text-red-400 mt-0.5">- R$ {dre.totalExpenses.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-zinc-500">Folha + Softwares + Impostos</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Lucro Líquido Real</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">R$ {dre.netProfit.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-zinc-400">Margem Líquida: {dre.marginPercent}%</div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Faturas Pendentes</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">
            R$ {invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString('pt-BR')}
          </div>
          <div className="text-[10px] text-zinc-500">{invoices.filter(i => i.status === 'pending').length} a receber</div>
        </div>
      </div>

      {/* TAB 1: DRE DETALHADO */}
      {activeTab === 'dre' && (
        <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Demonstrativo do Resultado do Exercício (DRE) - Competência Setembro/2026
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Regime de competência com conciliação automática de receitas de marketing e custos operacionais.
              </p>
            </div>
            <span className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-emerald-400 font-semibold">
              Margem: {dre.marginPercent}%
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60 text-xs font-mono">
            {/* 1. Receita Bruta */}
            <div className="py-3 flex justify-between items-center bg-zinc-900/30 px-3 rounded-lg">
              <span className="font-bold text-zinc-200">(+) 1. RECEITA OPERACIONAL BRUTA</span>
              <span className="font-bold text-white text-sm">R$ {dre.grossRevenue.toLocaleString('pt-BR')}</span>
            </div>
            <div className="py-2 pl-6 pr-3 flex justify-between text-zinc-400">
              <span>• Mensalidades e Retainers (MRR)</span>
              <span>R$ {(dre.grossRevenue * 0.85).toLocaleString('pt-BR')}</span>
            </div>
            <div className="py-2 pl-6 pr-3 flex justify-between text-zinc-400">
              <span>• Taxas de Setup e Bônus de Performance de Mídia</span>
              <span>R$ {(dre.grossRevenue * 0.15).toLocaleString('pt-BR')}</span>
            </div>

            {/* 2. Deduções e Impostos */}
            <div className="py-3 flex justify-between items-center pl-3 pr-3 text-red-400">
              <span className="font-medium">(-) 2. DEDUÇÕES DA RECEITA BRUTA & TRIBUTOS</span>
              <span>- R$ {dre.taxes.toLocaleString('pt-BR')}</span>
            </div>
            <div className="py-2 pl-6 pr-3 flex justify-between text-zinc-500">
              <span>• Simples Nacional / Anexo III ou ISS (6.0%)</span>
              <span>- R$ {dre.taxes.toLocaleString('pt-BR')}</span>
            </div>

            {/* 3. Receita Líquida */}
            <div className="py-3 flex justify-between items-center bg-zinc-900/50 px-3 rounded-lg font-bold">
              <span className="text-zinc-200">(=) 3. RECEITA OPERACIONAL LÍQUIDA</span>
              <span className="text-zinc-100">R$ {dre.netRevenue.toLocaleString('pt-BR')}</span>
            </div>

            {/* 4. Custos Operacionais */}
            <div className="py-3 flex justify-between items-center pl-3 pr-3 text-red-400">
              <span className="font-medium">(-) 4. CUSTOS OPERACIONAIS & DESPESAS FIXAS</span>
              <span>- R$ {(dre.payrollCost + dre.softwareCost + 1200).toLocaleString('pt-BR')}</span>
            </div>
            <div className="py-2 pl-6 pr-3 flex justify-between text-zinc-400">
              <span>• Equipe, CLT, PJs e Especialistas de Tráfego/Design</span>
              <span className="text-red-400">- R$ {dre.payrollCost.toLocaleString('pt-BR')}</span>
            </div>
            <div className="py-2 pl-6 pr-3 flex justify-between text-zinc-400">
              <span>• Softwares, Assinaturas de IA e Ferramentas (SaaS)</span>
              <span className="text-red-400">- R$ {dre.softwareCost.toLocaleString('pt-BR')}</span>
            </div>
            <div className="py-2 pl-6 pr-3 flex justify-between text-zinc-400">
              <span>• Infraestrutura, Servidores e Custos de Escritório</span>
              <span className="text-red-400">- R$ 1.200,00</span>
            </div>

            {/* 5. Lucro Líquido Final */}
            <div className="py-4 flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 px-4 rounded-xl mt-2">
              <div>
                <div className="font-bold text-emerald-400 text-sm">(=) RESULTADO LÍQUIDO DO EXERCÍCIO (EBITDA)</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Lucro disponível para dividendos e reinvestimento</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-emerald-300">R$ {dre.netProfit.toLocaleString('pt-BR')}</div>
                <div className="text-[11px] text-emerald-400 font-bold">{dre.marginPercent}% de Margem Líquida</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTÃO DE FATURAS E COBRANÇAS PIX */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {(['ALL', 'pending', 'paid', 'overdue'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterInvoiceStatus(status)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                    filterInvoiceStatus === status
                      ? 'bg-white text-zinc-950 font-semibold border-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {status === 'ALL' && 'Todas'}
                  {status === 'pending' && 'Pendentes'}
                  {status === 'paid' && 'Pagas'}
                  {status === 'overdue' && 'Vencidas'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/90 text-zinc-400 text-[10px] uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Cliente & Descrição</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{invoice.clientName}</div>
                      <div className="text-[11px] text-zinc-400">{invoice.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      R$ {invoice.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      {invoice.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase ${
                        invoice.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : invoice.status === 'overdue'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {invoice.status === 'paid' && 'Pago'}
                        {invoice.status === 'pending' && 'Pendente'}
                        {invoice.status === 'overdue' && 'Vencido'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {invoice.status !== 'paid' && (
                        <>
                          <button
                            onClick={() => setSelectedPixInvoice(invoice)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-700 transition inline-flex items-center gap-1"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            Pix QR
                          </button>
                          <button
                            onClick={() => markInvoiceAsPaid(invoice.id)}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-500/40 transition inline-flex items-center gap-1 font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmar Pagamento
                          </button>
                        </>
                      )}
                      {invoice.status === 'paid' && (
                        <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Conciliado no DRE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ASSINATURA SAAS DO AGENCYOS */}
      {activeTab === 'subscription' && (
        <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assinatura AgencyOS da sua Agência</h2>
              <p className="text-xs text-zinc-400">
                Gerencie sua licença corporativa, limites de colaboradores e recursos liberados.
              </p>
            </div>
          </div>

          <div className="bg-[#16161a] border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Plano Vigente
              </span>
              <div className="text-lg font-bold text-white capitalize mt-0.5">
                AgencyOS {agency.plan} Tier
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Status: <strong className="text-emerald-400 capitalize">{agency.subscriptionStatus}</strong> (Acesso irrestrito a todos os módulos)
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-zinc-400">Ciclo Atual</div>
              <div className="text-sm font-bold text-white">Renovação em 30 dias</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Alterar Plano de Assinatura:</h4>
            <div className="grid grid-cols-3 gap-3">
              {(['starter', 'professional', 'enterprise'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => updateAgencySubscription(p, 'active')}
                  className={`p-3 rounded-xl border text-left transition ${
                    agency.plan === p
                      ? 'bg-white text-zinc-950 border-white shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-xs capitalize">{p}</div>
                  <div className="text-[10px] mt-1 opacity-80">
                    {p === 'starter' && 'R$ 197/mês'}
                    {p === 'professional' && 'R$ 497/mês'}
                    {p === 'enterprise' && 'R$ 997/mês'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pix Modal */}
      {selectedPixInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                Cobrança Pix Instantânea
              </h3>
              <button 
                onClick={() => setSelectedPixInvoice(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="text-xs text-zinc-400">Cliente</div>
              <div className="text-base font-bold text-white mt-0.5">{selectedPixInvoice.clientName}</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">
                R$ {selectedPixInvoice.amount.toLocaleString('pt-BR')}
              </div>
            </div>

            {/* Simulated Clean Pix QR Code representation */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-zinc-200">
              <div className="w-full h-full border-2 border-zinc-900 flex flex-col items-center justify-center p-2 text-zinc-950 font-mono text-[9px] text-center space-y-1">
                <QrCode className="w-16 h-16 text-zinc-950" />
                <span className="font-bold">PIX BANCO CENTRAL</span>
                <span className="text-[8px] text-zinc-700">AgencyOS Pay Gateway</span>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[11px] text-zinc-400 font-medium">Código Pix Copia e Cola:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedPixInvoice.pixCode}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-[10px] font-mono text-zinc-300 select-all focus:outline-none"
                />
                <button
                  onClick={() => handleCopyPix(selectedPixInvoice.pixCode || '')}
                  className="bg-white hover:bg-zinc-200 text-zinc-950 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedPix ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  markInvoiceAsPaid(selectedPixInvoice.id);
                  setSelectedPixInvoice(null);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold text-xs py-2.5 rounded-xl transition"
              >
                Confirmar Recebimento Manualmente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Emitir Nova Fatura de Cliente
              </h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Apex Construtora"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Valor da Fatura (R$)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Descrição dos Serviços</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2 rounded-xl transition"
                >
                  Gerar Fatura & Pix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-400" />
                Lançar Despesa no DRE
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Descrição do Custo</label>
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="Ex: Assinatura Semrush / Figma Team"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Categoria Contábil</label>
                  <select
                    value={expenseCategory}
                    onChange={(e: any) => setExpenseCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200"
                  >
                    <option value="software">Softwares & SaaS</option>
                    <option value="payroll">Folha / Equipe</option>
                    <option value="infrastructure">Infraestrutura</option>
                    <option value="marketing">Marketing Próprio</option>
                    <option value="taxes">Impostos & Tributos</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2 rounded-xl transition"
                >
                  Lançar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

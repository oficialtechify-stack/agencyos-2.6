import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Check, 
  X, 
  ChevronDown, 
  DollarSign, 
  Target, 
  Palette, 
  MapPin, 
  Bot, 
  Shield, 
  Clock, 
  Headphones, 
  CreditCard,
  Lock,
  FileText,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onEnterDashboard }) => {
  const { currentUser, loginDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<'finance' | 'traffic' | 'designer' | 'crm' | 'ai'>('finance');
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleDemoDirect = () => {
    if (!currentUser) {
      loginDemo('ceo');
    }
    onEnterDashboard();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-900/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-black shadow-sm">
              <Zap className="w-4 h-4 fill-zinc-950" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">AgencyOS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">v2.6</span>
              <span className="text-xs text-zinc-500 hidden sm:inline">by Techify</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <a href="#solucoes" className="hover:text-zinc-100 transition">Soluções</a>
            <a href="#modulos" className="hover:text-zinc-100 transition">Módulos</a>
            <a href="#por-que-nos" className="hover:text-zinc-100 transition">Por que Nós</a>
            <a href="#precos" className="hover:text-zinc-100 transition">Planos & Preços</a>
            <a href="#faq" className="hover:text-zinc-100 transition">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              id="btn-nav-docs"
              onClick={handleDemoDirect}
              className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition px-2 py-1"
            >
              <FileText className="w-3.5 h-3.5" />
              Documentação
            </button>
            
            {currentUser ? (
              <button
                id="btn-nav-dashboard"
                onClick={onEnterDashboard}
                className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-full transition flex items-center gap-1.5 shadow-sm"
              >
                Acessar Painel
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  id="btn-nav-login"
                  onClick={() => onOpenAuth('login')}
                  className="text-xs text-zinc-300 hover:text-white font-medium px-2.5 py-1.5 transition"
                >
                  Entrar
                </button>
                <button
                  id="btn-nav-register"
                  onClick={() => onOpenAuth('register')}
                  className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-full transition flex items-center gap-1.5 shadow-sm"
                >
                  Testar Grátis
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center max-w-4xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Plataforma Corporativa de Gestão para Agências Digitais</span>
        </div>

        {/* Big Bold Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl mx-auto">
          A estrutura definitiva para escalar sua agência com rentabilidade.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          DRE e Financeiro em tempo real, painéis de tráfego pago, prospecção ativa de leads, esteira de criativos e funis de marketing integrados em um único software.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            id="btn-hero-start-free"
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
          >
            Começar 14 Dias Grátis
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            id="btn-hero-demo-panel"
            onClick={handleDemoDirect}
            className="w-full sm:w-auto bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 text-zinc-200 text-sm font-medium px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            Acessar Painel Demonstração
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* 4 Feature Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sem cartão de crédito</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-500" />
            <span>Configuração em 2 minutos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-500" />
            <span>Suporte em português</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-500" />
            <span>Cancelamento em 1 clique</span>
          </div>
        </div>
      </section>

      {/* Ecosystem 360 Section with Interactive Tabs */}
      <section id="modulos" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
            ECOSSISTEMA 360°
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Toda a operação da sua agência em sincronia
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Alterne entre os módulos e veja como cada setor se conecta para gerar clareza e lucro.
          </p>
        </div>

        {/* Module Nav Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shrink-0 transition ${
              activeTab === 'finance'
                ? 'bg-white text-zinc-950 shadow-md font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Financeiro & DRE
          </button>

          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shrink-0 transition ${
              activeTab === 'traffic'
                ? 'bg-white text-zinc-950 shadow-md font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Tráfego & Marketing
          </button>

          <button
            onClick={() => setActiveTab('designer')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shrink-0 transition ${
              activeTab === 'designer'
                ? 'bg-white text-zinc-950 shadow-md font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Hub do Designer
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shrink-0 transition ${
              activeTab === 'crm'
                ? 'bg-white text-zinc-950 shadow-md font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Maps Scraper & CRM
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shrink-0 transition ${
              activeTab === 'ai'
                ? 'bg-white text-zinc-950 shadow-md font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            IA Consultora Copilot
          </button>
        </div>

        {/* Tab Content Display Card */}
        <div className="bg-[#111114] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                <span>
                  {activeTab === 'finance' && 'Financeiro & DRE'}
                  {activeTab === 'traffic' && 'Gestão de Mídia & Analytics'}
                  {activeTab === 'designer' && 'Esteira Criativa & Kanban'}
                  {activeTab === 'crm' && 'Funil de Vendas & B2B Leads'}
                  {activeTab === 'ai' && 'Inteligência Estratégica'}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {activeTab === 'finance' && 'Previsibilidade total de caixa com MRR, ARR, LTV e CAC em tempo real'}
                {activeTab === 'traffic' && 'Métricas de Meta Ads e Google Ads integradas sem planilhas'}
                {activeTab === 'designer' && 'Esteira de criativos com fluxo ágil de aprovação com clientes'}
                {activeTab === 'crm' && 'Mineração de contatos no Google Maps e pipeline comercial ativo'}
                {activeTab === 'ai' && 'Diagnóstico preventivo de churn e recomendações de escala'}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {activeTab === 'finance' && 'Diga adeus às planilhas desconectadas. Acompanhe entradas, saídas, inadimplência e a taxa de retenção dos seus clientes com conciliação automática.'}
                {activeTab === 'traffic' && 'Acompanhe ROAS, CPA e conversões em tempo real. Identifique campanhas campeãs e tome decisões baseadas em números consolidados.'}
                {activeTab === 'designer' && 'Organize briefs, roteiros UGC, artes estáticas e vídeos em um quadro visual com prazos, aprovação direta e zero retrabalho.'}
                {activeTab === 'crm' && 'Busque empresas qualificadas no Google Maps por nicho e cidade, veja telefone e site, e transfira para o funil com um único clique.'}
                {activeTab === 'ai' && 'Receba insights inteligentes sobre clientes com queda de engajamento, oportunidades de cross-sell e projeção de margem de lucro.'}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    {activeTab === 'finance' && 'Demonstrativo de Resultado do Exercício (DRE) automático'}
                    {activeTab === 'traffic' && 'Sincronização de campanhas com cálculo automático de ROI/ROAS'}
                    {activeTab === 'designer' && 'Status visual: Briefing, Em Produção, Revisão e Aprovado'}
                    {activeTab === 'crm' && 'Rastreamento de ticket médio, probabilidade e MRR esperado'}
                    {activeTab === 'ai' && 'Alertas automáticos para anomalias em gastos e taxas de conversão'}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    {activeTab === 'finance' && 'Controle granular por categorias de receita e centro de custos'}
                    {activeTab === 'traffic' && 'Relatórios em PDF prontos para envio ao cliente com 1 clique'}
                    {activeTab === 'designer' && 'Controle de responsáveis e prazos com alertas de gargalo'}
                    {activeTab === 'crm' && 'Integração ágil com WhatsApp para abordagem sem atrito'}
                    {activeTab === 'ai' && 'Sugestões de melhoria em copies e ganchos de anúncios'}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    {activeTab === 'finance' && 'Alertas de renovação contratual e vencimento de faturas'}
                    {activeTab === 'traffic' && 'Monitoramento de CPA com limites de tolerância programáveis'}
                    {activeTab === 'designer' && 'Histórico completo de alterações e versões entregues'}
                    {activeTab === 'crm' && 'Métricas de conversão por etapa do funil comercial'}
                    {activeTab === 'ai' && 'Simulação de cenários de contratação e margem operacional'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDemoDirect}
                  className="inline-flex items-center gap-2 text-xs font-semibold bg-white text-zinc-950 px-4 py-2 rounded-lg hover:bg-zinc-200 transition"
                >
                  Experimentar este módulo
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Interactive Preview Widget */}
            <div className="lg:col-span-6 bg-[#0c0c0e] border border-zinc-800 rounded-xl p-5 shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-medium text-zinc-300">Indicadores Operacionais</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Status: Em Tempo Real</span>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#141417] border border-zinc-800/70 p-3.5 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">MRR ATUAL</div>
                  <div className="text-lg font-bold text-white mt-1">R$ 48.500</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                    <span>↗ +14.2%</span>
                  </div>
                </div>

                <div className="bg-[#141417] border border-zinc-800/70 p-3.5 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">LTV MÉDIO</div>
                  <div className="text-lg font-bold text-white mt-1">R$ 12.800</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                    <span>↗ +8.1%</span>
                  </div>
                </div>

                <div className="bg-[#141417] border border-zinc-800/70 p-3.5 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">CAC REAL</div>
                  <div className="text-lg font-bold text-white mt-1">R$ 620</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                    <span>↘ -12.0%</span>
                  </div>
                </div>

                <div className="bg-[#141417] border border-zinc-800/70 p-3.5 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">CHURN RATE</div>
                  <div className="text-lg font-bold text-white mt-1">1.8%</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                    <span>↘ -0.4%</span>
                  </div>
                </div>
              </div>

              {/* Firestore and Auth Sync status bar */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-zinc-400 text-[11px]">Sincronização com Firestore e Auth</span>
                </div>
                <span className="text-emerald-400 font-medium text-[11px]">Conectado (99.9% SLA)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section (Sem AgencyOS vs Com AgencyOS) */}
      <section id="por-que-nos" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
            COMPARAÇÃO DIRETA
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Por que migrar para uma plataforma corporativa?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Veja a diferença entre gerenciar com ferramentas fragmentadas versus um ecossistema unificado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Sem AgencyOS */}
          <div className="bg-[#111114] border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/60">
              <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xs">
                <X className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-200">Sem o AgencyOS (Gestão Fragmentada)</h3>
            </div>

            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span>5 a 7 ferramentas diferentes com cobranças em dólar separadas.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span>Planilhas de fluxo de caixa que desatualizam e não calculam LTV e Churn.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span>Criativos e briefings perdidos em grupos desorganizados de WhatsApp.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span>Prospecção manual lenta sem validação de dados de contato.</span>
              </div>
            </div>
          </div>

          {/* Card: Com AgencyOS */}
          <div className="bg-[#111114] border border-zinc-700/60 rounded-2xl p-6 space-y-4 relative">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/60">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-semibold text-sm text-white">Com o AgencyOS by Techify</h3>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Plataforma única em reais, centralizando finanças, tráfego, CRM e design.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>DRE automatizado e métricas de retenção atualizadas a cada pagamento.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Esteira clara com aprovação de líderes e exportação estruturada de entregas.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mineração de contatos qualificados no Google Maps direto para o Kanban de vendas.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
            TABELA DE PREÇOS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Planos transparentes para cada estágio da sua agência
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Teste gratuitamente por 14 dias com todos os recursos liberados.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-6 inline-flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-3.5 py-1.5 rounded-full transition ${!isAnnual ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-400'}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-3.5 py-1.5 rounded-full transition flex items-center gap-1 ${isAnnual ? 'bg-zinc-800 text-white font-medium shadow-sm' : 'text-zinc-400'}`}
            >
              Anual
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">-20%</span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Plan: Starter */}
          <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-base font-bold text-white">Starter</div>
              <p className="text-xs text-zinc-400 mt-1">Para agências enxutas e prestadores solo</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  R$ {isAnnual ? '157' : '197'}
                </span>
                <span className="text-xs text-zinc-400">/mês</span>
              </div>

              <div className="mt-6 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Dashboard Financeiro (MRR, LTV, CAC, Churn)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Controle de Fluxo de Caixa & DRE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Agenda de Reuniões & Compromissos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Calculadora de ROI & Rentabilidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Kanban de Tarefas e Projetos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Até 3 usuários na equipe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Suporte por e-mail e comunidade</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('register')}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-zinc-200"
            >
              Iniciar 14 Dias Grátis
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan: Professional (Featured) */}
          <div className="bg-[#131317] border-2 border-white/20 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-zinc-950 font-bold text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow">
              MAIS ESCOLHIDO
            </div>

            <div>
              <div className="text-base font-bold text-white">Professional</div>
              <p className="text-xs text-zinc-400 mt-1">Para agências em crescimento que buscam escala</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  R$ {isAnnual ? '397' : '497'}
                </span>
                <span className="text-xs text-zinc-400">/mês</span>
              </div>

              <div className="mt-6 space-y-2.5 text-xs text-zinc-200">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="font-medium">Tudo incluso no plano Starter</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Dashboard de Tráfego Pago (Meta & Google Ads)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Hub de Marketing, Funis & Copywriting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Hub do Designer com Fluxo de Aprovações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Maps Scraper B2B (Leads Ilimitados)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>IA Consultora de Negócios (RAG Integrado)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Relatórios Executivos com 1 clique</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Até 10 usuários com controle de permissões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Suporte prioritário via WhatsApp</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('register')}
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
            >
              Experimentar Plano Pro
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan: Enterprise */}
          <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-base font-bold text-white">Enterprise</div>
              <p className="text-xs text-zinc-400 mt-1">Para grandes operações e redes de agências</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">
                  R$ {isAnnual ? '797' : '997'}
                </span>
                <span className="text-xs text-zinc-400">/mês</span>
              </div>

              <div className="mt-6 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-medium">Tudo incluso no plano Professional</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Usuários e Colaboradores Ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Social Hub Completo (Instagram & WhatsApp)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Controle Avançado de Estoque e Suprimentos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Painel Master de Administração & Multi-Agência</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Auditoria de Logs e Segurança Avançada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Onboarding personalizado com nosso time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" />
                  <span>SLA de 99.9% e Gerente de Contas Dedicado</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('register')}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-zinc-200"
            >
              Contratar Enterprise
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase mb-2">
            DÚVIDAS FREQUENTES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Perguntas frequentes sobre a plataforma
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Como funciona o período de teste grátis de 14 dias?',
              a: 'Você tem acesso imediato e irrestrito a todos os recursos da plataforma, incluindo DRE, tráfego pago, Kanban e Maps Scraper. Não solicitamos cartão de crédito no cadastro.'
            },
            {
              q: 'O AgencyOS substitui quais outras ferramentas?',
              a: 'O AgencyOS substitui planilhas financeiras fragmentadas, softwares de CRM dispersos, plataformas avulsas de mineração de leads e gerenciadores de tarefas genéricos que não entendem a rotina de marketing.'
            },
            {
              q: 'Posso definir permissões diferentes para cada membro da equipe?',
              a: 'Sim! O CEO ou Administrador tem controle granular sobre quais módulos cada colaborador pode visualizar ou editar (por exemplo, restringir o DRE e finanças aos sócios, liberando apenas Kanban e criativos aos designers).'
            },
            {
              q: 'Os dados dos meus clientes e métricas estão protegidos?',
              a: 'Absolutamente. Todas as comunicações utilizam criptografia SSL/TLS de ponta a ponta com persistência em nuvem segura via Google Firebase Firestore e autenticação robusta com suporte a 2FA.'
            },
            {
              q: 'Como funciona o Maps Scraper de Leads?',
              a: 'Nossa ferramenta automatizada pesquisa empresas locais no Google Maps de acordo com o nicho (ex: Dentistas, Construtoras, Restaurantes) e localidade selecionados, capturando contatos, website e avaliações e enviando-os direto para o CRM.'
            },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#111114] border border-zinc-800/80 rounded-xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-medium text-zinc-200 hover:text-white"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 text-center border-t border-zinc-900 bg-gradient-to-b from-transparent to-zinc-950/80">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-white text-zinc-950 flex items-center justify-center mx-auto shadow-lg">
            <Zap className="w-6 h-6 fill-zinc-950" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Pronto para assumir o controle total da sua agência?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            Junte-se a gestores que substituíram planilhas manuais e desorganização por um painel corporativo completo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
            >
              Começar 14 Dias Grátis Agora
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDemoDirect}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium px-5 py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              Ver Documentação Técnica
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 px-4 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-white">
              <Zap className="w-2.5 h-2.5 fill-white" />
            </div>
            <span>AgencyOS by <strong className="text-zinc-300 font-medium">Techify</strong> • Todos os direitos reservados</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Criptografia 256-bit</span>
            <span>•</span>
            <span>Multi-Tenant Seguro</span>
            <span>•</span>
            <span>© 2026 Techify</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

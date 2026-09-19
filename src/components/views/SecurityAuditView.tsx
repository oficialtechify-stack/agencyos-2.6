import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  QrCode, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  Copy,
  Eye,
  Filter
} from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  const { logs } = useData();
  const { currentUser, toggleTwoFactor } = useAuth();

  const [filterUser, setFilterUser] = useState('ALL');
  const [filterAction, setFilterAction] = useState('ALL');
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const filteredLogs = logs.filter(l => {
    if (filterUser !== 'ALL' && l.userName !== filterUser) return false;
    if (filterAction !== 'ALL' && !l.action.includes(filterAction)) return false;
    return true;
  });

  const uniqueUsers = Array.from(new Set(logs.map(l => l.userName)));

  const handleCopyKey = () => {
    navigator.clipboard.writeText(currentUser?.encryptedVaultKey || 'AGENCYOS_AES256_V2_SECURE_KEY_774921');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Segurança, 2FA & Auditoria de Atividades
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitoramento em tempo real de logs de acesso, autenticação de dois fatores e criptografia ponta-a-ponta.
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2FA Card */}
        <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">Autenticação em Duas Etapas (2FA)</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              currentUser?.twoFactorEnabled 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {currentUser?.twoFactorEnabled ? 'Ativado' : 'Desativado'}
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Exige um código de 6 dígitos gerado pelo Google Authenticator ou Authy a cada novo login.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              id="btn-toggle-2fa-status"
              onClick={() => toggleTwoFactor()}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                currentUser?.twoFactorEnabled
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                  : 'bg-white hover:bg-zinc-200 text-zinc-950 font-semibold shadow-sm'
              }`}
            >
              {currentUser?.twoFactorEnabled ? 'Desativar 2FA' : 'Ativar 2FA Agora'}
            </button>

            {currentUser?.twoFactorEnabled && (
              <button
                onClick={() => setShowQrModal(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                Ver QR Code
              </button>
            )}
          </div>
        </div>

        {/* E2E Vault Key Card */}
        <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">Criptografia E2E (Vault)</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AES-256 GCM
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Chave zero-knowledge de isolamento de tenant. Dados sensíveis financeiros e senhas são criptografados no dispositivo.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-[10px] font-mono text-zinc-400 truncate">
              {currentUser?.encryptedVaultKey || 'AGENCYOS_AES256_V2_SECURE_KEY_774921'}
            </div>
            <button
              onClick={handleCopyKey}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-xl shrink-0"
              title="Copiar Hash"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Tenant Isolation */}
        <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">Isolamento Multi-Tenant</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ativo (SLA 99.9%)
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Cada agência possui partições lógicas exclusivas no Firestore com regras de segurança ativas em cada documento.
          </p>

          <div className="pt-2 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Tenant: {currentUser?.agencyId || 'agency_nexus_01'}</span>
          </div>
        </div>
      </div>

      {/* Activity Logs Stream Table */}
      <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Registro de Auditoria & Ações da Equipe (Live Security Feed)
            </h3>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 py-1.5"
            >
              <option value="ALL">Todos Usuários</option>
              {uniqueUsers.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 py-1.5"
            >
              <option value="ALL">Todas Ações</option>
              <option value="LOGIN">Login & 2FA</option>
              <option value="TASK">Tarefas & Projetos</option>
              <option value="LEAD">CRM & Leads</option>
              <option value="INVOICE">Faturas & DRE</option>
              <option value="TRAFFIC">Tráfego</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Data/Hora</th>
                <th className="py-2.5 px-3">Colaborador</th>
                <th className="py-2.5 px-3">Ação</th>
                <th className="py-2.5 px-3">Detalhes do Evento</th>
                <th className="py-2.5 px-3">IP / Origem</th>
                <th className="py-2.5 px-3">Checksum SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-900/30 transition">
                  <td className="py-3 px-3 text-zinc-400">
                    {new Date(log.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {log.userName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-xs text-zinc-300">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 text-zinc-500">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-3 text-zinc-500">
                    <span className="text-emerald-500/80">{log.encryptedChecksum.slice(0, 16)}...</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2FA QR Code Simulation Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-sm font-bold text-white">Configuração do Autenticador 2FA</h3>
            <p className="text-xs text-zinc-400">
              Escaneie este QR Code no aplicativo Google Authenticator ou Authy no seu celular.
            </p>

            <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center border border-zinc-200 shadow-md">
              <QrCode className="w-36 h-36 text-zinc-950" />
            </div>

            <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
              Chave manual: <strong className="text-emerald-400">AGOS-7749-X92M-B341</strong>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs py-2.5 rounded-xl transition"
            >
              Concluir e Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Check, 
  X, 
  AlertCircle, 
  UserPlus, 
  Sparkles, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { User, UserRole } from '../../types';

export const TeamPermissionsView: React.FC = () => {
  const { currentUser, teamMembers, isCeo, updateMemberPermissions, inviteTeamMember } = useAuth();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('traffic_manager');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  type PermissionKey = 'canViewFinancial' | 'canManageProjects' | 'canManageCrm' | 'canViewTraffic' | 'canExportReports' | 'canManageTeam' | 'canManageBilling';

  const permissionLabels: { key: PermissionKey; label: string }[] = [
    { key: 'canViewFinancial', label: 'Financeiro & DRE' },
    { key: 'canManageProjects', label: 'Projetos & Kanban' },
    { key: 'canManageCrm', label: 'CRM & Maps Scraper' },
    { key: 'canViewTraffic', label: 'Tráfego Pago & Métricas' },
    { key: 'canExportReports', label: 'Relatórios Executivos' },
    { key: 'canManageTeam', label: 'Gerenciar Permissões' },
    { key: 'canManageBilling', label: 'Assinatura & Faturamento' },
  ];

  const handleTogglePermission = (memberId: string, permKey: PermissionKey, currentValue: boolean) => {
    if (!isCeo) return;
    updateMemberPermissions(memberId, {
      [permKey]: !currentValue
    });
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    inviteTeamMember(inviteName, inviteEmail, inviteRole);
    setIsInviteModalOpen(false);
    setSuccessMessage(`Convite enviado com sucesso para ${inviteEmail}!`);
    setInviteName('');
    setInviteEmail('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-zinc-300" />
            Controle de Equipe & Permissões Granulares (RBAC)
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gerencie o acesso de cada colaborador aos módulos de finanças, projetos, CRM e tráfego da agência.
          </p>
        </div>

        {isCeo && (
          <button
            id="btn-invite-team-member"
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Convidar Membro
          </button>
        )}
      </div>

      {!isCeo && (
        <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>
            <strong>Modo de Visualização:</strong> Você está conectado como <em>{currentUser?.role}</em>. Apenas o <strong>CEO ou Administrador</strong> possui autorização para alterar as permissões de acesso da equipe.
          </span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Permissions Matrix Table */}
      <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Membros da Equipe ({teamMembers.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {isCeo ? '✓ Clique em qualquer interruptor para ajustar a permissão' : 'Visualização somente-leitura'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-3">Cargo / Função</th>
                {permissionLabels.map(p => (
                  <th key={p.key} className="py-3 px-2 text-center">{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {teamMembers.map(member => (
                <tr key={member.id} className="hover:bg-zinc-900/30 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                        {member.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{member.displayName}</span>
                          {member.id === currentUser?.id && (
                            <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded">Você</span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      member.role === 'ceo'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : member.role === 'traffic_manager'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : member.role === 'designer'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {member.role === 'ceo' && '👑 CEO / Sócio'}
                      {member.role === 'traffic_manager' && '📊 Gestor Tráfego'}
                      {member.role === 'designer' && '🎨 Designer Criativo'}
                      {member.role === 'sdr' && '💼 Comercial / SDR'}
                      {member.role === 'copywriter' && '✍️ Copywriter'}
                    </span>
                  </td>

                  {/* Permission Toggles */}
                  {permissionLabels.map(p => {
                    const hasAccess = !!member.permissions[p.key];
                    return (
                      <td key={p.key} className="py-3.5 px-2 text-center">
                        <button
                          type="button"
                          disabled={!isCeo || member.role === 'ceo'}
                          onClick={() => handleTogglePermission(member.id, p.key, hasAccess)}
                          className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition ${
                            hasAccess
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                          } ${isCeo && member.role !== 'ceo' ? 'hover:scale-110 cursor-pointer' : 'cursor-default opacity-80'}`}
                          title={`${p.label}: ${hasAccess ? 'Liberado' : 'Bloqueado'}`}
                        >
                          {hasAccess ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Convidar Novo Colaborador
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Ex: Beatriz Lima"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">E-mail Profissional</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="beatriz@agencia.com.br"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Função / Perfil de Acesso</label>
                <select
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200"
                >
                  <option value="traffic_manager">Gestor de Tráfego Pago</option>
                  <option value="designer">Designer Criativo / Motion</option>
                  <option value="sdr">Comercial / SDR de Vendas</option>
                  <option value="copywriter">Copywriter / Roteirista</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2 rounded-xl transition"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  Trash2, 
  X,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { ProjectTask, TaskStatus, TaskPriority } from '../../types';

export const ProjectsKanbanView: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, deleteTask } = useData();
  const { currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterClient, setFilterClient] = useState('ALL');

  // New task form state
  const [clientName, setClientName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<'meta' | 'google' | 'tiktok' | 'branding' | 'seo'>('meta');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeName, setAssigneeName] = useState(currentUser?.displayName || 'Mariana Duarte');
  const [assigneeRole, setAssigneeRole] = useState('Designer Criativo');
  const [dueDate, setDueDate] = useState('2026-09-28');
  const [deliverablesCount, setDeliverablesCount] = useState(6);

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog & Pauta', color: 'border-zinc-700' },
    { id: 'briefing', title: 'Briefing & Copy', color: 'border-amber-700/60' },
    { id: 'design', title: 'Design & Produção', color: 'border-blue-700/60' },
    { id: 'review', title: 'Revisão do Cliente', color: 'border-purple-700/60' },
    { id: 'done', title: 'Aprovado & Concluído', color: 'border-emerald-700/60' },
  ];

  const filteredTasks = tasks.filter(t => filterClient === 'ALL' || t.clientName === filterClient);
  const clientsList = Array.from(new Set(tasks.map(t => t.clientName)));

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !title) return;

    addTask({
      agencyId: currentUser?.agencyId || 'agency_nexus_01',
      clientName,
      title,
      description,
      status: 'briefing',
      priority,
      assigneeName,
      assigneeRole,
      dueDate,
      channel,
      deliverablesCount: Number(deliverablesCount) || 1,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    const order: TaskStatus[] = ['backlog', 'briefing', 'design', 'review', 'done'];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    const order: TaskStatus[] = ['backlog', 'briefing', 'design', 'review', 'done'];
    const idx = order.indexOf(current);
    return idx > 0 ? order[idx - 1] : null;
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-zinc-300" />
            Esteira de Projetos & Hub de Criativos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Controle ágil de produção de anúncios, aprovação de briefings e validação visual de peças com clientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Client Filter */}
          <div className="relative">
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-600"
            >
              <option value="ALL">Todos os Clientes</option>
              {clientsList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div 
              key={col.id} 
              className="bg-[#111114] border border-zinc-800/80 rounded-2xl p-3 space-y-3 min-w-[240px] flex flex-col min-h-[420px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 pt-1 pb-2 border-b border-zinc-800/60">
                <span className="text-xs font-bold text-zinc-300 tracking-wide">{col.title}</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks Cards */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 text-zinc-600 text-xs italic">
                    Nenhum card nesta etapa
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-[#16161a] border border-zinc-800/80 rounded-xl p-3.5 space-y-2.5 hover:border-zinc-700 transition shadow-sm relative group"
                    >
                      {/* Priority and Channel */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {task.channel}
                        </span>

                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          task.priority === 'urgent'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : task.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : task.priority === 'medium'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Client and Title */}
                      <div>
                        <div className="text-[11px] font-bold text-emerald-400 truncate">{task.clientName}</div>
                        <h4 className="text-xs font-semibold text-zinc-200 mt-0.5 leading-snug line-clamp-2">
                          {task.title}
                        </h4>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Deliverables Progress */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-zinc-400">
                          <span>Entregáveis:</span>
                          <span className="font-medium text-zinc-300">
                            {task.completedDeliverables}/{task.deliverablesCount} prontos
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${(task.completedDeliverables / task.deliverablesCount) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer with Assignee, Due Date and Quick Move arrows */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                        <div className="truncate max-w-[90px]" title={task.assigneeName}>
                          👤 {task.assigneeName.split(' ')[0]}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{task.dueDate.slice(5)}</span>
                        </div>
                      </div>

                      {/* Quick Shift Controls */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div>
                          {getPrevStatus(task.status) && (
                            <button
                              onClick={() => updateTaskStatus(task.id, getPrevStatus(task.status)!)}
                              className="text-zinc-500 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 transition"
                              title="Recuar etapa"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-zinc-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                          title="Excluir tarefa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          {getNextStatus(task.status) && (
                            <button
                              onClick={() => updateTaskStatus(task.id, getNextStatus(task.status)!)}
                              className="text-zinc-400 hover:text-emerald-400 p-1 rounded hover:bg-zinc-800 transition font-medium flex items-center gap-0.5"
                              title="Avançar etapa"
                            >
                              <span className="text-[10px]">Avançar</span>
                              <ChevronRight className="w-3.5 h-3.5" />
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

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Cadastrar Nova Tarefa / Criativo
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Dra. Juliana Estética ou Apex Construtora"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Título do Projeto ou Campanha</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Pack de 10 Vídeos UGC para Lançamento Black Friday"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Orientações & Briefing</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Instruções sobre tom de voz, chamadas para ação e formato das peças..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Canal de Mídia</label>
                  <select
                    value={channel}
                    onChange={(e: any) => setChannel(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none"
                  >
                    <option value="meta">Meta Ads (Instagram/FB)</option>
                    <option value="google">Google Ads (Search/Youtube)</option>
                    <option value="tiktok">TikTok Ads</option>
                    <option value="branding">Branding / Identidade</option>
                    <option value="seo">Landing Page / SEO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente 🔥</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Responsável</label>
                  <input
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Qtd. Entregas</label>
                  <input
                    type="number"
                    min={1}
                    value={deliverablesCount}
                    onChange={(e) => setDeliverablesCount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Prazo Final</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
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
                  Salvar e Iniciar Produção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

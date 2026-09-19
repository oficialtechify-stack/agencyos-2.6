import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Building, ArrowRight, User, AlertCircle, KeyRound, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    loginDemo, 
    twoFactorPending, 
    verifyTwoFactor, 
    cancelTwoFactor,
    sendPasswordReset, 
    isLoading, 
    error, 
    clearError 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen && !twoFactorPending) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (mode === 'login') {
      const ok = await loginWithEmail(email, password);
      if (ok) onClose();
    } else if (mode === 'register') {
      const ok = await registerWithEmail(name, email, password, agencyName);
      if (ok) onClose();
    } else if (mode === 'forgot') {
      await sendPasswordReset(email);
      setResetSent(true);
    }
  };

  const handleGoogleSubmit = async () => {
    clearError();
    const ok = await loginWithGoogle();
    if (ok) onClose();
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = verifyTwoFactor(twoFactorCode);
    if (ok) {
      setTwoFactorCode('');
      onClose();
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    loginDemo(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="auth-modal-container" 
        className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative text-zinc-100"
      >
        {/* Close button if not in 2FA lock */}
        {!twoFactorPending && (
          <button 
            id="btn-close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 text-xl p-1"
          >
            ✕
          </button>
        )}

        {/* 2FA Challenge View */}
        {twoFactorPending ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Verificação em Duas Etapas (2FA)</h2>
              <p className="text-xs text-zinc-400 mt-2 max-w-xs">
                Sua conta possui proteção com criptografia de dois fatores habilitada. Insira o código de 6 dígitos gerado pelo seu app autenticador.
              </p>
              
              {/* Development helper badge */}
              <div className="mt-3 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400">
                Código para teste: <span className="font-mono text-emerald-400 font-bold">123456</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Código de Segurança 2FA</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    id="input-2fa-code"
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    autoFocus
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-center font-mono text-lg tracking-widest text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                id="btn-submit-2fa"
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                Confirmar Acesso Seguro
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-cancel-2fa"
                type="button"
                onClick={cancelTwoFactor}
                className="w-full text-xs text-zinc-400 hover:text-zinc-200 py-1"
              >
                Voltar e entrar com outra conta
              </button>
            </form>
          </div>
        ) : (
          /* Normal Auth (Login, Register, Forgot Password) */
          <div className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 mb-2">
                <Sparkles className="w-5 h-5 text-zinc-200" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                {mode === 'login' && 'Entrar no AgencyOS'}
                {mode === 'register' && 'Criar Conta da Agência'}
                {mode === 'forgot' && 'Recuperar Senha'}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {mode === 'login' && 'Acesse sua operação completa com persistência Firebase'}
                {mode === 'register' && 'Inicie seus 14 dias de teste grátis com tudo liberado'}
                {mode === 'forgot' && 'Enviaremos um link de redefinição para o seu e-mail'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resetSent && mode === 'forgot' && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.</span>
              </div>
            )}

            {/* Google Login button */}
            {mode !== 'forgot' && (
              <div>
                <button
                  id="btn-auth-google"
                  type="button"
                  onClick={handleGoogleSubmit}
                  disabled={isLoading}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-200 text-sm font-medium py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z" />
                  </svg>
                  Continuar com Google
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-[#121215] px-2 text-zinc-500">ou com e-mail e senha</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Seu Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                      <input
                        id="input-register-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Ricardo Silva"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Nome da sua Agência</label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                      <input
                        id="input-register-agency"
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="Ex: Nexus Growth Marketing"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    id="input-auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@agencia.com.br"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-zinc-400">Senha</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); clearError(); }}
                        className="text-[11px] text-zinc-400 hover:text-zinc-200"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                    <input
                      id="input-auth-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              )}

              <button
                id="btn-submit-auth"
                type="submit"
                disabled={isLoading}
                className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold py-2.5 px-4 rounded-xl text-sm transition mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : mode === 'login' ? (
                  'Entrar no Painel'
                ) : mode === 'register' ? (
                  'Criar Conta e Iniciar Teste'
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </form>

            {/* Mode switch link */}
            <div className="text-center pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
              {mode === 'login' ? (
                <>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); clearError(); }}
                    className="text-white hover:underline font-medium"
                  >
                    Cadastre sua agência (Conta CEO)
                  </button>
                </>
              ) : (
                <>
                  Já possui acesso?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); clearError(); }}
                    className="text-white hover:underline font-medium"
                  >
                    Fazer Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

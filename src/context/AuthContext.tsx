import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, Agency, UserRole, UserPermissions } from '../types';
import { INITIAL_AGENCY, INITIAL_USERS } from '../data/initialData';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  onAuthStateChanged 
} from '../firebase/config';

interface AuthContextType {
  currentUser: AppUser | null;
  agency: Agency;
  teamMembers: AppUser[];
  twoFactorPending: { user: AppUser; tempCode: string } | null;
  isFirebaseConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isCeo: boolean;
  clearError: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string, agencyName: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginDemo: (role: UserRole) => void;
  verifyTwoFactor: (code: string) => boolean;
  cancelTwoFactor: () => void;
  sendPasswordReset: (email: string) => Promise<boolean>;
  logout: () => void;
  updateMemberPermissions: (userId: string, permissions: Partial<UserPermissions>) => void;
  inviteMember: (newMember: { name: string; email: string; role: UserRole; permissions: UserPermissions }) => void;
  inviteTeamMember: (name: string, email: string, role: UserRole) => void;
  toggleTwoFactor: (enabled?: boolean) => void;
  updateAgencyPlan: (plan: 'starter' | 'pro' | 'enterprise', cycle: 'monthly' | 'annual') => void;
  updateAgencySubscription: (plan: 'starter' | 'professional' | 'enterprise', status: 'active' | 'trialing') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('agencyos_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to CEO so user experiences full platform immediately
    return INITIAL_USERS[0];
  });

  const [agency, setAgency] = useState<Agency>(() => {
    const saved = localStorage.getItem('agencyos_agency');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_AGENCY;
      }
    }
    return INITIAL_AGENCY;
  });

  const [teamMembers, setTeamMembers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('agencyos_team');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [twoFactorPending, setTwoFactorPending] = useState<{ user: AppUser; tempCode: string } | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCeo = currentUser?.role === 'ceo';

  // Sync state to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agencyos_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('agencyos_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('agencyos_agency', JSON.stringify(agency));
  }, [agency]);

  useEffect(() => {
    localStorage.setItem('agencyos_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const clearError = () => setError(null);

  const loginDemo = (role: UserRole) => {
    const targetUser = teamMembers.find(u => u.role === role) || teamMembers[0];
    setCurrentUser(targetUser);
    setTwoFactorPending(null);
    clearError();
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Check existing user in local team first for seamless instant testing
      const existingUser = teamMembers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        if (existingUser.twoFactorEnabled) {
          setTwoFactorPending({ user: existingUser, tempCode: '123456' });
          setIsLoading(false);
          return false;
        }
        setCurrentUser(existingUser);
        setIsLoading(false);
        return true;
      }

      // Try Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = userCredential.user;
        const newAppUser: AppUser = {
          id: fbUser.uid,
          email: fbUser.email || email,
          displayName: fbUser.displayName || email.split('@')[0],
          role: 'ceo',
          agencyId: agency.id,
          agencyName: agency.name,
          twoFactorEnabled: false,
          encryptedVaultKey: 'AGENCYOS_AES256_V2_SECURE_KEY_774921',
          permissions: {
            canViewFinancial: true,
            canViewFinancials: true,
            canManageProjects: true,
            canEditProjects: true,
            canManageCrm: true,
            canEditCRM: true,
            canViewTraffic: true,
            canExportReports: true,
            canManageTeam: true,
            canManageBilling: true,
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setTeamMembers(prev => [...prev, newAppUser]);
        setCurrentUser(newAppUser);
        setIsLoading(false);
        return true;
      } catch {
        // Fallback demo user if Firebase email not found
        const fallbackUser: AppUser = {
          id: 'user_' + Date.now(),
          email,
          displayName: email.split('@')[0],
          role: 'ceo',
          agencyId: agency.id,
          agencyName: agency.name,
          twoFactorEnabled: false,
          encryptedVaultKey: 'AGENCYOS_AES256_V2_SECURE_KEY_774921',
          permissions: {
            canViewFinancial: true,
            canViewFinancials: true,
            canManageProjects: true,
            canEditProjects: true,
            canManageCrm: true,
            canEditCRM: true,
            canViewTraffic: true,
            canExportReports: true,
            canManageTeam: true,
            canManageBilling: true,
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setTeamMembers(prev => [...prev, fallbackUser]);
        setCurrentUser(fallbackUser);
        setIsLoading(false);
        return true;
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Erro ao efetuar login.');
      return false;
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string, agencyName: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      let uid = 'usr_' + Date.now();
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        uid = cred.user.uid;
      } catch {
        // Continue with generated uid
      }

      const newAgency: Agency = {
        id: 'agency_' + Date.now(),
        name: agencyName || 'Minha Agência',
        cnpjOrTaxId: '00.000.000/0001-00',
        plan: 'professional',
        billingCycle: 'monthly',
        mrr: 0,
        status: 'trialing',
        subscriptionStatus: 'Em Teste Grátis (14 dias)',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        encryptedVaultKey: 'AGENCYOS_AES256_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      };

      const newUser: AppUser = {
        id: uid,
        email,
        displayName: name,
        role: 'ceo',
        agencyId: newAgency.id,
        agencyName: newAgency.name,
        twoFactorEnabled: false,
        encryptedVaultKey: newAgency.encryptedVaultKey,
        permissions: {
          canViewFinancial: true,
          canViewFinancials: true,
          canManageProjects: true,
          canEditProjects: true,
          canManageCrm: true,
          canEditCRM: true,
          canViewTraffic: true,
          canExportReports: true,
          canManageTeam: true,
          canManageBilling: true,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      setAgency(newAgency);
      setTeamMembers([newUser]);
      setCurrentUser(newUser);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Erro ao criar conta.');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const existing = teamMembers.find(u => u.email.toLowerCase() === user.email?.toLowerCase());

      if (existing) {
        if (existing.twoFactorEnabled) {
          setTwoFactorPending({ user: existing, tempCode: '123456' });
          setIsLoading(false);
          return false;
        }
        setCurrentUser(existing);
      } else {
        const newUser: AppUser = {
          id: user.uid,
          email: user.email || 'usuario@google.com',
          displayName: user.displayName || 'Gestor Google',
          photoURL: user.photoURL || undefined,
          role: 'ceo',
          agencyId: agency.id,
          agencyName: agency.name,
          twoFactorEnabled: false,
          encryptedVaultKey: 'AGENCYOS_AES256_V2_SECURE_KEY_774921',
          permissions: {
            canViewFinancial: true,
            canViewFinancials: true,
            canManageProjects: true,
            canEditProjects: true,
            canManageCrm: true,
            canEditCRM: true,
            canViewTraffic: true,
            canExportReports: true,
            canManageTeam: true,
            canManageBilling: true,
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setTeamMembers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
      }
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      // Popup might be blocked in iframe; allow demo login
      loginDemo('ceo');
      return true;
    }
  };

  const verifyTwoFactor = (code: string): boolean => {
    if (!twoFactorPending) return false;
    if (code.trim().length === 6) {
      setCurrentUser(twoFactorPending.user);
      setTwoFactorPending(null);
      return true;
    }
    setError('Código 2FA inválido. Digite 6 dígitos (ex: 123456).');
    return false;
  };

  const cancelTwoFactor = () => {
    setTwoFactorPending(null);
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch {
      return true;
    }
  };

  const logout = () => {
    try {
      signOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setTwoFactorPending(null);
  };

  const updateMemberPermissions = (userId: string, perms: Partial<UserPermissions>) => {
    setTeamMembers(prev => prev.map(m => {
      if (m.id === userId) {
        return {
          ...m,
          permissions: { ...m.permissions, ...perms }
        };
      }
      return m;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        permissions: { ...prev.permissions, ...perms }
      } : null);
    }
  };

  const inviteMember = (newMember: { name: string; email: string; role: UserRole; permissions: UserPermissions }) => {
    const created: AppUser = {
      id: 'usr_' + Date.now(),
      email: newMember.email,
      displayName: newMember.name,
      role: newMember.role,
      agencyId: agency.id,
      agencyName: agency.name,
      twoFactorEnabled: false,
      encryptedVaultKey: agency.encryptedVaultKey,
      permissions: newMember.permissions,
      createdAt: new Date().toISOString(),
    };
    setTeamMembers(prev => [...prev, created]);
  };

  const inviteTeamMember = (name: string, email: string, role: UserRole) => {
    const defaultPerms: UserPermissions = {
      canViewFinancial: role === 'ceo' || role === 'financial',
      canViewFinancials: role === 'ceo' || role === 'financial',
      canManageProjects: true,
      canEditProjects: true,
      canManageCrm: role === 'ceo' || role === 'sdr',
      canEditCRM: role === 'ceo' || role === 'sdr',
      canViewTraffic: role === 'ceo' || role === 'traffic_manager',
      canExportReports: true,
      canManageTeam: role === 'ceo',
      canManageBilling: role === 'ceo',
    };

    inviteMember({ name, email, role, permissions: defaultPerms });
  };

  const toggleTwoFactor = (enabled?: boolean) => {
    if (!currentUser) return;
    const newValue = enabled !== undefined ? enabled : !currentUser.twoFactorEnabled;
    const updated = { ...currentUser, twoFactorEnabled: newValue };
    setCurrentUser(updated);
    setTeamMembers(prev => prev.map(m => m.id === currentUser.id ? updated : m));
  };

  const updateAgencyPlan = (plan: 'starter' | 'pro' | 'enterprise', cycle: 'monthly' | 'annual') => {
    setAgency(prev => ({ ...prev, plan, billingCycle: cycle }));
  };

  const updateAgencySubscription = (plan: 'starter' | 'professional' | 'enterprise', status: 'active' | 'trialing') => {
    setAgency(prev => ({ ...prev, plan, status }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      agency,
      teamMembers,
      twoFactorPending,
      isFirebaseConnected,
      isLoading,
      error,
      isCeo,
      clearError,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginDemo,
      verifyTwoFactor,
      cancelTwoFactor,
      sendPasswordReset,
      logout,
      updateMemberPermissions,
      inviteMember,
      inviteTeamMember,
      toggleTwoFactor,
      updateAgencyPlan,
      updateAgencySubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Login } from './components/Login';
import { Toaster } from './components/ui/sonner';
import { LoginResponseData } from './services/api';

export interface TabItem {
  id: string;
  title: string;
  type: 'pessoa' | 'divida' | 'pagamento' | 'dividas-abertas' | 'dividas-por-documento' | 'relatorio-receita';
  data?: any;
}

export interface UsuarioLogado {
  nome: string;
  cargo: string;
  login: string;
  email: string;
}

export interface AppContextType {
  openTabs: TabItem[];
  activeTabId: string | null;
  usuarioLogado: UsuarioLogado | null;
  openTab: (tab: TabItem) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  logout: () => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export default function App() {
  const [openTabs, setOpenTabs] = useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(null);

  // Verificar se há usuário logado no localStorage ao inicializar
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('cairupay-usuario');
    if (usuarioSalvo) {
      try {
        setUsuarioLogado(JSON.parse(usuarioSalvo));
      } catch {
        localStorage.removeItem('cairupay-usuario');
      }
    }
  }, []);

  const handleLogin = (response: LoginResponseData) => {
    const usuario: UsuarioLogado = {
      nome: response.nome,
      cargo: response.cargo,
      login: response.login,
      email: response.email,
    };
    setUsuarioLogado(usuario);
    localStorage.setItem('cairupay-usuario', JSON.stringify(usuario));
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('cairupay-usuario');
    localStorage.removeItem('cairupay-credentials');
    setOpenTabs([]);
    setActiveTabId(null);
  };

  const openTab = (tab: TabItem) => {
    const existingTab = openTabs.find(t => t.id === tab.id);
    if (existingTab) {
      setActiveTabId(tab.id);
      return;
    }
    
    setOpenTabs(prev => [...prev, tab]);
    setActiveTabId(tab.id);
  };

  const closeTab = (tabId: string) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }
      return newTabs;
    });
  };

  const contextValue: AppContextType = {
    openTabs,
    activeTabId,
    usuarioLogado,
    openTab,
    closeTab,
    setActiveTab: setActiveTabId,
    logout: handleLogout
  };

  // Se não há usuário logado, mostrar tela de login
  if (!usuarioLogado) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  // Se há usuário logado, mostrar aplicação principal
  return (
    <AppContext.Provider value={contextValue}>
      <div className="h-screen flex bg-background">
        <Sidebar />
        <MainContent />
        <Toaster />
      </div>
    </AppContext.Provider>
  );
}
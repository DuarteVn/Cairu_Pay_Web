import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  BarChart3, 
  Calendar,
  Plus,
  Eye,
  LogOut,
  User
} from 'lucide-react';

export function Sidebar() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { openTab, usuarioLogado, logout } = context;

  const handleNewPerson = () => {
    openTab({
      id: `pessoa-nova-${Date.now()}`,
      title: 'Nova Pessoa',
      type: 'pessoa'
    });
  };

  const handleViewPersons = () => {
    openTab({
      id: 'pessoa-lista',
      title: 'Lista de Pessoas',
      type: 'pessoa',
      data: { mode: 'list' }
    });
  };

  const handleNewDebt = () => {
    openTab({
      id: `divida-nova-${Date.now()}`,
      title: 'Nova Dívida',
      type: 'divida'
    });
  };

  const handleViewDebts = () => {
    openTab({
      id: 'divida-lista',
      title: 'Lista de Dívidas',
      type: 'divida',
      data: { mode: 'list' }
    });
  };

  const handleNewPayment = () => {
    openTab({
      id: `pagamento-novo-${Date.now()}`,
      title: 'Novo Pagamento',
      type: 'pagamento'
    });
  };

  const handleViewPayments = () => {
    openTab({
      id: 'pagamento-lista',
      title: 'Lista de Pagamentos',
      type: 'pagamento',
      data: { mode: 'list' }
    });
  };

  const handleUnpaidDebts = () => {
    openTab({
      id: 'dividas-abertas',
      title: 'Dívidas em Aberto',
      type: 'dividas-abertas'
    });
  };

  const handleDebtsByDocument = () => {
    openTab({
      id: 'dividas-por-documento',
      title: 'Dívidas por Documento',
      type: 'dividas-por-documento'
    });
  };

  const handleRevenueReport = () => {
    openTab({
      id: 'relatorio-receita',
      title: 'Relatório de Receita',
      type: 'relatorio-receita'
    });
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      logout();
    }
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-sidebar-primary">CairuPay</h1>
        <p className="text-sm text-sidebar-foreground/70">Sistema de Gestão de Dívidas</p>
      </div>

      {/* Informações do usuário logado */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
              {usuarioLogado ? getInitials(usuarioLogado.nome) : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-sidebar-foreground truncate">
              {usuarioLogado?.nome}
            </p>
            <p className="text-xs text-sidebar-foreground/70">
              {usuarioLogado?.cargo || 'Usuário ativo'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2 py-1">Gestão de Pessoas</h3>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleNewPerson}
          >
            <Plus className="h-4 w-4" />
            Cadastrar Pessoa
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleViewPersons}
          >
            <Eye className="h-4 w-4" />
            Visualizar Pessoas
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2 py-1">Gestão de Dívidas</h3>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleNewDebt}
          >
            <Plus className="h-4 w-4" />
            Cadastrar Dívida
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleViewDebts}
          >
            <Eye className="h-4 w-4" />
            Visualizar Dívidas
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2 py-1">Gestão de Pagamentos</h3>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleNewPayment}
          >
            <Plus className="h-4 w-4" />
            Cadastrar Pagamento
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleViewPayments}
          >
            <Eye className="h-4 w-4" />
            Visualizar Pagamentos
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-sidebar-foreground/70 px-2 py-1">Relatórios</h3>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleUnpaidDebts}
          >
            <AlertCircle className="h-4 w-4" />
            Dívidas em Aberto
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleDebtsByDocument}
          >
            <FileText className="h-4 w-4" />
            Dívidas por Documento
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleRevenueReport}
          >
            <BarChart3 className="h-4 w-4" />
            Receita por Período
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Botão de Logout */}
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair do Sistema
          </Button>
        </div>
      </div>
    </div>
  );
}
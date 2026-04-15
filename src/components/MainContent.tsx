import React, { useContext } from 'react';
import { AppContext } from '../App';
import { TabBar } from './TabBar';
import { PersonManagement } from './PersonManagement';
import { DebtManagement } from './DebtManagement';
import { PaymentManagement } from './PaymentManagement';
import { UnpaidDebtsReport } from './reports/UnpaidDebtsReport';
import { DebtsByDocumentReport } from './reports/DebtsByDocumentReport';
import { RevenueReport } from './reports/RevenueReport';

export function MainContent() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { openTabs, activeTabId, usuarioLogado } = context;
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex-1 flex flex-col">
      <TabBar />
      
      <div className="flex-1 bg-background">
        {!activeTab ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl text-foreground">Bem-vindo ao CairuPay, {usuarioLogado?.nome}!</h2>
                <p className="text-muted-foreground">Sistema de Gestão de Dívidas</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Selecione uma opção da barra lateral para começar:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mt-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Gestão de Pessoas:</strong> Cadastre e gerencie clientes</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Gestão de Dívidas:</strong> Controle todas as dívidas</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Relatórios:</strong> Acompanhe receitas e pendências</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full p-6">
            {activeTab.type === 'pessoa' && <PersonManagement tab={activeTab} />}
            {activeTab.type === 'divida' && <DebtManagement tab={activeTab} />}
            {activeTab.type === 'pagamento' && <PaymentManagement tab={activeTab} />}
            {activeTab.type === 'dividas-abertas' && <UnpaidDebtsReport />}
            {activeTab.type === 'dividas-por-documento' && <DebtsByDocumentReport />}
            {activeTab.type === 'relatorio-receita' && <RevenueReport />}
          </div>
        )}
      </div>
    </div>
  );
}
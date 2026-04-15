import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { X, Users, FileText, CreditCard, AlertCircle, BarChart3 } from 'lucide-react';

const getTabIcon = (type: string) => {
  switch (type) {
    case 'pessoa':
      return <Users className="h-4 w-4" />;
    case 'divida':
      return <FileText className="h-4 w-4" />;
    case 'pagamento':
      return <CreditCard className="h-4 w-4" />;
    case 'dividas-abertas':
      return <AlertCircle className="h-4 w-4" />;
    case 'dividas-por-documento':
      return <FileText className="h-4 w-4" />;
    case 'relatorio-receita':
      return <BarChart3 className="h-4 w-4" />;
    default:
      return null;
  }
};

export function TabBar() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { openTabs, activeTabId, setActiveTab, closeTab } = context;

  if (openTabs.length === 0) {
    return (
      <div className="h-12 border-b border-border bg-muted/20">
        <div className="flex items-center h-full px-4">
          <span className="text-sm text-muted-foreground">Nenhum documento aberto</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-muted/20">
      <div className="flex items-center">
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              flex items-center gap-2 px-4 py-3 border-r border-border cursor-pointer
              transition-colors duration-200
              ${activeTabId === tab.id 
                ? 'bg-background border-b-2 border-b-primary' 
                : 'bg-muted/10 hover:bg-muted/30'
              }
            `}
            onClick={() => setActiveTab(tab.id)}
          >
            {getTabIcon(tab.type)}
            <span className="text-sm max-w-32 truncate">{tab.title}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive/20"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
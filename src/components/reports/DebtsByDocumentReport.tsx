import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FileText, Search, Download, Eye, Loader2 } from 'lucide-react';
import { getDividas, DividaData } from '../../services/api';
import { toast } from 'sonner';

export function DebtsByDocumentReport() {
  const [termoBusca, setTermoBusca] = useState('');
  const [dividas, setDividas] = useState<DividaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const data = await getDividas();
      setDividas(data);
    } catch (error) {
      toast.error('Erro ao carregar dívidas');
    } finally {
      setLoading(false);
    }
  };

  const dividasFiltradas = dividas.filter(divida =>
    divida.devedorNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    divida.credorNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    divida.devedorDocumento.toLowerCase().includes(termoBusca.toLowerCase()) ||
    divida.credorDocumento.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const totalValorOriginal = dividasFiltradas.reduce((soma, divida) => soma + Number(divida.valorDivida), 0);
  const totalValorPago = dividasFiltradas.reduce((soma, divida) => soma + Number(divida.valorPago), 0);
  const totalValorRestante = dividasFiltradas.reduce((soma, divida) => soma + Number(divida.valorRestante), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paga':
        return <Badge variant="default" className="bg-green-500">Paga</Badge>;
      case 'pendente':
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPercentualPagamento = (pago: number, original: number) => {
    return original > 0 ? Math.round((pago / original) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Relatório de Dívidas por Documento
        </h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Dívidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dividasFiltradas.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Dívidas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Original</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalValorOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total das dívidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalValorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalValorOriginal > 0 ? Math.round((totalValorPago / totalValorOriginal) * 100) : 0}% pago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Valor Restante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalValorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo em aberto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtro */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="busca">Buscar por documento ou pessoa</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busca"
                  placeholder="Buscar..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Dívidas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Devedor</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Valor Original</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Valor Restante</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dividasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Nenhuma dívida encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  dividasFiltradas.map((divida) => {
                    const percentual = getPercentualPagamento(Number(divida.valorPago), Number(divida.valorDivida));
                    return (
                      <TableRow key={divida.codigo}>
                        <TableCell className="font-medium">#{divida.codigo}</TableCell>
                        <TableCell>{divida.devedorNome}</TableCell>
                        <TableCell>{divida.devedorDocumento}</TableCell>
                        <TableCell>R$ {Number(divida.valorDivida).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-green-600">
                          R$ {Number(divida.valorPago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-destructive">
                          R$ {Number(divida.valorRestante).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${percentual}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{percentual}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(divida.status)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
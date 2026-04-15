import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { AlertCircle, Search, Download, Loader2 } from 'lucide-react';
import { getDividasAbertas, DividaData } from '../../services/api';
import { toast } from 'sonner';

export function UnpaidDebtsReport() {
  const [termoBusca, setTermoBusca] = useState('');
  const [dividasAbertas, setDividasAbertas] = useState<DividaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const data = await getDividasAbertas();
      setDividasAbertas(data);
    } catch (error) {
      toast.error('Erro ao carregar dívidas em aberto');
    } finally {
      setLoading(false);
    }
  };

  const dividasFiltradas = dividasAbertas.filter(divida =>
    divida.devedorNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    divida.credorNome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    divida.devedorDocumento.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const totalAberto = dividasFiltradas.reduce((soma, divida) => soma + Number(divida.valorRestante), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          Relatório de Dívidas em Aberto
        </h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total em Aberto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalAberto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {dividasFiltradas.length} dívida(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dívida Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dividasFiltradas.length > 0 ? (totalAberto / dividasFiltradas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Por dívida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Devedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(dividasFiltradas.map(d => d.devedorId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Devedores com pendências
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtro */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Dívidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="busca">Buscar por pessoa ou documento</Label>
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

      {/* Tabela de Dívidas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Dívidas em Aberto</CardTitle>
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
                  <TableHead>Credor</TableHead>
                  <TableHead>Devedor</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Valor Restante</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dividasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhuma dívida em aberto encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  dividasFiltradas.map((divida) => (
                    <TableRow key={divida.codigo}>
                      <TableCell className="font-medium">#{divida.codigo}</TableCell>
                      <TableCell>{divida.credorNome}</TableCell>
                      <TableCell>{divida.devedorNome}</TableCell>
                      <TableCell>R$ {Number(divida.valorDivida).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-green-600">R$ {Number(divida.valorPago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-destructive font-medium">R$ {Number(divida.valorRestante).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell><Badge variant="secondary">Pendente</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
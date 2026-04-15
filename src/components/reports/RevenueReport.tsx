import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Download, Loader2 } from 'lucide-react';
import { getReceitaPorPeriodo, ReceitaDiariaData } from '../../services/api';
import { toast } from 'sonner';

export function RevenueReport() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dadosReceita, setDadosReceita] = useState<ReceitaDiariaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregado, setCarregado] = useState(false);

  const carregarDados = async () => {
    if (!dataInicio || !dataFim) {
      toast.error('Selecione o período');
      return;
    }

    setLoading(true);
    try {
      const data = await getReceitaPorPeriodo(dataInicio, dataFim);
      setDadosReceita(data);
      setCarregado(true);
    } catch (error) {
      toast.error('Erro ao carregar dados de receita');
    } finally {
      setLoading(false);
    }
  };

  const receitaTotal = dadosReceita.reduce((soma, dia) => soma + Number(dia.valor), 0);
  const pagamentosTotal = dadosReceita.reduce((soma, dia) => soma + dia.pagamentos, 0);
  const mediaDiaria = dadosReceita.length > 0 ? receitaTotal / dadosReceita.length : 0;
  const diasAtivos = dadosReceita.filter(dia => Number(dia.valor) > 0).length;

  const dadosGrafico = dadosReceita.map(item => ({
    ...item,
    valor: Number(item.valor),
    dataFormatada: new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Relatório de Receita por Período
        </h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtro de Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtro de Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={carregarDados} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Carregando...
                  </>
                ) : (
                  'Aplicar Filtro'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {carregado && (
        <>
          {/* Cartões de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatarMoeda(receitaTotal)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total do período
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pagamentosTotal}
                </div>
                <p className="text-xs text-muted-foreground">
                  Transações de pagamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Média Diária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatarMoeda(mediaDiaria)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Por dia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Dias Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {diasAtivos}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dias com receita
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Receita */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="dataFormatada" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatarMoeda(value), 'Receita']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Receita Diária"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Volume de Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Volume de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="dataFormatada" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Pagamentos']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="pagamentos" 
                      fill="#82ca9d"
                      name="Número de Pagamentos"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!carregado && !loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione um período e clique em "Aplicar Filtro" para visualizar o relatório</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
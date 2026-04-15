import React, { useState, useEffect } from 'react';
import { TabItem } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Save, Trash2, Edit, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPagamentos, createPagamento, deletePagamento, getDividas, PagamentoData, DividaData } from '../services/api';

interface PaymentManagementProps {
  tab: TabItem;
}

export function PaymentManagement({ tab }: PaymentManagementProps) {
  const [pagamentos, setPagamentos] = useState<PagamentoData[]>([]);
  const [dividas, setDividas] = useState<DividaData[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dividaCodigo: '',
    valorPago: '',
    dataPagamento: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isListMode = tab.data?.mode === 'list';

  useEffect(() => {
    carregarDividas();
    if (isListMode) {
      carregarPagamentos();
    }
  }, [isListMode]);

  const carregarDividas = async () => {
    try {
      const data = await getDividas();
      setDividas(data);
    } catch (error) {
      toast.error('Erro ao carregar dívidas');
    }
  };

  const carregarPagamentos = async () => {
    setLoading(true);
    try {
      const data = await getPagamentos();
      setPagamentos(data);
    } catch (error) {
      toast.error('Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dividaCodigo) {
      newErrors.dividaCodigo = 'Dívida é obrigatória';
    }

    if (!formData.valorPago.trim()) {
      newErrors.valorPago = 'Valor é obrigatório';
    } else if (isNaN(Number(formData.valorPago)) || Number(formData.valorPago) <= 0) {
      newErrors.valorPago = 'Valor deve ser um número válido e positivo';
    }

    if (!formData.dataPagamento.trim()) {
      newErrors.dataPagamento = 'Data do pagamento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await createPagamento({
          dividaCodigo: Number(formData.dividaCodigo),
          dataPagamento: formData.dataPagamento,
          valorPago: Number(formData.valorPago)
        });
        toast.success('Pagamento registrado com sucesso!');
        setFormData({ dividaCodigo: '', valorPago: '', dataPagamento: '' });
        setErrors({});
      } catch (error: any) {
        toast.error(error.message || 'Erro ao registrar pagamento');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`Tem certeza que deseja excluir este pagamento?`)) {
      try {
        await deletePagamento(id);
        toast.success('Pagamento excluído com sucesso!');
        carregarPagamentos();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao excluir pagamento');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>{isListMode ? 'Lista de Pagamentos' : 'Cadastro de Pagamento'}</h2>
      </div>

      {!isListMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Informações do Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dividaCodigo">Dívida *</Label>
                  <Select
                    value={formData.dividaCodigo}
                    onValueChange={(value) => setFormData({ ...formData, dividaCodigo: value })}
                  >
                    <SelectTrigger className={errors.dividaCodigo ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione a dívida" />
                    </SelectTrigger>
                    <SelectContent>
                      {dividas.filter(d => d.status !== 'paga').map((divida) => (
                        <SelectItem key={divida.codigo} value={String(divida.codigo)}>
                          #{divida.codigo} - {divida.devedorNome} (R$ {Number(divida.valorRestante).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.dividaCodigo && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.dividaCodigo}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorPago">Valor do Pagamento (R$) *</Label>
                  <Input
                    id="valorPago"
                    type="number"
                    step="0.01"
                    value={formData.valorPago}
                    onChange={(e) => setFormData({ ...formData, valorPago: e.target.value })}
                    placeholder="0,00"
                    className={errors.valorPago ? 'border-destructive' : ''}
                  />
                  {errors.valorPago && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.valorPago}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
                  <Input
                    id="dataPagamento"
                    type="date"
                    value={formData.dataPagamento}
                    onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
                    className={errors.dataPagamento ? 'border-destructive' : ''}
                  />
                  {errors.dataPagamento && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.dataPagamento}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Registrar Pagamento
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setFormData({ dividaCodigo: '', valorPago: '', dataPagamento: '' });
                    setErrors({});
                  }}
                >
                  Limpar Formulário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isListMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pagamentos Registrados
            </CardTitle>
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
                    <TableHead>ID</TableHead>
                    <TableHead>Dívida</TableHead>
                    <TableHead>Devedor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Nenhum pagamento registrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagamentos.map((pagamento) => (
                      <TableRow key={pagamento.idpag}>
                        <TableCell>#{pagamento.idpag}</TableCell>
                        <TableCell>#{pagamento.divida?.codigo}</TableCell>
                        <TableCell>{pagamento.divida?.devedor?.nomeCliente}</TableCell>
                        <TableCell>R$ {Number(pagamento.valorPago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(pagamento.idpag)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
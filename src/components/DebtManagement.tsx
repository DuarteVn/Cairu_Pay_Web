import React, { useState, useEffect } from 'react';
import { TabItem } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Save, Trash2, Edit, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getDividas, createDivida, deleteDivida, getPessoas, DividaData, PessoaData } from '../services/api';

interface DebtManagementProps {
  tab: TabItem;
}

export function DebtManagement({ tab }: DebtManagementProps) {
  const [dividas, setDividas] = useState<DividaData[]>([]);
  const [pessoas, setPessoas] = useState<PessoaData[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    credorId: '',
    devedorId: '',
    valorDivida: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isListMode = tab.data?.mode === 'list';

  useEffect(() => {
    carregarPessoas();
    if (isListMode) {
      carregarDividas();
    }
  }, [isListMode]);

  const carregarPessoas = async () => {
    try {
      const data = await getPessoas();
      setPessoas(data);
    } catch (error) {
      toast.error('Erro ao carregar pessoas');
    }
  };

  const carregarDividas = async () => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.credorId) {
      newErrors.credorId = 'Credor é obrigatório';
    }

    if (!formData.devedorId) {
      newErrors.devedorId = 'Devedor é obrigatório';
    }

    if (formData.credorId && formData.devedorId && formData.credorId === formData.devedorId) {
      newErrors.devedorId = 'Devedor não pode ser o mesmo que o credor';
    }

    if (!formData.valorDivida.trim()) {
      newErrors.valorDivida = 'Valor é obrigatório';
    } else if (isNaN(Number(formData.valorDivida)) || Number(formData.valorDivida) <= 0) {
      newErrors.valorDivida = 'Valor deve ser um número válido e positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await createDivida({
          credorId: Number(formData.credorId),
          devedorId: Number(formData.devedorId),
          valorDivida: Number(formData.valorDivida)
        });
        toast.success('Dívida salva com sucesso!');
        setFormData({ credorId: '', devedorId: '', valorDivida: '' });
        setErrors({});
      } catch (error: any) {
        toast.error(error.message || 'Erro ao salvar dívida');
      }
    }
  };

  const handleDelete = async (codigo: number) => {
    if (confirm(`Tem certeza que deseja excluir a dívida #${codigo}?`)) {
      try {
        await deleteDivida(codigo);
        toast.success('Dívida excluída com sucesso!');
        carregarDividas();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao excluir dívida');
      }
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>{isListMode ? 'Lista de Dívidas' : 'Cadastro de Dívida'}</h2>
      </div>

      {!isListMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Informações da Dívida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="credorId">Credor *</Label>
                  <Select
                    value={formData.credorId}
                    onValueChange={(value) => setFormData({ ...formData, credorId: value })}
                  >
                    <SelectTrigger className={errors.credorId ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione o credor" />
                    </SelectTrigger>
                    <SelectContent>
                      {pessoas.map((pessoa) => (
                        <SelectItem key={pessoa.idPessoa} value={String(pessoa.idPessoa)}>
                          {pessoa.nomeCliente} ({pessoa.documento})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.credorId && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.credorId}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="devedorId">Devedor *</Label>
                  <Select
                    value={formData.devedorId}
                    onValueChange={(value) => setFormData({ ...formData, devedorId: value })}
                  >
                    <SelectTrigger className={errors.devedorId ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione o devedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {pessoas.map((pessoa) => (
                        <SelectItem key={pessoa.idPessoa} value={String(pessoa.idPessoa)}>
                          {pessoa.nomeCliente} ({pessoa.documento})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.devedorId && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.devedorId}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="valorDivida">Valor (R$) *</Label>
                  <Input
                    id="valorDivida"
                    type="number"
                    step="0.01"
                    value={formData.valorDivida}
                    onChange={(e) => setFormData({ ...formData, valorDivida: e.target.value })}
                    placeholder="0,00"
                    className={errors.valorDivida ? 'border-destructive' : ''}
                  />
                  {errors.valorDivida && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.valorDivida}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Dívida
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setFormData({ credorId: '', devedorId: '', valorDivida: '' });
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
              <FileText className="h-5 w-5" />
              Dívidas Cadastradas
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
                    <TableHead>Código</TableHead>
                    <TableHead>Credor</TableHead>
                    <TableHead>Devedor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dividas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Nenhuma dívida cadastrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    dividas.map((divida) => (
                      <TableRow key={divida.codigo}>
                        <TableCell>#{divida.codigo}</TableCell>
                        <TableCell>{divida.credorNome}</TableCell>
                        <TableCell>{divida.devedorNome}</TableCell>
                        <TableCell>R$ {Number(divida.valorDivida).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-green-600">R$ {Number(divida.valorPago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{getStatusBadge(divida.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(divida.codigo)}
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
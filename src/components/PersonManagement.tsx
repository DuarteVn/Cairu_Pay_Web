import React, { useState, useEffect } from 'react';
import { TabItem } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Save, Trash2, Edit, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPessoas, createPessoa, deletePessoa, PessoaData } from '../services/api';

const UF_LIST = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

interface PersonManagementProps {
  tab: TabItem;
}

export function PersonManagement({ tab }: PersonManagementProps) {
  const [pessoas, setPessoas] = useState<PessoaData[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nomeCliente: '',
    email: '',
    telefone: '',
    documento: '',
    endereco: '',
    uf: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isListMode = tab.data?.mode === 'list';

  useEffect(() => {
    if (isListMode) {
      carregarPessoas();
    }
  }, [isListMode]);

  const carregarPessoas = async () => {
    setLoading(true);
    try {
      const data = await getPessoas();
      setPessoas(data);
    } catch (error) {
      toast.error('Erro ao carregar pessoas');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCliente.trim()) {
      newErrors.nomeCliente = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.documento.trim()) {
      newErrors.documento = 'Documento é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await createPessoa(formData);
        toast.success('Pessoa salva com sucesso!');
        setFormData({ nomeCliente: '', email: '', telefone: '', documento: '', endereco: '', uf: '' });
        setErrors({});
      } catch (error: any) {
        toast.error(error.message || 'Erro ao salvar pessoa');
      }
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir ${nome}?`)) {
      try {
        await deletePessoa(id);
        toast.success('Pessoa excluída com sucesso!');
        carregarPessoas();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao excluir pessoa');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>{isListMode ? 'Lista de Pessoas' : 'Cadastro de Pessoa'}</h2>
      </div>

      {!isListMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Informações da Pessoa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCliente">Nome Completo *</Label>
                  <Input
                    id="nomeCliente"
                    value={formData.nomeCliente}
                    onChange={(e) => setFormData({ ...formData, nomeCliente: e.target.value })}
                    className={errors.nomeCliente ? 'border-destructive' : ''}
                  />
                  {errors.nomeCliente && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.nomeCliente}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documento">Documento (CPF/CNPJ) *</Label>
                  <Input
                    id="documento"
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    className={errors.documento ? 'border-destructive' : ''}
                  />
                  {errors.documento && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.documento}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className={errors.telefone ? 'border-destructive' : ''}
                  />
                  {errors.telefone && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.telefone}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Select
                    value={formData.uf}
                    onValueChange={(value) => setFormData({ ...formData, uf: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {UF_LIST.map(uf => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Pessoa
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setFormData({ nomeCliente: '', email: '', telefone: '', documento: '', endereco: '', uf: '' });
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
            <CardTitle>Pessoas Cadastradas</CardTitle>
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>UF</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pessoas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Nenhuma pessoa cadastrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    pessoas.map((pessoa) => (
                      <TableRow key={pessoa.idPessoa}>
                        <TableCell>{pessoa.nomeCliente}</TableCell>
                        <TableCell>{pessoa.documento}</TableCell>
                        <TableCell>{pessoa.email}</TableCell>
                        <TableCell>{pessoa.telefone}</TableCell>
                        <TableCell>{pessoa.uf}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(pessoa.idPessoa!, pessoa.nomeCliente)}
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
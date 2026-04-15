import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { login as apiLogin, LoginResponseData } from '../services/api';

interface LoginProps {
  onLogin: (usuario: LoginResponseData) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'Usuário é obrigatório';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 4) {
      newErrors.senha = 'Senha deve ter pelo menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setCarregando(true);
    
    try {
      const response = await apiLogin(formData.usuario, formData.senha);
      toast.success('Login realizado com sucesso!');
      onLogin(response);
    } catch (error) {
      toast.error('Usuário ou senha incorretos');
      setErrors({ 
        usuario: 'Credenciais inválidas',
        senha: 'Credenciais inválidas'
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">CairuPay</CardTitle>
              <p className="text-muted-foreground">Sistema de Gestão de Dívidas</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="usuario"
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => handleInputChange('usuario', e.target.value)}
                    className={`pl-9 ${errors.usuario ? 'border-destructive' : ''}`}
                    placeholder="Digite seu usuário"
                    disabled={carregando}
                  />
                </div>
                {errors.usuario && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.usuario}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    className={`pl-9 pr-9 ${errors.senha ? 'border-destructive' : ''}`}
                    placeholder="Digite sua senha"
                    disabled={carregando}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 px-0"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    disabled={carregando}
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.senha && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.senha}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={carregando}
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© 2026 CairuPay - Sistema de Gestão de Dívidas</p>
        </div>
      </div>
    </div>
  );
}
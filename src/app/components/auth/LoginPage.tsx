import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined,
            data: {
              full_name: '',
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          toast.success('Cadastro realizado com sucesso! Bem-vindo!');
          onLoginSuccess();
        } else if (data.user && !data.session) {
          toast.info('Cadastro realizado! Verifique seu e-mail para confirmar a conta, ou tente fazer login.');
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message === 'Email not confirmed') {
            toast.error('E-mail não confirmado. Entre em contato com o suporte ou tente se cadastrar novamente.');
          } else if (error.message === 'Invalid login credentials') {
            toast.error('E-mail ou senha incorretos. Verifique suas credenciais.');
          } else if (error.message === 'User not found') {
            toast.error('Usuário não encontrado. Verifique o e-mail ou cadastre-se.');
          } else {
            toast.error(error.message || 'Erro na autenticação');
          }
          return;
        }

        if (data.session) {
          toast.success('Login realizado com sucesso!');
          onLoginSuccess();
        }
      }
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg === 'Email not confirmed') {
        toast.error('E-mail não confirmado. Verifique sua caixa de entrada ou contate o suporte.');
      } else if (msg === 'Invalid login credentials') {
        toast.error('E-mail ou senha incorretos.');
      } else if (msg.includes('Password should be at least')) {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
      } else if (msg.includes('already registered') || msg.includes('User already registered')) {
        toast.error('Este e-mail já está cadastrado. Tente fazer login.');
        setIsSignUp(false);
      } else {
        toast.error(msg || 'Erro na autenticação');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-transparent pointer-events-none" />
      
      <Card className="w-full max-w-md border-border bg-surface relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/logobranca.svg" alt="NAVEX Finance" className="h-12 w-auto" />
          </div>
          <CardDescription className="text-center text-text-dim">
            {isSignUp
              ? 'Preencha os dados para começar sua gestão financeira'
              : 'Entre com suas credenciais para acessar o painel'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? 'Mínimo 6 caracteres' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background border-border"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-accent-purple to-accent-purple/80 text-white hover:from-accent-purple/90 hover:to-accent-purple/70 font-bold text-lg h-12 shadow-[0_0_30px_rgba(124,58,237,0.4)] mt-6 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Carregando...' : (isSignUp ? 'REGISTRAR' : 'ENTRAR')}
            </Button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-text-dim hover:text-accent-purple transition-colors"
            >
              {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

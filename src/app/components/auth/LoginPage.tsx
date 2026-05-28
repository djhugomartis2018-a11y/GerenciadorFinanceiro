import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

const SUPABASE_URL = 'https://jughxjhaqaearaamlglp.supabase.co';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          toast.error('As senhas não coincidem. Verifique e tente novamente.');
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/custom-signup`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          }
        );

        const result = await res.json();

        if (!res.ok) {
          if (result.error?.includes('já está cadastrado')) {
            toast.error('Este e-mail já está cadastrado. Tente fazer login.');
            setIsSignUp(false);
          } else {
            toast.error(result.error || 'Erro ao criar conta. Tente novamente.');
          }
          return;
        }

        setEmailSent(true);
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
      } else if (msg.toLowerCase().includes('sending confirmation email') || msg.toLowerCase().includes('error sending')) {
        toast.error('Não foi possível enviar o e-mail de confirmação. Tente novamente em alguns minutos.');
      } else {
        toast.error(msg || 'Erro na autenticação');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-transparent pointer-events-none" />
        <Card className="w-full max-w-md border-border bg-surface relative z-10">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <img src="/logobranca.svg" alt="NAVEX Finance" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-center text-xl">Confirme seu e-mail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-text-dim text-sm">
              Enviamos um link de confirmação para:
            </p>
            <p className="font-semibold text-foreground">{email}</p>
            <p className="text-text-dim text-sm">
              Acesse seu e-mail e clique no link para ativar sua conta. Após confirmar, volte aqui para fazer login.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-accent-purple to-accent-purple/80 text-white hover:from-accent-purple/90 hover:to-accent-purple/70 font-bold h-11 shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-300"
              onClick={() => { setEmailSent(false); setIsSignUp(false); setPassword(''); setConfirmPassword(''); }}
            >
              IR PARA O LOGIN
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background border-border"
                />
              </div>
            )}
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
              onClick={() => { setIsSignUp(!isSignUp); setConfirmPassword(''); }}
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

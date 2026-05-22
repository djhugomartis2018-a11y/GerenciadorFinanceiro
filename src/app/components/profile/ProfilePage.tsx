import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { toast } from 'sonner';
import { User, Camera, LogOut, Save } from 'lucide-react';

export function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    avatar_url: string;
  } | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setProfile({
        id: user.id,
        full_name: data?.full_name || '',
        avatar_url: data?.avatar_url || '',
      });
    } catch (error: any) {
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    if (!profile) return;
    setUpdating(true);

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setUpdating(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!event.target.files || event.target.files.length === 0 || !profile) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

      setUpdating(true);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Foto carregada! Clique em Salvar para confirmar.');
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao carregar foto: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando perfil...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <Button 
          variant="outline" 
          onClick={() => supabase.auth.signOut()}
          className="text-red-500 border-red-500/20 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-accent-lime">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-surface-hover">
                  <User className="w-12 h-12 text-text-dim" />
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-accent-lime text-black rounded-full cursor-pointer hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                  disabled={updating}
                />
              </label>
            </div>
            <p className="text-sm text-text-dim">Clique no ícone para alterar sua foto</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              value={profile?.full_name || ''}
              onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
              placeholder="Seu nome"
              className="bg-background border-border"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={updateProfile} 
            disabled={updating}
            className="w-full bg-accent-lime text-black hover:bg-accent-lime/90 font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            {updating ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

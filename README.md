# 💰 Salário Pro - Gerenciador Financeiro

Sistema completo de gerenciamento financeiro pessoal com design premium e responsividade total.

## ✨ Características

### 📊 Funcionalidades Principais
- **Dashboard Completo**: Visão geral de receitas, despesas e patrimônio
- **Gestão por Mês**: Controle detalhado de cada período
- **Receitas e Despesas**: Categorização entre custos fixos e variáveis
- **Metas Financeiras**: Acompanhamento de objetivos de poupança
- **Histórico Visual**: Gráficos evolutivos com Chart.js
- **Autenticação Segura**: Login via Supabase

### 📱 Responsividade Total
- **Mobile First**: Otimizado para smartphones (320px+)
- **Tablet**: Layout adaptativo para telas médias
- **Desktop**: Interface completa para telas grandes
- **4K Ready**: Suporte para displays de alta resolução

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 6
- **Estilização**: Tailwind CSS 4 + shadcn/ui
- **Gráficos**: Chart.js + React-ChartJS-2
- **Backend**: Supabase (Auth + Database)
- **UI Components**: Radix UI primitivos

## 🚀 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/djhugomartis2018-a11y/Gerenciadorfinanceiro.git

# Entre no diretório
cd Gerenciadorfinanceiro

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Build para Produção

```bash
# Gera build otimizado
pnpm build

# Preview do build
pnpm preview
```

## 📐 Estrutura do Projeto

```
Gerenciadorfinanceiro/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Componente principal
│   │   └── components/
│   │       ├── auth/            # Componentes de autenticação
│   │       ├── profile/         # Perfil do usuário
│   │       └── ui/              # Componentes shadcn/ui
│   ├── lib/
│   │   └── supabase.ts          # Cliente Supabase
│   ├── styles/
│   │   ├── theme.css            # Variáveis de tema
│   │   ├── mobile-responsive.css # Sistema responsivo
│   │   └── index.css            # CSS global
│   └── main.tsx                 # Entry point
├── supabase/                    # Configuração do Supabase
├── package.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

### Cores
- **Background**: `#0a0a0a` (Dark)
- **Surface**: `#1a1a1a`
- **Accent**: `#b4f51d` (Lime Green)
- **Blue**: `#3d91ff`
- **Red**: `#ff4d4d`

### Responsividade
- **Mobile Small**: 320px - 479px
- **Mobile Medium**: 480px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔐 Configuração do Supabase

O projeto está conectado ao Supabase para autenticação. As credenciais estão em `src/lib/supabase.ts`:

```typescript
const supabaseUrl = "https://jughxjhaqaearaamlglp.supabase.co";
const supabaseAnonKey = "[sua-chave-anon]";
```

## 📦 Deploy

### Vercel (Recomendado)
O projeto está configurado para deploy automático no Vercel.

```bash
# Usando Vercel CLI
vercel
```

### Outras Plataformas
O build gerado em `dist/` pode ser hospedado em qualquer serviço de hosting estático.

## 🧪 Funcionalidades em Desenvolvimento

- [ ] Exportação de relatórios em PDF
- [ ] Integração com Open Banking
- [ ] Modo escuro/claro (toggle)
- [ ] Notificações push
- [ ] App mobile nativo

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso pessoal.

## 👤 Autor

**Hugo Martis**
- GitHub: [@djhugomartis2018-a11y](https://github.com/djhugomartis2018-a11y)

---

Desenvolvido com ❤️ para gestão financeira inteligente

# DC Technologies — Landing Page

Landing page premium para DC Technologies, construída com Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion e GSAP.

Estética inspirada em [Vercel](https://vercel.com/home), [Stripe](https://stripe.com/br) e [Linear](https://linear.app/homepage).

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion + GSAP (hero)
- GitHub API (portfólio híbrido)
- Resend (formulário de contato)
- Deploy: [Vercel](https://vercel.com)

## Começar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `GITHUB_USERNAME` | Para portfólio | Usuário/org GitHub |
| `GITHUB_TOKEN` | Recomendado | Token para rate limit e dados extras |
| `RESEND_API_KEY` | Para contato | API key do [Resend](https://resend.com) |
| `CONTACT_TO_EMAIL` | Para contato | E-mail destino |
| `CONTACT_FROM_EMAIL` | Para contato | Remetente verificado no Resend |
| `NEXT_PUBLIC_SITE_URL` | SEO | URL pública do site |
| `API_SECRET` | Opcional | Protege `GET /api/github/repos` |
| `ADMIN_PASSWORD` | Admin | Senha do painel em `/admin` |
| `KV_REDIS_URL` | Admin | Injetado ao conectar Redis na Vercel |

## Links externos (CTAs)

Configurados em [`src/lib/links.ts`](src/lib/links.ts):

| Ação | Destino |
|------|---------|
| WhatsApp (flutuante, header, hero) | https://w.app/dctechnologies |
| Iniciar projeto (CTA) | https://calendly.com/dctechnologiesoficial/30min |
| Contato (menu) | `#contato` — formulário por e-mail |

## Tema claro / escuro

Toggle no header (`next-themes`). Tokens em `src/app/globals.css` (`:root` light, `.dark` escuro).

## Painel Admin + Redis

1. Na Vercel: **Storage → Redis** → conectar ao projeto `dctechnologies`
2. A Vercel injeta `KV_REDIS_URL` automaticamente
3. Defina `ADMIN_PASSWORD` (senha forte) nas variáveis de ambiente
4. Redeploy
5. Acesse `https://seu-dominio.vercel.app/admin`

No painel você define cada repositório como **Finalizado**, **Em andamento** ou **Oculto**. As alterações são salvas na chave `portfolio:overrides` no Redis e refletem no site público (cache GitHub ~60s).

Local: copie `KV_REDIS_URL` do Redis Cloud (Connect → Javascript node-redis) para `.env.local`.

Fallback: [`src/data/projects-overrides.ts`](src/data/projects-overrides.ts) — o Redis tem prioridade sobre o arquivo.

## Portfólio híbrido

1. Defina `GITHUB_USERNAME` no `.env.local`
2. Edite [`src/data/projects-overrides.ts`](src/data/projects-overrides.ts) para enriquecer cada repo:

```ts
{
  repoFullName: "usuario/meu-repo",
  featured: true,
  priority: 10,
  category: "finished",
  thumbnail: "/projects/case.png",
  demoUrl: "https://demo.exemplo.com",
  professionalDescription: "Descrição do case.",
}
```

## Deploy na Vercel

1. Importe o repositório na Vercel
2. Configure as variáveis de ambiente
3. Verifique domínio no Resend para `CONTACT_FROM_EMAIL`
4. Deploy automático a cada push

```bash
vercel deploy
```

## Estrutura

```
src/
├── app/          # Rotas, API, SEO
├── components/   # UI, brand, layout, portfolio
├── sections/     # Seções da landing
├── data/         # Conteúdo e overrides
├── lib/          # Utils, merge, SEO
├── services/     # GitHub, Resend
└── types/        # TypeScript
```

## Assets de marca

Logos e ícones em `public/brand/` (**sempre minúsculo** `public`, não `Public`).

No Windows, `Public` e `public` parecem iguais, mas na Vercel (Linux) só `public/` é servido pelo Next.js. Imagens 404 em produção costumam ser essa pasta com nome errado no Git.

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run start` — servidor de produção
- `npm run lint` — ESLint
# Portfolio

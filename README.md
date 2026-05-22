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

Logos e ícones em `public/brand/` (copiados de `Public/`).

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run start` — servidor de produção
- `npm run lint` — ESLint
# Portfolio

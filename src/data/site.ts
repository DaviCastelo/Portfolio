import {
  Bot,
  Code2,
  Database,
  Globe,
  LayoutDashboard,
  Plug,
} from "lucide-react";
import { CALENDLY_URL, WHATSAPP_URL } from "@/lib/links";

export const navLinks = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#tecnologias", label: "Tecnologias" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#processo", label: "Processo" },
  { href: "#contato", label: "Contato" },
];

export const hero = {
  headline: "Software que acelera seu negócio",
  highlightWord: "acelera",
  subtitle:
    "Desenvolvemos produtos digitais premium — do MVP ao scale — com engenharia de ponta e design que converte.",
  primaryCta: { label: "Falar com especialista", href: WHATSAPP_URL, external: true },
  secondaryCta: { label: "Ver projetos", href: "#portfolio", external: false },
};

export const trustMetrics = [
  { value: "50+", label: "Projetos entregues" },
  { value: "99%", label: "Satisfação dos clientes" },
  { value: "24h", label: "Tempo médio de resposta" },
  { value: "6×", label: "Mais rápido ao mercado" },
];

export const about = {
  index: "02",
  label: "Sobre",
  title: "Engenharia com propósito",
  highlightWord: "propósito",
  description:
    "A DC Technologies une estratégia, design e código para transformar ideias em produtos digitais que geram resultado. Trabalhamos como extensão do seu time — com transparência, velocidade e qualidade de nível enterprise.",
  points: [
    "Arquitetura escalável desde o primeiro commit",
    "Design system consistente e acessível",
    "Deploy contínuo e observabilidade",
    "Comunicação clara em cada sprint",
  ],
};

export const services = [
  {
    id: "web",
    title: "Desenvolvimento Web",
    description:
      "Sites e aplicações web rápidas, responsivas e otimizadas para SEO e conversão.",
    icon: Globe,
    featured: true,
  },
  {
    id: "saas",
    title: "SaaS",
    description:
      "Plataformas multi-tenant com billing, auth e painéis administrativos.",
    icon: LayoutDashboard,
    featured: false,
  },
  {
    id: "apis",
    title: "APIs",
    description:
      "REST e GraphQL robustas, documentadas e prontas para integrações.",
    icon: Code2,
    featured: false,
  },
  {
    id: "dashboards",
    title: "Dashboards",
    description:
      "Visualização de dados em tempo real com UX clara e performática.",
    icon: Database,
    featured: false,
  },
  {
    id: "automations",
    title: "Automações",
    description:
      "Fluxos inteligentes que eliminam trabalho manual e reduzem erros.",
    icon: Bot,
    featured: false,
  },
  {
    id: "integrations",
    title: "Integrações",
    description:
      "Conectamos CRMs, ERPs, gateways e ferramentas do seu ecossistema.",
    icon: Plug,
    featured: false,
  },
];

export const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Docker",
  "PostgreSQL",
  "Tailwind CSS",
  "Vercel",
];

export const processSteps = [
  {
    step: "01",
    title: "Descoberta",
    description: "Entendemos objetivos, usuários e restrições técnicas.",
  },
  {
    step: "02",
    title: "Arquitetura",
    description: "Definimos stack, escopo e roadmap com entregas incrementais.",
  },
  {
    step: "03",
    title: "Desenvolvimento",
    description: "Sprints com previews, testes e revisões contínuas.",
  },
  {
    step: "04",
    title: "Deploy",
    description: "CI/CD, monitoramento e handoff documentado.",
  },
  {
    step: "05",
    title: "Evolução",
    description: "Suporte, métricas e melhorias pós-lançamento.",
  },
];

export const differentials = [
  {
    title: "Performance extrema",
    description: "Core Web Vitals e Lighthouse 90+ como meta em cada entrega.",
  },
  {
    title: "Código escalável",
    description: "TypeScript, padrões claros e documentação para o time crescer.",
  },
  {
    title: "Design premium",
    description: "Interfaces inspiradas nos melhores produtos globais de tech.",
  },
  {
    title: "Entrega previsível",
    description: "Cronogramas realistas, demos frequentes e zero surpresas.",
  },
];

export const testimonials = [
  {
    quote:
      "A DC entregou nosso dashboard em tempo recorde, com qualidade que superou consultorias maiores.",
    author: "Ana Ribeiro",
    role: "CTO, Startup de Logística",
    metric: "40% menos tempo operacional",
  },
  {
    quote:
      "Integração impecável com nosso ERP. O time técnico da DC falou a nossa língua desde o dia um.",
    author: "Marcos Silva",
    role: "Diretor de Operações",
    metric: "3 sistemas unificados",
  },
  {
    quote:
      "Nosso SaaS saiu do papel para produção em 6 semanas. Performance e UX de nível internacional.",
    author: "Juliana Costa",
    role: "Fundadora, EdTech",
    metric: "2.000 usuários no lançamento",
  },
];

export const cta = {
  title: "Pronto para transformar sua ideia em produto?",
  highlightWord: "transformar",
  description:
    "Agende uma conversa sem compromisso. Vamos entender seu desafio e propor o caminho mais eficiente.",
  button: { label: "Iniciar projeto", href: CALENDLY_URL, external: true },
};

export const contact = {
  index: "11",
  label: "Contato",
  title: "Vamos conversar",
  highlightWord: "conversar",
  description:
    "Conte sobre seu projeto. Respondemos em até 24 horas úteis.",
  email: "contato@dctechnologies.com.br",
};

export const sectionMeta = {
  services: {
    index: "03",
    label: "Serviços",
    title: "Soluções para cada etapa do seu produto",
    highlightWord: "etapa",
    description:
      "Do site institucional à plataforma complexa — entregamos com a mesma obsessão por qualidade.",
  },
  technologies: {
    index: "04",
    label: "Tecnologias",
    title: "Stack moderna e battle-tested",
    highlightWord: "moderna",
    description: "Ferramentas que líderes globais confiam para escalar.",
  },
  portfolio: {
    index: "05",
    label: "Portfólio",
    title: "Projetos que falam por si",
    highlightWord: "falam",
    description:
      "Cases reais integrados ao GitHub, enriquecidos com contexto de negócio.",
  },
  process: {
    index: "06",
    label: "Processo",
    title: "Como trabalhamos",
    highlightWord: "trabalhamos",
    description: "Metodologia clara, entregas frequentes, zero caixa-preta.",
  },
  differentials: {
    index: "07",
    label: "Diferenciais",
    title: "Por que a DC Technologies",
    highlightWord: "DC Technologies",
    description: "O que nos separa no mercado de desenvolvimento.",
  },
  testimonials: {
    index: "08",
    label: "Depoimentos",
    title: "O que dizem nossos parceiros",
    highlightWord: "parceiros",
    description: "Resultados medidos, não apenas prometidos.",
  },
  faq: {
    index: "09",
    label: "FAQ",
    title: "Perguntas frequentes",
    highlightWord: "frequentes",
    description: "Tire suas dúvidas antes de começar.",
  },
};

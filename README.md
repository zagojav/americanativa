# América Nativa — site institucional e loja virtual

Site/loja da **América Nativa LTDA — by AS Market**, importadora e
distribuidora de produtos da Bolívia para o Brasil. Construído com Next.js
(App Router) + TypeScript + Tailwind CSS, pronto para deploy na Vercel.

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # depois preencha com as credenciais reais
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> **Nota de ambiente (Windows):** esta máquina de desenvolvimento tem uma
> política de Application Control que bloqueia binários nativos (`.node`).
> Isso impede o uso do Turbopack (`next dev`/`next build` padrão) e do motor
> Rust do Tailwind v4. Por isso o projeto usa **Tailwind CSS v3** (100% JS,
> sem binário nativo) e os scripts `dev`/`build` do `package.json` já incluem
> a flag `--webpack`. Se for rodar em outra máquina sem essa restrição, os
> scripts continuam funcionando normalmente — não é necessário revertê-los.

## Variáveis de ambiente

Preencha em `.env.local` (nunca commitar este arquivo — já está no
`.gitignore`) antes de publicar em produção:

| Variável | Descrição |
|---|---|
| `MERCADOPAGO_ACCESS_TOKEN` | Access token de produção do Mercado Pago (Checkout Pro). |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Public key do Mercado Pago. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp da loja (formato `55DDDNUMERO`, sem símbolos). |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site em produção (usada nas `back_urls` do checkout, no sitemap e no robots.txt). |

## Estrutura de dados dos produtos

O catálogo vive em [data/produtos.json](data/produtos.json) (fácil de editar
manualmente enquanto o catálogo não está fechado) e a estrutura de categorias
em [data/categorias.ts](data/categorias.ts). O acesso a esses dados é
centralizado em [lib/produtos.ts](lib/produtos.ts) — a migração futura para
Firebase Firestore (coleções `produtos` e `categorias`) está documentada em
comentário no topo desse arquivo; ela troca apenas a implementação interna
das funções, não os componentes/páginas que as consomem.

## Pagamento (Mercado Pago Checkout Pro)

A rota [app/api/checkout/route.ts](app/api/checkout/route.ts) monta uma
"preference" do Mercado Pago a partir do carrinho e retorna o link de
checkout (`init_point`), para onde o cliente é redirecionado. Aceita Pix,
cartão e boleto conforme configurado na conta Mercado Pago. O webhook de
notificação (`notification_url`) ainda não está configurado — ver TODO no
arquivo.

## Formulários (Contato e Franquia)

As rotas `app/api/contato/route.ts` e `app/api/franquia/route.ts`, por
enquanto, apenas fazem `console.log` dos dados recebidos. Há um `TODO` em
cada uma indicando os dois próximos passos: conectar a um serviço de e-mail
(ex: Resend) e/ou salvar em uma coleção do Firestore.

## Regra de atacado

Nenhum produto tem preço de atacado exposto no site — é sempre "sob
consulta" via WhatsApp (bloco fixo abaixo do preço em cada produto, sem
nenhum bloqueio técnico de quantidade). O número de WhatsApp usado nesse
link vem de `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## Pendências antes de publicar em produção

Ver lista completa na resposta que acompanha este scaffold. Resumo dos
assets/textos que faltam:

- Logo real em SVG (emblema do veleiro) — hoje há um placeholder em
  [components/Logo.tsx](components/Logo.tsx) e [app/icon.svg](app/icon.svg).
- Fotos reais de todos os produtos (hoje todos usam
  [components/PlaceholderImage.tsx](components/PlaceholderImage.tsx)).
- Fotos e logo reais dos Horneados Únicos — **não usar imagem gerada por IA**,
  é produto/marca de terceiro e depende de autorização confirmada do
  fornecedor antes de publicar (ver comentário em
  `app/distribuicao/horneados-unicos/page.tsx`).
- Texto final da página de Franquia (condições comerciais, investimento).
- Parágrafo de franquia em Quem Somos (marcado com `TODO` no código).
- Confirmar número de WhatsApp, e-mail e redes sociais reais em
  `lib/site-config.ts`.
- Catálogo real de produtos (o `data/produtos.json` atual tem produtos de
  exemplo para o site não ficar vazio).

## Deploy

Pronto para deploy na [Vercel](https://vercel.com/new). Lembre-se de
configurar as variáveis de ambiente acima no painel do projeto antes do
primeiro deploy de produção.

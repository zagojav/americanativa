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
`.gitignore`) antes de publicar em produção. Veja `.env.example` para o
modelo completo.

| Variável | Descrição |
|---|---|
| `MERCADOPAGO_ACCESS_TOKEN` | Access token de produção do Mercado Pago (Checkout Pro). |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Public key do Mercado Pago. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp da loja (formato `55DDDNUMERO`, sem símbolos). |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site em produção (usada nas `back_urls` do checkout, no sitemap e no robots.txt). |
| `GMAIL_USER` | E-mail do Gmail que envia (e recebe) as notificações de Contato/Franquia. Hoje `americanativa7@gmail.com`. |
| `GMAIL_APP_PASSWORD` | Senha de app do Gmail (não é a senha normal da conta), ver seção "E-mail de notificação" abaixo. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase — Project Settings → General → seu app web. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Idem. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Idem. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Idem (o app não usa o Firebase Storage hoje, mas o SDK pede o campo mesmo assim). |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Idem. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Idem. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Painel do Cloudinary → Dashboard → "Cloud name". |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Painel do Cloudinary → Dashboard → "API Key". |
| `CLOUDINARY_API_SECRET` | Painel do Cloudinary → Dashboard → "API Secret". Secreto: sem `NEXT_PUBLIC_`, só usado no servidor (`app/api/cloudinary-signature`). |

## Firebase — configuração (Firestore + Authentication)

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. Ative **Authentication** → métodos "E-mail/senha" e, opcionalmente,
   "Google" (o login com Google aparece tanto em `/entrar` quanto em
   `/admin/login`; pra funcionar fora de `localhost`, o domínio de produção
   precisa estar em Authentication → Settings → Authorized domains).
3. Ative **Firestore Database** (modo produção).
4. Em Project Settings → General, crie um app Web e copie os 6 valores para
   `.env.local`.
5. Aplique as regras de [firestore.rules](firestore.rules) (Firestore →
   Regras) no console, ou via Firebase CLI (`firebase deploy --only firestore:rules`).
   O Firestore começa em "modo de teste" (libera tudo por 30 dias) — sem
   aplicar essas regras, o acesso volta a ficar aberto depois desse prazo.
6. Crie o usuário administrador em Authentication → Users → Add user, usando
   o e-mail `guilherme.rezendezago@gmail.com` (único autorizado a entrar em
   `/admin` — ver checagem em `app/admin/layout.tsx`). Não existe
   usuário/senha hardcoded em nenhum lugar do código — a conta é criada
   inteiramente pelo console do Firebase.
7. Faça login em `/admin/login` com essa conta.
8. Rode `node scripts/seed-produtos.mjs` uma vez para migrar o catálogo de
   `data/produtos.json` para a coleção `produtos` do Firestore (pede e-mail
   e senha do admin no terminal, não grava em nenhum arquivo). Depois, rode
   `node scripts/seed-horneados-unicos.mjs` uma vez pra cadastrar o catálogo
   completo de Horneados Únicos (31 itens, `data/produtos-horneados-unicos.json`,
   incluindo as subcategorias novas Recheados e Empanadas). Esse segundo
   script usa `addDoc` (ID automático, sempre cria documento novo) em vez de
   upsert por slug — **rode só uma vez**, senão duplica os produtos. Se os
   Horneados Únicos originais (`data/produtos.json`) já foram semeados antes,
   confira em `/admin/produtos` e apague os antigos pra não ficar com
   duplicata.

O painel em `/admin` tem 3 áreas: **Pedidos** (lista os envios de Contato e
Franquia, coleção `pedidos_orcamento`), **Produtos** (`/admin/produtos`, CRUD
completo da coleção `produtos`, incluindo upload de fotos pro Cloudinary) e
**Leads** (`/admin/leads`, lista quem clicou no botão de WhatsApp de algum
produto). Há também um link discreto "Painel administrativo" no rodapé do
site, que leva pra `/admin`.

## Cloudinary (upload de fotos de produto)

As fotos cadastradas pelo painel `/admin/produtos` vão pro Cloudinary (plano
gratuito, sem cartão), não pro Firebase Storage, evitando depender do plano
pago (Blaze) do Firebase só pra guardar imagem.

1. Crie uma conta grátis em [cloudinary.com](https://cloudinary.com).
2. No Dashboard, copie **Cloud name**, **API Key** e **API Secret** para
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY` e
   `CLOUDINARY_API_SECRET` (esse último sem `NEXT_PUBLIC_`, pois é secreto:
   fica só no servidor, nunca chega ao navegador).
3. Não precisa criar upload preset nem mexer em mais nada no painel do
   Cloudinary: o upload é assinado no servidor
   (`app/api/cloudinary-signature/route.ts`, usando o API Secret) e o botão
   "Adicionar foto" no formulário de produto já usa essas variáveis
   (`components/admin/ProdutoForm.tsx`, via `next-cloudinary`).

## Estrutura de dados dos produtos

O catálogo em produção vive na coleção `produtos` do Firestore, editável
pelo painel `/admin/produtos`. [data/produtos.json](data/produtos.json)
continua no repositório como a fonte de conteúdo versionada que alimenta o
`scripts/seed-produtos.mjs` (a carga inicial) — não é mais lido em runtime
pelo site. A estrutura de categorias continua em código, em
[data/categorias.ts](data/categorias.ts). O acesso a produtos é centralizado
em [lib/produtos.ts](lib/produtos.ts).

Descrições de 3 produtos (Cuñapé Bolita, Cuñapé Rosca, Crunchezz) usam o
texto exato fornecido pelo cliente. As demais descrições dos itens da linha
Horneados Únicos foram montadas com dados reais do fornecedor (ingredientes
e peso, extraídos dos catálogos em PDF "SP Catálogo ABIZCOCHADOS" e
"Catálogo Únicos"), em tom objetivo, sem texto de marketing. Os catálogos do
fornecedor divergem entre si em 3 pontos; usamos o valor do "SP Catálogo
ABIZCOCHADOS" nos três casos:

- **Crunchezz**: peso líquido 50g ("SP Catálogo") vs. 65g ("Catálogo Únicos").
- **Bizcochos de Maíz / Mini Bizcochos de Maíz**: ingrediente final "sal"
  ("SP Catálogo") vs. "leite" ("Catálogo Únicos").
- **Paraguayo Rosca**: peso líquido 140g ("SP Catálogo") vs. 120g ("Catálogo Únicos").

Vale confirmar com o fornecedor antes de publicar. Os vinhos, o óleo, a
jaqueta e o sapato têm uma descrição mínima e factual (só o que já se sabe
pelo nome/categoria) até o cliente enviar dados reais de fornecedor pra
esses itens.

## Pagamento (Mercado Pago Checkout Pro)

A rota [app/api/checkout/route.ts](app/api/checkout/route.ts) monta uma
"preference" do Mercado Pago a partir do carrinho e retorna o link de
checkout (`init_point`), para onde o cliente é redirecionado. Aceita Pix,
cartão e boleto conforme configurado na conta Mercado Pago. O webhook de
notificação (`notification_url`) ainda não está configurado — ver TODO no
arquivo.

## Formulários (Contato e Franquia)

As rotas `app/api/contato/route.ts` e `app/api/franquia/route.ts` gravam
cada envio na coleção `pedidos_orcamento` do Firestore (`tipo: "contato"` ou
`"franquia"`), visível em `/admin`, e também disparam um e-mail de aviso
(`lib/email.ts`) para `GMAIL_USER`. Se o e-mail falhar ou as variáveis não
estiverem configuradas, o pedido continua sendo salvo normalmente no
Firestore — o e-mail é só um aviso extra, não o registro principal.

### E-mail de notificação (Gmail SMTP)

1. Ative a verificação em duas etapas na conta `americanativa7@gmail.com`
   (Conta Google → Segurança).
2. Em Segurança → "Senhas de app", gere uma senha de app para o Gmail.
3. Coloque o e-mail em `GMAIL_USER` e a senha gerada (não a senha normal da
   conta) em `GMAIL_APP_PASSWORD` no `.env.local`.

## Regra de atacado

Nenhum produto tem preço de atacado exposto no site — é sempre "sob
consulta" via WhatsApp (bloco fixo abaixo do preço em cada produto, sem
nenhum bloqueio técnico de quantidade). O número de WhatsApp usado nesse
link vem de `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## Pendências antes de publicar em produção

- Logo oficial: aplicada a versão tricolor (dourado/prata/vinho) do brasão
  (`public/brand/logo-emblema.png`, também usada em `app/icon.png`). O
  `favicon.ico` ainda é o padrão do Next.js — gerar um `.ico` multi-resolução
  de verdade requer uma ferramenta de conversão de imagem que não estava
  disponível neste ambiente.
- **Banners 1 (Quem Somos) e 2 (institucional)** não têm um recorte mobile
  próprio — a versão desktop está sendo reaproveitada como fallback também no
  mobile. Os banners 3, 4 e 5 já têm recorte mobile dedicado.
- Fotos reais ainda faltando: os 2 vinhos, o óleo de soja, a jaqueta de couro
  e o sapato derby (todos usam `PlaceholderImage` por enquanto). A variante
  65g (Bolsa Metalizada) de Cuñapé Bolita e de Cuñapé Rosca reaproveita a foto
  da embalagem de 150g, já que não existe foto própria da embalagem de 65g.
- As 3 divergências de peso/ingrediente entre os catálogos do fornecedor
  (ver seção "Estrutura de dados dos produtos") merecem confirmação.
- Franquia: não existe nenhum documento com termos comerciais reais
  (investimento, royalties, condições). O documento "proposta" encontrado na
  pasta de assets era um orçamento de desenvolvimento web, não um contrato de
  franquia — a página `/franquia` e o parágrafo em Quem Somos continuam com
  texto genérico até haver uma fonte real.
- Confirmar número de WhatsApp, e-mail e redes sociais reais em
  `lib/site-config.ts` (ainda com valores placeholder marcados como `TODO`).
- Cor de marca: o manual oficial encontrado (`Manual_America_Nativa.pdf`)
  especifica azul profundo `#0B1F3B` como cor primária, não vinho. Decisão
  tomada: manter vinho `#5B0F1E` (já implementado em todo o site). Se o
  cliente confirmar que o manual é a referência correta, essa troca afeta
  `tailwind.config.ts` e `app/globals.css` em todo o projeto.
- Webhook do Mercado Pago (`notification_url`) ainda não configurado.
- CRUD de produtos, captura de leads e o script de seed só são testáveis de
  ponta a ponta depois de configurar um projeto Firebase real, aplicar
  `firestore.rules`, criar o usuário admin, configurar o Cloudinary e rodar
  `node scripts/seed-produtos.mjs` (ver seções Firebase e Cloudinary acima).

## Deploy

Pronto para deploy na [Vercel](https://vercel.com/new). Lembre-se de
configurar as variáveis de ambiente acima no painel do projeto antes do
primeiro deploy de produção, e de aplicar `firestore.rules` no projeto
Firebase de produção.

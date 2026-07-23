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
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase — Project Settings → General → seu app web. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Idem. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Idem. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Idem. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Idem. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Idem. |

## Firebase — configuração (Firestore + Authentication)

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. Ative **Authentication** → método "E-mail/senha".
3. Ative **Firestore Database** (modo produção).
4. Em Project Settings → General, crie um app Web e copie os 6 valores para
   `.env.local`.
5. Aplique as regras de [firestore.rules](firestore.rules) no console
   (Firestore → Regras) ou via Firebase CLI (`firebase deploy --only firestore:rules`).
6. Crie o usuário administrador em Authentication → Users → Add user
   (e-mail/senha). Não existe usuário/senha hardcoded em nenhum lugar do
   código — a conta é criada inteiramente pelo console do Firebase.
7. Faça login em `/admin/login` com essa conta.

O painel em `/admin` hoje só **lista os pedidos recebidos** pelos formulários
de Contato e Franquia (coleção `pedidos_orcamento`, campo `tipo` distingue os
dois). Não há CRUD de produtos/categorias pelo painel nesta etapa — o
catálogo continua sendo atualizado via código (`data/produtos.json` e
`data/categorias.ts`), o que já é compatível com o fluxo descrito de exportar
o CSV da Nuvemshop e repassar para o desenvolvedor preencher.

## Estrutura de dados dos produtos

O catálogo vive em [data/produtos.json](data/produtos.json) (fácil de editar
manualmente) e a estrutura de categorias em
[data/categorias.ts](data/categorias.ts). O acesso a esses dados é
centralizado em [lib/produtos.ts](lib/produtos.ts).

Descrições de 3 produtos (Cuñapé Bolita, Cuñapé Rosca, Crunchezz) usam o
texto exato fornecido pelo cliente. As demais descrições dos itens da linha
Horneados Únicos foram montadas com dados reais do fornecedor (ingredientes
e peso, extraídos dos catálogos em PDF "SP Catálogo ABIZCOCHADOS" e
"Catálogo Únicos"), em tom objetivo — não são texto de marketing definitivo.
Os catálogos do fornecedor divergem entre si em 3 pontos; usamos o valor do
"SP Catálogo ABIZCOCHADOS" nos três casos:

- **Crunchezz**: peso líquido 50g ("SP Catálogo") vs. 65g ("Catálogo Únicos").
- **Bizcochos de Maíz / Mini Bizcochos de Maíz**: ingrediente final "sal"
  ("SP Catálogo") vs. "leite" ("Catálogo Únicos").
- **Paraguayo Rosca**: peso líquido 140g ("SP Catálogo") vs. 120g ("Catálogo Únicos").

Vale confirmar com o fornecedor antes de publicar. Vinhos, óleo, jaqueta e
sapato ainda estão com `descricao` marcada como
`/* TODO: descrição pendente, aguardando exportação do CSV */`, conforme
combinado — não inventamos texto pra esses.

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
`"franquia"`), visível em `/admin`. Envio por e-mail (ex: Resend) ainda não
está conectado — hoje o único jeito de ver os pedidos é pelo painel.

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
- Painel admin faz só leitura dos pedidos — sem CRUD de produtos/categorias
  (ver seção Firebase acima).

## Deploy

Pronto para deploy na [Vercel](https://vercel.com/new). Lembre-se de
configurar as variáveis de ambiente acima no painel do projeto antes do
primeiro deploy de produção, e de aplicar `firestore.rules` no projeto
Firebase de produção.

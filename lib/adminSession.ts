// Cookie lido pelo proxy.ts pra decidir, no servidor, se deixa entrar em
// /admin/* antes de qualquer JS do cliente rodar. Guarda o ID token atual do
// Firebase Auth (não é secreto — o proxy sempre revalida ele contra a API do
// Firebase a cada requisição, então um valor forjado ou expirado é rejeitado
// e redireciona pro login).
const NOME_COOKIE = "admin_session";

export function escreverCookieSessao(idToken: string) {
  document.cookie = `${NOME_COOKIE}=${idToken}; path=/; max-age=3600; SameSite=Lax`;
}

export function limparCookieSessao() {
  document.cookie = `${NOME_COOKIE}=; path=/; max-age=0`;
}

/** Traduz códigos de erro do Firebase Auth (ex.: "auth/weak-password") para
 * mensagens em português. Retorna null quando o erro não deve ser exibido ao
 * usuário (ex.: ele só fechou o popup de login do Google por conta própria). */
export function mensagemErroAuth(codigo: string): string | null {
  switch (codigo) {
    case "auth/email-already-in-use":
      return "Esse e-mail já tem uma conta cadastrada, tenta entrar em vez de criar.";
    case "auth/weak-password":
      return "Senha muito curta, use no mínimo 6 caracteres.";
    case "auth/invalid-email":
      return "E-mail inválido, confere se digitou certo.";
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "E-mail ou senha inválidos.";
    case "auth/popup-closed-by-user":
      return null;
    case "auth/unauthorized-domain":
      return "Esse domínio ainda não está autorizado, avisa o administrador.";
    default:
      console.error("[auth] Código de erro não tratado:", codigo);
      return "Erro ao processar, tenta de novo.";
  }
}

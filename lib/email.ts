import nodemailer from "nodemailer";

/**
 * Notificação por e-mail dos formulários de Contato/Franquia, via SMTP do
 * próprio Gmail da loja (GMAIL_USER + uma "senha de app" gerada no Google
 * Account, nunca a senha normal da conta). Falha aqui não deve derrubar o
 * envio do formulário — o Firestore já guardou o pedido, o e-mail é só um
 * aviso a mais; por isso os call sites tratam erro daqui como não-fatal.
 */
export async function enviarNotificacaoPorEmail(assunto: string, linhas: Record<string, string>) {
  const usuario = process.env.GMAIL_USER;
  const senha = process.env.GMAIL_APP_PASSWORD;
  if (!usuario || !senha) {
    throw new Error("GMAIL_USER/GMAIL_APP_PASSWORD não configurados em .env.local");
  }

  const transportador = nodemailer.createTransport({
    service: "gmail",
    auth: { user: usuario, pass: senha },
  });

  const corpoHtml = Object.entries(linhas)
    .map(([chave, valor]) => `<p><strong>${chave}:</strong> ${valor}</p>`)
    .join("");

  await transportador.sendMail({
    from: `América Nativa <${usuario}>`,
    to: usuario,
    subject: assunto,
    html: corpoHtml,
  });
}

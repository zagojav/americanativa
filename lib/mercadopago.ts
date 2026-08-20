import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken && process.env.NODE_ENV === "production") {
  // Não lançamos erro em build/dev para não travar o scaffold antes da
  // credencial real ser configurada — mas alertamos alto em produção.
  console.warn(
    "[mercadopago] MERCADOPAGO_ACCESS_TOKEN não configurado. Defina em .env.local antes de publicar."
  );
}

const client = new MercadoPagoConfig({
  accessToken: accessToken || "TEST-ACCESS-TOKEN-NAO-CONFIGURADO",
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

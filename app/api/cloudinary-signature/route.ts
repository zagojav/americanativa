import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

/**
 * Assina os parâmetros do upload widget do Cloudinary no servidor, usando
 * CLOUDINARY_API_SECRET (nunca exposto ao navegador). Contrato exigido pelo
 * next-cloudinary: recebe { paramsToSign }, responde { signature }.
 * Algoritmo de assinatura documentado pelo próprio Cloudinary: params
 * ordenados alfabeticamente, unidos em "chave=valor&...", com o api_secret
 * concatenado no fim, tudo em SHA-1.
 */
export async function POST(request: NextRequest) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return NextResponse.json(
      { error: "CLOUDINARY_API_SECRET não configurado em .env.local" },
      { status: 500 }
    );
  }

  const { paramsToSign } = (await request.json()) as { paramsToSign: Record<string, unknown> };

  const stringParaAssinar = Object.keys(paramsToSign)
    .sort()
    .map((chave) => `${chave}=${paramsToSign[chave]}`)
    .join("&");

  const signature = createHash("sha1")
    .update(stringParaAssinar + apiSecret)
    .digest("hex");

  return NextResponse.json({ signature });
}

// @ts-nocheck
import hmacSHA1 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";
import type { APIRoute } from "astro";
import { candidatos } from "../lib/candidatos";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const secret = url.searchParams.get("secret");

  if (!code || !secret) {
    return new Response("Parametro(s) invalido(s)", {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  const [hash, salt] = code.split("::");
  for (const candidate of candidatos) {
    if (
      Base64.stringify(hmacSHA1(String(salt) + candidate.name, secret)) === hash
    ) {
      return new Response(candidate.name, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  }
  return new Response("Não encontrado", {
    status: 404,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

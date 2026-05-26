import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getResendClient } from "@/services/resend";
import { contactSchema } from "@/utils/validators";

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (!checkRateLimit("contact", ip, LIMIT, WINDOW_MS)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldErrors = flat.fieldErrors;
      const firstField = Object.entries(fieldErrors).find(
        ([, msgs]) => msgs && msgs.length > 0
      );
      const hint =
        firstField?.[0] === "message"
          ? "Mensagem muito longa (máx. 5000 caracteres) ou muito curta."
          : firstField?.[1]?.[0];

      return NextResponse.json(
        {
          error: hint ?? "Dados inválidos. Revise os campos e tente novamente.",
          details: flat,
        },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const resend = getResendClient();
    const to = process.env.CONTACT_TO_EMAIL;
    const from =
      process.env.CONTACT_FROM_EMAIL ?? "kairos.tecsuporte@gmail.com";

    if (!resend || !to) {
      return NextResponse.json(
        {
          error:
            "Serviço de e-mail não configurado. Defina RESEND_API_KEY e CONTACT_TO_EMAIL.",
        },
        { status: 503 }
      );
    }

    const { name, email, company, message } = parsed.data;

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Kairos tecnologias] Contato de ${name}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ""}
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno ao enviar mensagem" },
      { status: 500 }
    );
  }
}

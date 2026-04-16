import { createClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { assertSupabaseConfigured } from "@/lib/supabase/env";

function createAuthClient() {
  const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfigured();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function sendPasswordResetEmail(email: string, redirectTo: string) {
  const client = createAuthClient();

  return client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

type TransactionalEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getTransactionalEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.APP_EMAIL_FROM?.trim() ?? "";

  return {
    isConfigured: Boolean(apiKey && from),
    apiKey,
    from,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendTransactionalEmail(payload: TransactionalEmailPayload) {
  const config = getTransactionalEmailConfig();

  if (!config.isConfigured) {
    return {
      sent: false,
      skipped: true,
      error: null as Error | null,
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    return {
      sent: false,
      skipped: false,
      error: new Error("No fue posible enviar el correo transaccional."),
    };
  }

  return {
    sent: true,
    skipped: false,
    error: null as Error | null,
  };
}

function emailShell(content: string) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f7f3ed; padding:32px;">
      <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #e6d8c8; border-radius:24px; padding:28px;">
        <p style="margin:0 0 10px; letter-spacing:0.18em; text-transform:uppercase; color:#bf9d6c; font-size:12px; font-weight:700;">AdmiAmigo 360</p>
        ${content}
      </div>
    </div>
  `;
}

export async function sendAccountActivationEmail(
  email: string,
  fullName: string,
  redirectTo: string,
) {
  const config = getTransactionalEmailConfig();

  if (!config.isConfigured) {
    const fallback = await sendPasswordResetEmail(email, redirectTo);
    return {
      sent: !fallback.error,
      customEmailSent: false,
      fallbackUsed: true,
      error: fallback.error,
    };
  }

  const adminClient = getSupabaseAdminClient();
  const linkResult = await adminClient.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo,
    },
  });

  const actionLink = linkResult.data.properties?.action_link;

  if (linkResult.error || !actionLink) {
    return {
      sent: false,
      customEmailSent: false,
      fallbackUsed: false,
      error: linkResult.error ?? new Error("No fue posible generar el enlace de activación."),
    };
  }

  const safeName = escapeHtml(fullName || "residente");
  const safeLink = escapeHtml(actionLink);
  const html = emailShell(`
    <h1 style="margin:0; color:#2b211c; font-size:26px;">Tu usuario fue aceptado</h1>
    <p style="color:#6f625b; font-size:16px; line-height:1.6;">
      Hola ${safeName}, la administración del conjunto aprobó tu solicitud de acceso.
    </p>
    <p style="color:#6f625b; font-size:16px; line-height:1.6;">
      Ingresa al siguiente enlace para crear la contraseña de tu cuenta:
    </p>
    <a href="${safeLink}" style="display:block; text-align:center; background:#5d4037; color:#ffffff; text-decoration:none; border-radius:16px; padding:16px 20px; font-weight:700;">
      Crear contraseña
    </a>
    <p style="color:#8a7a70; font-size:13px; line-height:1.5; margin-top:18px;">
      Si no solicitaste este acceso, ignora este correo o contacta a la administración.
    </p>
  `);

  const emailResult = await sendTransactionalEmail({
    to: email,
    subject: "Tu usuario fue aceptado por la administración",
    html,
    text: `Hola ${fullName || "residente"}, tu usuario fue aceptado por la administración del conjunto. Crea tu contraseña aquí: ${actionLink}`,
  });

  return {
    sent: emailResult.sent,
    customEmailSent: emailResult.sent,
    fallbackUsed: false,
    error: emailResult.error,
  };
}

export async function sendAccessRequestRejectedEmail(email: string, fullName: string) {
  const safeName = escapeHtml(fullName || "residente");
  const html = emailShell(`
    <h1 style="margin:0; color:#2b211c; font-size:26px;">Solicitud no aprobada</h1>
    <p style="color:#6f625b; font-size:16px; line-height:1.6;">
      Hola ${safeName}, tu solicitud de creación de usuario como residente fue rechazada.
    </p>
    <p style="color:#6f625b; font-size:16px; line-height:1.6;">
      Contacta a la administración del conjunto para validar tus datos o solicitar una revisión.
    </p>
  `);

  return sendTransactionalEmail({
    to: email,
    subject: "Tu solicitud de acceso no fue aprobada",
    html,
    text: `Hola ${fullName || "residente"}, tu solicitud de creación de usuario como residente fue rechazada. Contacta a la administración del conjunto.`,
  });
}

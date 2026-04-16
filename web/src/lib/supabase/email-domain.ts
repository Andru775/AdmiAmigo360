import { promises as dns } from "node:dns";

import { validateEmailFormat } from "@/lib/contact-validation";

export async function validateEmailCanReceiveMail(value: string) {
  const emailValidation = validateEmailFormat(value);

  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const domain = emailValidation.email.split("@")[1];

  try {
    const records = await dns.resolveMx(domain);
    const canReceiveMail = records.some((record) => record.exchange && record.exchange !== ".");

    if (canReceiveMail) {
      return emailValidation;
    }
  } catch {
    return {
      isValid: false,
      email: emailValidation.email,
      error: "No pudimos verificar que ese dominio reciba correos. Usa un correo real y revisa que esté bien escrito.",
    };
  }

  return {
    isValid: false,
    email: emailValidation.email,
    error: "Ese dominio de correo no parece recibir emails. Usa un correo real como Gmail, Outlook o el institucional.",
  };
}

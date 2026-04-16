export const towerOptions = ["Torre A", "Torre B", "Torre C", "Torre D"] as const;

export const countryOptions = [
  {
    code: "+57",
    label: "Colombia",
    digits: 10,
    placeholder: "3000000000",
  },
  {
    code: "+1",
    label: "Estados Unidos",
    digits: 10,
    placeholder: "3055551234",
  },
  {
    code: "+52",
    label: "México",
    digits: 10,
    placeholder: "5512345678",
  },
  {
    code: "+51",
    label: "Perú",
    digits: 9,
    placeholder: "987654321",
  },
  {
    code: "+56",
    label: "Chile",
    digits: 9,
    placeholder: "912345678",
  },
  {
    code: "+34",
    label: "España",
    digits: 9,
    placeholder: "612345678",
  },
] as const;

export type CountryCode = (typeof countryOptions)[number]["code"];

const EMAIL_PATTERN = /^(?!.*\.\.)[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;

export function getCountryOption(code: string) {
  return countryOptions.find((option) => option.code === code) ?? countryOptions[0];
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validateEmailFormat(value: string) {
  const email = normalizeEmail(value);
  const [localPart, domainPart] = email.split("@");

  if (!email || !localPart || !domainPart || !EMAIL_PATTERN.test(email)) {
    return {
      isValid: false,
      email,
      error: "Ingresa un correo electrónico válido.",
    };
  }

  if (localPart.length > 64 || domainPart.length > 253) {
    return {
      isValid: false,
      email,
      error: "El correo electrónico es demasiado largo.",
    };
  }

  const hasInvalidDomainLabel = domainPart
    .split(".")
    .some((label) => !label || label.startsWith("-") || label.endsWith("-"));

  if (hasInvalidDomainLabel) {
    return {
      isValid: false,
      email,
      error: "El dominio del correo no tiene un formato válido.",
    };
  }

  return {
    isValid: true,
    email,
    error: "",
  };
}

export function buildInternationalPhone(countryCode: string, nationalDigits: string) {
  const country = getCountryOption(countryCode);
  return `${country.code}${onlyDigits(nationalDigits)}`;
}

export function validateNationalPhone(countryCode: string, nationalDigits: string) {
  const country = getCountryOption(countryCode);
  const digits = onlyDigits(nationalDigits);

  if (!digits) {
    return {
      isValid: false,
      digits,
      error: "Ingresa un número de teléfono.",
    };
  }

  if (digits.length !== country.digits) {
    return {
      isValid: false,
      digits,
      error: `El teléfono de ${country.label} debe tener ${country.digits} dígitos.`,
    };
  }

  return {
    isValid: true,
    digits,
    error: "",
  };
}

export function validateInternationalPhone(value: string) {
  const phone = value.trim();

  if (!/^\+\d+$/.test(phone)) {
    return {
      isValid: false,
      phone,
      error: "Ingresa un teléfono válido con indicativo de país.",
    };
  }

  const country = [...countryOptions]
    .sort((left, right) => right.code.length - left.code.length)
    .find((option) => phone.startsWith(option.code));

  if (!country) {
    return {
      isValid: false,
      phone,
      error: "Selecciona un indicativo de país válido.",
    };
  }

  const nationalDigits = phone.slice(country.code.length);

  if (nationalDigits.length !== country.digits) {
    return {
      isValid: false,
      phone,
      error: `El teléfono de ${country.label} debe tener ${country.digits} dígitos.`,
    };
  }

  return {
    isValid: true,
    phone,
    error: "",
  };
}

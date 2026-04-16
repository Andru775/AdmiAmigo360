export type PasswordRequirement = {
  id: string;
  label: string;
  isMet: boolean;
};

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: "length",
      label: "Mínimo 8 caracteres",
      isMet: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "Una letra mayúscula",
      isMet: /[A-ZÁÉÍÓÚÑ]/.test(password),
    },
    {
      id: "lowercase",
      label: "Una letra minúscula",
      isMet: /[a-záéíóúñ]/.test(password),
    },
    {
      id: "number",
      label: "Un número",
      isMet: /\d/.test(password),
    },
    {
      id: "symbol",
      label: "Un símbolo, por ejemplo ! @ # $",
      isMet: /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/.test(password),
    },
  ];
}

export function validatePassword(password: string) {
  const requirements = getPasswordRequirements(password);
  return {
    requirements,
    isValid: requirements.every((requirement) => requirement.isMet),
  };
}

export function getPasswordStrengthLabel(password: string) {
  const metCount = getPasswordRequirements(password).filter((requirement) => requirement.isMet).length;

  if (!password) {
    return "Ingresa una contraseña segura.";
  }

  if (metCount <= 2) {
    return "Contraseña insegura.";
  }

  if (metCount <= 4) {
    return "Contraseña en progreso.";
  }

  return "Contraseña segura.";
}

export function onlyDigits(value = "") {
  return value.replace(/\D/g, "");
}

export function hasAtLeastTwoNames(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2;
}

export function isValidAge(ageText = "") {
  const digits = onlyDigits(ageText);
  if (!digits) return false;
  const n = Number(digits);
  return Number.isInteger(n) && n > 0 && n < 100; // Um limite saudável
}

// Validação real de CPF (dígitos verificadores):
export function isValidCPF(cpfText = "") {
  const cpf = cpfText.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // evita 00000000000, 11111111111, etc.

  const calcDigit = (base, factor) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) {
      total += Number(base[i]) * (factor - i);
    }
    const mod = total % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calcDigit(cpf.slice(0, 9), 10);
  const d2 = calcDigit(cpf.slice(0, 10), 11);

  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

export function isValidCEP(cepText = "") {
  const cep = cepText.replace(/\D/g, "");
  if (cep.length !== 8) return false;
  if (/^(\d)\1{7}$/.test(cep)) return false; // evita 00000000, 11111111...
  return true;
}

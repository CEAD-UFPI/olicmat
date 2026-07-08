export interface CepData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento: string;
  erro?: boolean;
}

export async function buscarCep(cep: string): Promise<CepData | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!response.ok) return null;

    const data: CepData = await response.json();
    if (data.erro) return null;

    return data;
  } catch {
    return null;
  }
}

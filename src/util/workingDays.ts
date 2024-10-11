export function workingDays(startDate: string, endDate: string) {
  const diaAtual = new Date(startDate);
  const fim = new Date(endDate);
  let diasUteis = 0;

  while (diaAtual <= fim) {
    const diaSemana = diaAtual.getDay();

    // Ignora sábados (6) e domingos (0)
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis++;
    }

    // Avança para o próximo dia
    diaAtual.setDate(diaAtual.getDate() + 1);
  }
  return diasUteis;
}

export function distributeTasks(dias: number, tarefas: number) {
  const resultado = [];
  const decremento = tarefas / (dias - 1); // Para garantir uma distribuição linear

  for (let i = 0; i < dias; i++) {
    const valor = Math.round(tarefas - decremento * i);
    resultado.push(valor > 0 ? valor : 0); // Garantindo que não tenha valores negativos
  }

  return resultado;
}

export function distributeTasks(dias: number, tarefas: number) {
  const resultado = [];
  const decremento = tarefas / (dias - 1);
  for (let i = 0; i < dias; i++) {
    const valor = Math.round(tarefas - decremento * i);
    resultado.push(valor > 0 ? valor : 0);
  }
  return resultado;
}

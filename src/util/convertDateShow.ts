export function convertDateShow(data: string) {
  const [mes, dia, ano] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

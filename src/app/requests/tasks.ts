export async function getTaskInfo(issueId: string) {
  const response = await fetch(
    `http://localhost:3001/api/proxy/${issueId}`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar task " + issueId);
  }
  return response.json();
}

export async function getTaskInfo(issueId: string) {
  const urlRequest = process.env.NEXT_PUBLIC_REQ_TASK_INFO;
  const response = await fetch(
    `${urlRequest}${issueId}`
    // `http://fabtec.ifc-riodosul.edu.br/issues.json?issue_id=${issueId}&key=b7c238adc2c0af943c1f0fa9de6489ce190bd6d5&status_id=*`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar task " + issueId);
  }
  return response.json();
}

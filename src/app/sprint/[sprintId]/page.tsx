'use client'
import { Sprint } from "@/@types/sprint";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { sprintId: string } }) {
  const router = useRouter();

  const [sprint, setSprint] = useState<Sprint>({
    id: "",
    endDate: "",
    startDate: "",
    name: "",
    tasks: [],
  });

  const loadSprint = async () => {
    const sprintsJson = localStorage.getItem("sprintData");
    if (!sprintsJson) {
      router.push("/");
      return;
    }
    const sprints = JSON.parse(sprintsJson) as Sprint[];
    const sprint = sprints.find((sprint) => sprint.id === params.sprintId);
    if (!sprint) {
      router.push("/");
      return;
    }
    setSprint(sprint);
  };

  useEffect(() => {
    loadSprint();
  }, []);

  const handleTaskClick = (taskId: string) => {
    const urlRequest = process.env.NEXT_PUBLIC_REQ_OPEN_TASK;
    window.open(`${urlRequest}${taskId}`, "_blank");
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center mb-6">{sprint.name}</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tarefas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {sprint.tasks.map((task) => (
            <div
              key={task.id}
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition text-sm"
              onClick={() => handleTaskClick(task.id)}
            >
              <span className="font-medium">Tarefa #{task.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

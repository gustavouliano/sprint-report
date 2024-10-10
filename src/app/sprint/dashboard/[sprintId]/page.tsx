"use client";
import { Sprint } from "@/@types/sprint";
import { getTaskInfo } from "@/app/requests/tasks";
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

  const loadTasks = async (sprint: Sprint) => {
    try {
      const updatedTasks = [...sprint.tasks];

      for (let i = 0; i < updatedTasks.length; i++) {
        const info = await getTaskInfo(updatedTasks[i].id);
        updatedTasks[i] = { ...updatedTasks[i], info };
      }

      setSprint((prevSprint) => ({ ...prevSprint, tasks: updatedTasks }));
    } catch (error) {
      console.error("Erro ao buscar informações da task: ", error);
    }
  };

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
    loadTasks(sprint);
  };

  useEffect(() => {
    loadSprint();
  }, []);

  return (
    <div>
      <h1>DASHBOARD - {sprint.name}</h1>
      {sprint.tasks.map((task) => (
        <div key={task.id}>
          <span>Task ID: {task.id}</span>
          {/* <span> | Task Info: {task.info ? task.info : "Loading..."}</span> */}
        </div>
      ))}
    </div>
  );
}

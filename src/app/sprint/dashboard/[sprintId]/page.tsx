"use client";
import { Sprint } from "@/@types/sprint";
import { getTaskInfo } from "@/app/requests/tasks";
import LineChart from "@/components/LineChart";
import { workingDays } from "@/util/workingDays";
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
  const [tasksSeries, setTasksSeries] = useState<number[]>([]);

  const loadGraphData = (tasksLength: number) => {
    const workedDays = workingDays(sprint.startDate, sprint.endDate);
    let tasksQuantity = tasksLength;
    const updatedTasksSeries: number[] = Array(workedDays).fill(tasksQuantity);
    let i = 0;
    let count = 1;
    while (tasksQuantity > 0) {
      updatedTasksSeries[i] = updatedTasksSeries[i] - count;
      if (i == updatedTasksSeries.length - 1) {
        i = 0;
      } else {
        i++;
      }
      tasksQuantity--;
      count++;
    }
    console.log("updated tasks series: ", updatedTasksSeries);
    setTasksSeries(updatedTasksSeries);
  };

  const loadTasks = async () => {
    try {
      const updatedTasks = [...sprint.tasks];

      for (let i = 0; i < updatedTasks.length; i++) {
        const info = await getTaskInfo(updatedTasks[i].id);
        updatedTasks[i] = { ...updatedTasks[i], info };
      }
      setSprint((prevSprint) => ({ ...prevSprint, tasks: updatedTasks }));
      // Chama o gráfico logo após as tarefas serem atualizadas
      loadGraphData(updatedTasks.length);
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
  };

  useEffect(() => {
    loadSprint();
  }, []);

  useEffect(() => {
    if (sprint.id) {
      loadTasks();
    }
  }, [sprint]);

  return (
    <div>
      <h1>DASHBOARD - {sprint.name}</h1>
      <h2>
        Quantidade dias úteis:{" "}
        {sprint && workingDays(sprint.startDate, sprint.endDate)}
      </h2>
      {sprint.tasks.map((task) => (
        <div key={task.id}>
          <span>Task ID: {task.id}</span>
          {/* <span> | Task Info: {task.info ? task.info : "Loading..."}</span> */}
        </div>
      ))}
      <LineChart
        workedDays={workingDays(sprint.startDate, sprint.endDate)}
        plannedSeries={tasksSeries}
      />
    </div>
  );
}

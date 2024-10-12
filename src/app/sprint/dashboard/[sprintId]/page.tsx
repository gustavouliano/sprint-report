"use client";
import { Sprint } from "@/@types/sprint";
import LineChart from "@/components/LineChart";
import { distributeTasks } from "@/util/distributeTasks";
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
  const [tasksRealizedSeries, setTasksRealizedSeries] = useState<number[]>([]);

  const loadGraphData = () => {
    const workedDays = workingDays(sprint.startDate, sprint.endDate);
    const tasksQuantity = sprint.tasks.length;
    const updatedTasksSeries = distributeTasks(workedDays, tasksQuantity);

    const updatedRealizedTasksSeries = updatedTasksSeries.slice();
    const daysRealized = [];
    sprint.tasks.forEach((task) => {
      if (!task.info) {
        return;
      }
      const taskInfo = task.info.issues[0];
      const taskClosedData = taskInfo.closed_on;
      const closedDay = workingDays(sprint.startDate, taskClosedData);
      if (closedDay > workedDays) {
        console.log("Fechou depois", taskClosedData);
        return;
      }
      daysRealized.push(closedDay);
    });
    daysRealized.sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
      return 0;
    });
    console.log(updatedRealizedTasksSeries);
    console.log("days realized: ", daysRealized);
    for (let i = 0; i < updatedRealizedTasksSeries.length; i++) {
      const quantity = daysRealized.filter((x) => x == i + 1).length;
      if (i > 0) {
        updatedRealizedTasksSeries[i] = updatedRealizedTasksSeries[i - 1] - quantity;
      } else {
        updatedRealizedTasksSeries[i] = updatedRealizedTasksSeries[i] - quantity;
      }
    }
    setTasksSeries(updatedTasksSeries);
    setTasksRealizedSeries(updatedRealizedTasksSeries);
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
    loadGraphData();
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
        realizedSeries={tasksRealizedSeries}
      />
    </div>
  );
}

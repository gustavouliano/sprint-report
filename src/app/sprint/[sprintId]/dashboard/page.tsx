"use client";
import { Sprint } from "@/@types/sprint";
import LineChart from "@/components/LineChart";
import PieChart from "@/components/PieChart";
import { convertDateShow } from "@/util/convertDateShow";
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
  const [tasksNotEnd, setTasksNotEnd] = useState<string[]>([]);
  const [tasksSeries, setTasksSeries] = useState<number[]>([]);
  const [tasksRealizedSeries, setTasksRealizedSeries] = useState<number[]>([]);
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState<Map<string, number>>(
    new Map()
  );

  const loadTaskInfos = () => {
    const workedDays = workingDays(sprint.startDate, sprint.endDate);
    const tasksQuantity = sprint.tasks.length;
    const updatedTasksSeries = distributeTasks(workedDays, tasksQuantity);

    const updatedRealizedTasksSeries = updatedTasksSeries.slice();
    const daysRealized = [];
    const mapAssigned = new Map<string, number>();
    sprint.tasks.forEach((task) => {
      if (!task.info) {
        return;
      }
      const taskInfo = task.info.issues[0];
      if (!taskInfo) {
        return;
      }
      if (taskInfo.total_estimated_hours) {
        setEstimatedHours(
          (val) => val + Number(taskInfo.total_estimated_hours)
        );
      }
      if (taskInfo.assigned_to && taskInfo.assigned_to["name"]) {
        const name = taskInfo.assigned_to["name"];
        if (mapAssigned.has(name)) {
          mapAssigned.set(name, mapAssigned.get(name) + 1);
        } else {
          mapAssigned.set(name, 1);
        }
      }
      const taskClosedData = taskInfo.closed_on;
      // console.log(taskClosedData);
      const closedDay = workingDays(sprint.startDate, taskClosedData);
      if (closedDay > workedDays) {
        return;
      }
      if (closedDay == 0) {
        // Foi finalizada antes do primeiro dia, puxa pro primeiro dia
        daysRealized.push(1);
      } else {
        daysRealized.push(closedDay);
      }
    });
    daysRealized.sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
      return 0;
    });

    for (let i = 0; i < updatedRealizedTasksSeries.length; i++) {
      const quantity = daysRealized.filter((x) => x == i + 1).length;
      if (i > 0) {
        updatedRealizedTasksSeries[i] =
          updatedRealizedTasksSeries[i - 1] - quantity;
      } else {
        updatedRealizedTasksSeries[i] =
          updatedRealizedTasksSeries[i] - quantity;
      }
    }
    setTasksSeries(updatedTasksSeries);
    setTasksRealizedSeries(updatedRealizedTasksSeries);
    setAssignedTasks(mapAssigned);
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

  const handleTaskNotEnd = () => {
    const workedDays = workingDays(sprint.startDate, sprint.endDate);
    const updateTasksNotEnd = [];
    sprint.tasks.forEach((task) => {
      if (!task.info) {
        return;
      }
      const taskInfo = task.info.issues[0];
      const taskClosedData = taskInfo.closed_on;
      const closedDay = workingDays(sprint.startDate, taskClosedData);
      if (closedDay > workedDays) {
        updateTasksNotEnd.push(task.id);
      }
    });
    setTasksNotEnd(updateTasksNotEnd);
  };

  useEffect(() => {
    loadSprint();
  }, []);

  useEffect(() => {
    loadTaskInfos();
    handleTaskNotEnd();
  }, [sprint]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Dashboard - {sprint.name}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-lg">
          <span className="font-semibold">Período:</span>{" "}
          {convertDateShow(sprint.startDate)} -{" "}
          {convertDateShow(sprint.endDate)}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Quantidade de dias úteis:</span>{" "}
          {sprint && workingDays(sprint.startDate, sprint.endDate)}
        </p>
        <div>
          <p className="text-lg">
            <span className="font-semibold">
              Quantidade de tarefas (não finalizadas):{" "}
            </span>
            {sprint.tasks.length} ({tasksNotEnd.length})
          </p>
          {tasksNotEnd.length > 0 && (
            <p className="text-sm text-gray-600">
              Tarefas não finalizadas:{" "}
              {tasksNotEnd.map((id, index) => (
                <span key={index}>
                  {id}
                  {index < tasksNotEnd.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}
        </div>
        <p className="text-lg">
          <span className="font-semibold">Horas estimadas: </span>
          {estimatedHours.toFixed(2)}
        </p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 flex space-x-2">
        {
          tasksSeries.length && tasksRealizedSeries.length && 
          <LineChart
            workedDays={workingDays(sprint.startDate, sprint.endDate)}
            plannedSeries={tasksSeries}
            realizedSeries={tasksRealizedSeries}
          />
        }
        {assignedTasks.size > 0 && (
          <PieChart
            labels={assignedTasks.keys().toArray()}
            seriesData={assignedTasks.values().toArray()}
          />
        )}
      </div>
    </div>
  );
}

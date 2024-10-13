"use client";

import { Sprint } from "@/@types/sprint";
import { Task } from "@/@types/task";
import { getTaskInfo } from "@/app/requests/tasks";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [taskIds, setTaskIds] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const taskIdsArray = taskIds.split(",").map((id) => id.trim());
    const tasks: Task[] = [];
    for (const id of taskIdsArray) {
      const info = await getTaskInfo(id);
      tasks.push({ id, info });
    }
    let [year, month, day] = startDate.split("-");
    const newStartDate = `${month}-${day}-${year}`;
    [year, month, day] = endDate.split("-");
    const newEndDate = `${month}-${day}-${year}`;
    const newSprint: Sprint = {
      id: Date.now() + "" + Math.random(),
      name,
      startDate: newStartDate,
      endDate: newEndDate,
      tasks,
    };
    const savedSprintsJson = localStorage.getItem("sprintData");
    let sprints: Sprint[] = [];
    if (savedSprintsJson) {
      sprints = JSON.parse(savedSprintsJson) as Sprint[];
    }
    sprints.push(newSprint);
    localStorage.setItem("sprintData", JSON.stringify(sprints));
    router.push("/");
  };

  return (
    <div className="flex flex-col mx-auto items-center mt-4">
      <h1>Criação de Nova Sprint</h1>
      <form className="w-1/2 mt-16" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="inputName">Nome da Sprint</label>
          <input
            type="text"
            id="inputName"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputStartDate">Data de início</label>
          <input
            type="date"
            id="inputStartDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputEndDate">Data de fim</label>
          <input
            type="date"
            id="inputEndDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="inputTasks">
            IDs das Tarefas (separados por vírgula)
          </label>
          <input
            type="text"
            id="inputTasks"
            className="form-control"
            placeholder="Ex: 213,214,215"
            value={taskIds}
            onChange={(e) => setTaskIds(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary mt-2">
            Adicionar Sprint
          </button>
        </div>
      </form>
    </div>
  );
}

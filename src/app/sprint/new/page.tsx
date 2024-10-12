"use client";

import { Sprint } from "@/@types/sprint";
import { Task } from "@/@types/task";
import { getTaskInfo } from "@/app/requests/tasks";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState(""); // Nome da sprint
  const [startDate, setStartDate] = useState(""); // Data de início
  const [endDate, setEndDate] = useState(""); // Data de fim
  const [tasks, setTasks] = useState<Task[]>([{ id: "" }]); // Lista de tarefas (iniciando com um campo vazio)

  const addTaskField = () => {
    setTasks([...tasks, { id: "" }]);
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].id = value;
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const updatedTasks = tasks;
    for (let i = 0; i < updatedTasks.length; i++) {
      const info = await getTaskInfo(updatedTasks[i].id);
      updatedTasks[i] = { ...updatedTasks[i], info };
    }
    const newSprint: Sprint = {
      id: Date.now() + "" + Math.random(),
      name,
      startDate,
      endDate,
      tasks: updatedTasks,
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
          <label>Tarefas da Sprint</label>
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="number"
                placeholder="ID da tarefa"
                className="form-control mr-2"
                value={task.id}
                onChange={(e) => handleTaskChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div>
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={addTaskField}
          >
            + Adicionar Tarefa
          </button>
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

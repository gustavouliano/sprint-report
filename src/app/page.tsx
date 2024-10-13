"use client";

import { Sprint } from "@/@types/sprint";
import { convertDateShow } from "@/util/convertDateShow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [sprints, setSprints] = useState<Sprint[]>([]);

  const handelOnClickNewSprint = () => {
    router.push("/sprint/new");
  };

  const handleDeleteSprint = (id: string) => {
    let updatedSprints = [...sprints];
    updatedSprints = updatedSprints.filter((sprint) => sprint.id !== id);
    setSprints(updatedSprints);
    localStorage.setItem("sprintData", JSON.stringify(updatedSprints));
  };

  const handleDashboard = (id: string) => {
    router.push(`/sprint/dashboard/${id}`);
  };

  const handleLoadSprints = () => {
    const sprintJson = localStorage.getItem("sprintData");
    if (!sprintJson) {
      return;
    }
    const sprints: Sprint[] = JSON.parse(sprintJson);
    setSprints(sprints);
  };

  useEffect(() => {
    handleLoadSprints();
  }, []);

  return (
    <div className="flex flex-col mx-auto items-center mt-4">
      <button
        type="button"
        className="btn btn-dark"
        onClick={handelOnClickNewSprint}
      >
        Criar Sprint
      </button>
      <ul className="list-group w-1/2 mt-4">
        {sprints.length === 0 ? (
          <p>Não há sprints disponíveis.</p>
        ) : (
          sprints.map((sprint) => (
            <li
              key={sprint.id}
              className="list-group-item d-flex justify-between align-items-center"
            >
              <span>
                {sprint.name} | {convertDateShow(sprint.startDate)} -{" "}
                {convertDateShow(sprint.endDate)}
              </span>
              <span>
                <button
                  type="button"
                  className="btn btn-success ml-2"
                  onClick={() => handleDashboard(sprint.id)}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={() => handleDeleteSprint(sprint.id)}
                >
                  Deletar
                </button>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

'use client'

import { Sprint } from "@/@types/sprint";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  
  const router = useRouter()

  const [sprints, setSprints] = useState<Sprint[]>([]);
  
  const handelOnClickNewSprint = () => {
    router.push('/sprint/new');
  };

  const handleDeleteSprint = (index: number) => {
    const updatedSprints = [...sprints];
    updatedSprints.splice(index, 1); // Remove a sprint pelo índice
    setSprints(updatedSprints);
    localStorage.setItem('sprintData', JSON.stringify(updatedSprints)); // Atualiza o localStorage
  };

  const handleLoadSprints = () => {
    const sprintJson = localStorage.getItem('sprintData');
    if (!sprintJson){
      return;
    }
    const sprints: Sprint[] = JSON.parse(sprintJson);
    setSprints(sprints);
  }

  useEffect(() => {
    handleLoadSprints();
  }, []);

  return (
    <div className="flex flex-col mx-auto items-center mt-4">
      <button type="button" className="btn btn-dark" onClick={handelOnClickNewSprint}>Criar Sprint</button>
      <ul className="list-group w-1/2 mt-4">
        {sprints.length === 0 ? (
          <p>Não há sprints disponíveis.</p>
        ) : (
          sprints.map((sprint, index) => (
            <li key={index} className="list-group-item d-flex justify-between align-items-center">
              <span>{sprint.name}</span>
              <button
                type="button"
                className="btn btn-success ml-2"
                onClick={() => handleDeleteSprint(index)}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="btn btn-danger ml-2"
                onClick={() => handleDeleteSprint(index)}
              >
                Deletar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

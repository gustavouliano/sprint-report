import { Task } from "./task";

export type Sprint = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    tasks: Task[];
}
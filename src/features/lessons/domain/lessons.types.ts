import { LessonCards, Lessons } from "@/types/tables";

export type LessonWithCards = { cards: LessonCards[] } & Lessons;

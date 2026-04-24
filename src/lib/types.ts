export interface Todo {
  id: string;
  title: string;
  details: string | null;
  completed: boolean;
  created_at: string;
  date: string; // YYYY-MM-DD
}

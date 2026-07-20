"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Todo = {
  id: string;
  task: string;
  is_complete: boolean;
  inserted_at: string;
};

export function TodoList() {
  const supabase = createClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("inserted_at", { ascending: false });

      if (error) setError(error.message);
      else setTodos(data ?? []);
      setLoading(false);
    }
    loadTodos();
  }, [supabase]);

  const filteredTodos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return todos;
    return todos.filter((todo) => todo.task.toLowerCase().includes(q));
  }, [todos, query]);

  async function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert({ task: newTask.trim() })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setTodos((current) => [data, ...current]);
    setNewTask("");
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          placeholder="새 할 일 입력"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button type="submit">추가</Button>
      </form>

      <Input
        placeholder="할 일 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : filteredTodos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {query ? "검색 결과가 없습니다." : "할 일이 없습니다. 추가해보세요."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className="border rounded-md px-3 py-2 text-sm">
              {todo.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

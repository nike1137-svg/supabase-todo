import { TodoList } from "@/components/todos/todo-list";

export default function TodosPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <div className="w-full max-w-md">
        <h1 className="font-bold text-2xl mb-4">할 일 목록</h1>
        <TodoList />
      </div>
    </div>
  );
}

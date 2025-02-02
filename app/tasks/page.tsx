'use client';

import { useEffect, useState } from "react";

type Task = {
  id: number;
  name: string;
  cycle: number; // 日数を保持する
};

// セレクトボックスの選択肢を定義
// valueは実際にDBに保存される「日数」
// labelはユーザーに見せるテキスト
const cycleOptions = [
  { value: 7, label: "週1" },
  { value: 30, label: "月1" },
  { value: 90, label: "3か月" },
  { value: 180, label: "半年" },
  { value: 365, label: "年1" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState('');
  const [cycle, setCycle] = useState<number>(7); // デフォルトは週1

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data));
  }, []);

  const createTask = async () => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cycle }),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setName('');
    setCycle(7);
  };

  const handleComplete = async (taskId: number) => {
    await fetch('/api/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, doneBy: 'me' }),
    });
    alert('完了しました!');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">家事タスク一覧</h1>

      {/* タスク新規追加フォーム */}
      <div className="flex flex-col gap-2 mb-4 md:flex-row">
        <input
          className="border border-gray-300 rounded px-2 py-1"
          placeholder="タスク名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* セレクトボックス：周期を選ぶ */}
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={cycle}
          onChange={(e) => setCycle(Number(e.target.value))}
        >
          {cycleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={createTask}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>

      {/* タスク一覧表示 */}
      <ul className="space-y-2">
        {tasks.map((t: Task) => (
          <li key={t.id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <span className="font-semibold">{t.name}</span>
              <span className="ml-2 text-sm text-gray-600">
                (周期: {t.cycle} 日)
              </span>
            </div>
            <button
              onClick={() => handleComplete(t.id)}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              完了
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
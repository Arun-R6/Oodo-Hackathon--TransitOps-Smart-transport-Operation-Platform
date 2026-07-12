import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header({ title }) {
  const { dark, toggle } = useTheme();
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}

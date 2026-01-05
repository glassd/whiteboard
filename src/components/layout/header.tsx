import { Link, useLocation } from "react-router-dom";
import { Pencil, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const location = useLocation();
  const isInRoom = location.pathname.startsWith("/room/");

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
      <Link
        to="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Pencil className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-lg">Whiteboard</span>
      </Link>

      <div className="flex items-center gap-2">
        {isInRoom && (
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

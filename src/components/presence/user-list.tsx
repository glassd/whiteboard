import { Users } from "lucide-react";
import { useRoomStore } from "@/stores/room-store";
import { useUserStore } from "@/stores/user-store";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function UserList() {
  const { users } = useRoomStore();
  const currentUserId = useUserStore((state) => state.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-2",
        )}
      >
        <Users className="w-4 h-4" />
        <span>{users.length}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Users in Room ({users.length})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No users</span>
          </DropdownMenuItem>
        ) : (
          users.map((user) => (
            <DropdownMenuItem key={user.id} className="gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: user.color }}
              />
              <span className="truncate">
                {user.name}
                {user.id === currentUserId && (
                  <span className="text-muted-foreground ml-1">(you)</span>
                )}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

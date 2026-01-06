import { useState } from "react";
import { Users, Pencil, Check } from "lucide-react";
import { useRoomStore } from "@/stores/room-store";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socket";

export function UserList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const { users, roomId } = useRoomStore();
  const {
    id: currentUserId,
    name: currentName,
    color,
    setName,
  } = useUserStore();

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      setName(newName.trim());
      // Rejoin room with new name to update other users
      if (roomId) {
        socket.emit("room:join", {
          roomId,
          user: { id: currentUserId, name: newName.trim(), color },
        });
      }
    }
    setIsEditing(false);
    setNewName("");
  };

  const startEditing = () => {
    setNewName(currentName);
    setIsEditing(true);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Users className="w-4 h-4" />
        <span>{users.length}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-md border bg-popover p-1 shadow-md">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Users in Room ({users.length})
            </div>
            <div className="h-px bg-border my-1" />
            {users.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No users
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: user.color }}
                  />
                  {user.id === currentUserId && isEditing ? (
                    <form
                      className="flex items-center gap-1 flex-1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRename();
                      }}
                    >
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="h-6 text-sm"
                        autoFocus
                      />
                      <Button type="submit" variant="ghost" size="icon-xs">
                        <Check className="w-3 h-3" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span className="truncate flex-1">
                        {user.name}
                        {user.id === currentUserId && (
                          <span className="text-muted-foreground ml-1">
                            (you)
                          </span>
                        )}
                      </span>
                      {user.id === currentUserId && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={startEditing}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

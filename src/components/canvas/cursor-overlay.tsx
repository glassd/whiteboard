import { useRoomStore } from '@/stores/room-store';
import { useUserStore } from '@/stores/user-store';

export function CursorOverlay() {
  const { cursors } = useRoomStore();
  const currentUserId = useUserStore((state) => state.id);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from(cursors.entries()).map(([userId, data]) => {
        // Don't show own cursor
        if (userId === currentUserId) return null;

        return (
          <div
            key={userId}
            className="absolute transition-transform duration-75 ease-out"
            style={{
              left: `${data.position.x * 100}%`,
              top: `${data.position.y * 100}%`,
              transform: 'translate(-2px, -2px)',
            }}
          >
            {/* Cursor pointer */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            >
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-5.07c.15-.15.36-.24.58-.24h6.43c.44 0 .67-.53.36-.84L6.35 2.86c-.31-.31-.85-.1-.85.35z"
                fill={data.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            {/* User name label */}
            <div
              className="absolute left-5 top-4 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap"
              style={{ backgroundColor: data.color }}
            >
              {data.userName}
            </div>
          </div>
        );
      })}
    </div>
  );
}

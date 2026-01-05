import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Pencil, Users, ArrowRight } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const createRoom = () => {
    const newRoomId = nanoid(10);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = roomId.trim();
    if (!trimmedId) {
      setError('Please enter a room ID');
      return;
    }
    if (trimmedId.length < 4) {
      setError('Room ID must be at least 4 characters');
      return;
    }
    navigate(`/room/${trimmedId}`);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Pencil className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Whiteboard</h1>
          <p className="text-muted-foreground">
            Real-time collaborative drawing for teams
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Create New Room
              </CardTitle>
              <CardDescription>
                Start a new whiteboard session and invite others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={createRoom} className="w-full" size="lg">
                Create Room
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or join existing
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Join Room</CardTitle>
              <CardDescription>
                Enter a room ID to join an existing session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={joinRoom} className="space-y-4">
                <Field>
                  <FieldLabel>Room ID</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Enter room ID..."
                    value={roomId}
                    onChange={(e) => {
                      setRoomId(e.target.value);
                      setError('');
                    }}
                  />
                  {error && (
                    <p className="text-sm text-destructive mt-1">{error}</p>
                  )}
                </Field>
                <Button type="submit" variant="outline" className="w-full" size="lg">
                  Join Room
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Share the room link with others to collaborate in real-time
        </p>
      </div>
    </div>
  );
}

"use client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Sessions } from "@/types/tables";

interface SessionCardProps {
  onStartSessionClick: () => void;
  session: Sessions;
}
export function SessionCard({
  session,
  onStartSessionClick,
}: SessionCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2>
          {session.title}
          <span>{session.topic}</span>
        </h2>
      </CardHeader>
      <CardContent>
        <p>{session.description}</p>
      </CardContent>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>Start Session</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => {}}>In-person</DropdownMenuItem>
          <DropdownMenuItem onClick={onStartSessionClick}>
            Virtual
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}

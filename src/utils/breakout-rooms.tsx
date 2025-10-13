import { BreakoutRoom } from "@/providers";

export function generateRooms<
  T extends { name: string; userId: string; sessionId: string }
>(participants: T[], maxPerRoom: number): BreakoutRoom[] {
  if (!participants.length) return [];

  // 1️⃣ Shuffle to randomize order
  const shuffled = [...participants].sort(() => Math.random() - 0.5);

  // 2️⃣ Calculate number of rooms
  const roomCount = Math.ceil(shuffled.length / maxPerRoom);

  // 3️⃣ Chunk into groups
  const rooms: BreakoutRoom[] = [];
  for (let i = 0; i < roomCount; i++) {
    const start = i * maxPerRoom;
    const chunk = shuffled.slice(start, start + maxPerRoom);
    rooms.push({
      id: `breakout-room-${i + 1}`,
      members: chunk,
    });
  }

  return rooms;
}

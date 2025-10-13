/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Call, CustomVideoEvent } from "@stream-io/video-react-sdk";

export interface VirtualPlaybookContext extends PlaybookContext {
  call: Call;
}
export interface PlaybookContext {
  call: Call;
  userId: string;
  state: Record<string, any>;
  setState: (next: Record<string, any>) => void;
  isHost: boolean;
  slug: string;
  position: number;
}
export interface PlaybookDefinition {
  slug: string;
  title: string;
  phases: string[];
  start: (ctx: PlaybookContext) => void;
  handleEvent: (event: CustomVideoEvent, ctx: PlaybookContext) => void;
  Component: React.FC<{ ctx: PlaybookContext }>;
  HostControls: React.FC<{ ctx: PlaybookContext }>;
}

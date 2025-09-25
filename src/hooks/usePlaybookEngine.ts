/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { PlaybookContext, PlaybookDefinition } from "@/types/playbook";
import { Call, CustomVideoEvent } from "@stream-io/video-react-sdk";
import { registry } from "@/activities/registry";

export interface UseVirtualPlaybookReturn {
  activity: PlaybookDefinition | null;
  startActivity: (slug: string) => void;
  ctx: PlaybookContext;
  isLoading: boolean;
  endActivity: () => void;
}
interface UseVirtualPlaybookOptions {
  onActivityStart?: () => void;
  onActivityEnd?: () => void;
}
export function usePlaybookEngine(
  call: Call,
  options?: UseVirtualPlaybookOptions
): UseVirtualPlaybookReturn {
  const [playbook, setPlaybook] = useState<PlaybookDefinition | null>(null);
  const [state, setState] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const ctx = useMemo(
    () =>
      ({
        call,
        userId: call?.currentUserId,
        state,
        setState,
      } as PlaybookContext),
    [call, state]
  );
  const parseEventSlug = (event: CustomVideoEvent) => {
    const payload = event.custom;
    const parts = payload?.type.split(":"); //must be in slug:event_name format

    if (parts?.length !== 2) {
      throw new Error(
        "Custom event must have a type and be in the format slug:event_name"
      );
    }
    if (parts[0] in registry === false) {
      //slug must be in the registry for it to send events
      throw new Error("slug must be in the registry for it to send events");
    }
    return parts[0];
  };
  const parseEventType = (event: CustomVideoEvent) => {
    const payload = event.custom;
    const parts = payload?.type.split(":"); //must be in slug:event_name format

    if (parts?.length !== 2) {
      throw new Error(
        "Custom event must have a type and be in the format slug:event_name"
      );
    }
    if (parts[0] in registry === false) {
      //slug must be in the registry for it to send events
      throw new Error("slug must be in the registry for it to send events");
    }
    return parts[1];
  };
  useEffect(() => {
    if (!call) return;

    const handler = (event: CustomVideoEvent) => {
      try {
        console.log(event.custom);
        const slug = parseEventSlug(event);
        const type = parseEventType(event);
        const activity = registry[slug];
        if (type === "start") {
          options?.onActivityStart?.();
        }
        setPlaybook(activity);

        activity.handleEvent(event, ctx);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Could not complete the event";
        alert(errorMessage);
        console.error(errorMessage);
      }
    };

    const unsubscribe = call.on("custom", handler);
    return () => unsubscribe();
  }, [playbook, call, ctx, options]);

  const startActivity = useCallback(
    async (slug: string) => {
      const activity = registry[slug];
      if (!call) throw new Error("No active call was found");
      if (!activity) throw new Error("This activity could not be found");

      try {
        setIsLoading(true);

        await call.sendCustomEvent({ type: `${slug}:start` });
        options?.onActivityStart?.();
        setIsLoading(false);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Couldn't start activity. Please try again later."
        );
      }
    },
    [call, options]
  );
  const endActivity = useCallback(async () => {
    setPlaybook(null);
    setState({});
    options?.onActivityEnd?.();
  }, [options]);
  return {
    activity: playbook,
    ctx,
    endActivity,
    isLoading,
    startActivity,
  };
}

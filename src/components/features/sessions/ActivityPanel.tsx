import { EmptyState, LoadingState } from "@/components/states";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { usePlaybook } from "@/features/playbooks/hooks";
import { UseVirtualPlaybookReturn } from "@/hooks";
import { Sessions } from "@/types/tables";
import { VirtualStrategyCard } from "./VirtualStrategyCard";

export function ActivityPanel({
  session,
  isHost,
  open,
  playbookEngine,
  onOpenChange,
  onTabChange,
  activeTab,
}: {
  session: Sessions;
  playbookEngine: UseVirtualPlaybookReturn;
  isHost: boolean;
  onTabChange: (tab: string) => void;
  open: boolean;
  activeTab: string;
  onOpenChange: (open: boolean) => void;
}) {
  const { playbook, isLoading: loadingLesson } = usePlaybook(session.lesson_id);
  const {
    startActivity,
    endActivity,
    isLoading: loadingActivity,
    activity,
    ctx,
  } = playbookEngine;
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="p-6  overflow-auto" side="left">
          <SheetDescription className="sr-only">
            Access the agenda, activities and chat for this session
          </SheetDescription>
          <SheetHeader>
            <div className="flex justify-between items-center"></div>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-md font-semibold">
                {`${session?.course_name ? session.course_name + ":" : ""}`}{" "}
                <span className="font-light">{session?.topic}</span>
              </SheetTitle>
            </div>
            {session?.scheduled_start && (
              <div className="text-sm text-muted-foreground">
                {new Date(session.scheduled_start).toDateString()}
              </div>
            )}
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="w-full mb-10">
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="playbook">Playbook</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="agenda">
              {loadingLesson ? (
                <LoadingState size={40} />
              ) : playbook?.strategies && playbook.strategies.length > 0 ? (
                <ul className="space-y-6">
                  {playbook.strategies.map((c) => (
                    <li key={c.id}>
                      <VirtualStrategyCard
                        isHost={isHost}
                        card={c}
                        onStartClick={() => {
                          startActivity(c.card_slug);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex flex-col justify-center items-center">
                  <EmptyState message="No agenda has been created." />
                </div>
              )}
            </TabsContent>
            <TabsContent value="playbook">
              {loadingActivity ? (
                <LoadingState />
              ) : activity ? (
                <div className="space-y-9">
                  <div className="flex gap-5 items-center justify-between bg-white rounded-full border-2 border-gray-200 px-7 py-2 ">
                    <h2>{activity.title}</h2>

                    <span className="text-xs max-w-20 flex items-center justify-center px-2 py-1 rounded-full font-medium capitalize bg-success-100 text-success-500">
                      {session.status.replace("_", " ")}
                    </span>
                  </div>

                  <activity.Component ctx={ctx} />
                  <div className="absolute flex gap-3 bottom-6">
                    {isHost && (
                      <Button variant={"link"} onClick={endActivity}>
                        End Activity
                      </Button>
                    )}
                    {isHost && <activity.HostControls ctx={ctx} />}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center">
                  {isHost ? (
                    <EmptyState message="No Strategy has been started yet. Start one by clicking 'Run Play' in the Agenda tab." />
                  ) : (
                    <EmptyState message="No Strategy has been started yet. When the host starts one, you will see it here." />
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}

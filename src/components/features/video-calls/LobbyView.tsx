import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@/components/ui";
import {
  PlayfieldProfile,
  usePlayfieldProfile,
} from "@/hooks/usePlayfieldProfile";
import { useEffect, useState } from "react";
import { AvatarPicker } from "../playfield";
import Image from "next/image";
import { ArrowRight, Camera, CameraOff, MicOff, Pencil } from "lucide-react";

import { useStreamCall } from "@/hooks";
import { AudioVolumeIndicator, CustomVideoPreview } from "./";

export default function LobbyView({
  onJoin,
}: {
  onJoin: (profile: PlayfieldProfile) => void;
}) {
  const call = useStreamCall();
  const { profile, saveProfile } = usePlayfieldProfile();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string>("/avatars/Number=1.png");
  const [camEnabled, setCamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [avatarsOpen, setAvatarsOpen] = useState(false);
  const handleSubmit = () => {
    saveProfile({ name, image, camEnabled, micEnabled });
    onJoin({ name, image, micEnabled, camEnabled });
  };
  useEffect(() => {
    if (!profile || !call.currentUserId) return;
    setImage(profile.image || "/avatars/Number=1.png");
    setName(profile.name || call.currentUserId.slice(0, 10));
    setCamEnabled(profile.camEnabled);
    setMicEnabled(profile.micEnabled);
  }, [call.currentUserId, profile]);
  useEffect(() => {
    if (camEnabled) {
      call.camera.enable();
    } else {
      call.camera.disable();
    }
  }, [call.camera, camEnabled]);
  useEffect(() => {
    if (micEnabled) {
      call.microphone.enable();
    } else {
      call.microphone.disable();
    }
  }, [call.microphone, micEnabled]);
  return (
    <div className="container gap-3 lg:gap-8 h-screen max-w-5xl  overflow-hidden items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold ">
            Session: {call.state.custom.course_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-7 max-w-xl w-full  mx-auto">
          <div className="flex gap-4 w-full">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
            />
            <Popover onOpenChange={setAvatarsOpen} open={avatarsOpen}>
              <PopoverTrigger asChild>
                <button className="relative rounded-full min-w-15 h-15  p-1 border flex items-center justify-center ">
                  <Image
                    src={image}
                    width={48}
                    height={48}
                    alt="avatar"
                    className="rounded-full"
                  />
                  <div className="absolute cursor-pointer rounded-full opacity-0 flex items-center justify-center w-full h-full text-foreground/40 hover:opacity-100  hover:bg-white/80 transition-all duration-200">
                    <Pencil />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <AvatarPicker
                  onSelect={(a) => {
                    setImage(a);
                    setAvatarsOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="relative flex border-white border-4 w-full max-w-md items-center justify-center  aspect-video rounded-xl overflow-hidden bg-primary-600">
            <CustomVideoPreview
              image={image}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-0 inset-x-0 backdrop-blur-lg flex items-center justify-between px-5 py-0 lg:py-1 bg-black/20 text-white">
              <div className="flex items-center gap-5">
                {camEnabled ? (
                  <button
                    className="hover:bg-foreground/10 flex items-center justify-center rounded-full w-12 h-12"
                    onClick={() => setCamEnabled(false)}
                  >
                    <Camera size={25} />
                  </button>
                ) : (
                  <button
                    className="hover:bg-foreground/10 flex items-center justify-center rounded-full w-12 h-12"
                    onClick={() => setCamEnabled(true)}
                  >
                    <CameraOff size={25} />
                  </button>
                )}
                <Switch onCheckedChange={setCamEnabled} checked={camEnabled} />
              </div>
              <div className="flex items-center gap-5 ">
                <div className="flex gap-2 items-center">
                  {micEnabled ? (
                    <AudioVolumeIndicator className="hover:bg-foreground/10" />
                  ) : (
                    <button
                      onClick={() => setMicEnabled(true)}
                      aria-label="Disable microphone"
                      className="relative hover:bg-foreground/10 flex items-center justify-center rounded-full w-12 h-12"
                    >
                      <MicOff size={30} />
                    </button>
                  )}
                  <Switch
                    onCheckedChange={setMicEnabled}
                    checked={micEnabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex w-full justify-end">
          <Button onClick={handleSubmit}>
            Join Playfield
            <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

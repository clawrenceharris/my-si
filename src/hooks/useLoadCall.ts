// import { getUserErrorMessage } from "@/utils/error";
// import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
// import { useEffect, useState } from "react";

// export function useLoadCall(id?: string | null) {
//   const client = useStreamVideoClient();
//   const [error, setError] = useState<string | null>(null);
//   const [mainCall, setMainCall] = useState<Call | null>(null);
//   const [activeCall, setActiveCall] = useState<Call | null>(null);

//   const [isLoading, setIsLoading] = useState(false);
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       activeCall?.leave();
//       mainCall?.leave();
//       client?.disconnectUser();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//   });

//   return { mainCall, activeCall, setActiveCall, isLoading, error };
// }

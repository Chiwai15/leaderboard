import { Socket } from "socket.io-client";
import { User } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

// Define the payload structure for each event type
interface ScoreChangePayload {
  event: "SCORE_DECREASE" | "SCORE_INCREASE";
  data: { uuid: string };
}

interface UserModificationPayload {
  event: "USER_DELETE" | "USER_CREATE" | "USER_UPDATE";
  data: { uuid?: string };
}

// Union type for all possible payloads
type DataChangePayload = ScoreChangePayload | UserModificationPayload;

// Type guard to narrow down to ScoreChangePayload
const isScoreChangePayload = (payload: DataChangePayload): payload is ScoreChangePayload => {
  return payload.event === "SCORE_DECREASE" || payload.event === "SCORE_INCREASE";
};

// Type guard to narrow down to UserModificationPayload
const isUserModificationPayload = (payload: DataChangePayload): payload is UserModificationPayload => {
  return payload.event === "USER_DELETE" || payload.event === "USER_CREATE" || payload.event === "USER_UPDATE";
};

export const registerUserTableEventHandler = (
    socket: Socket,
    getUsers: () => User[],
    setUsers: Dispatch<SetStateAction<User[]>>,
    fetchUsers: () => void
  ) => {
  socket.off("data_change").on("data_change", (payload: DataChangePayload) => {
    console.log("[Event] Data change received:", payload);

    if (isScoreChangePayload(payload)) {
      const { event, data } = payload;
      setUsers(
        getUsers().map((user) =>
          user.uuid === data.uuid
            ? { ...user, score: event === "SCORE_INCREASE" ? user.score + 1 : Math.max(0, user.score - 1) }
            : user
        )
      );
    } else if (isUserModificationPayload(payload)) {
      const { event, data } = payload;
      switch (event) {
        case "USER_DELETE":
          if (data.uuid) {
            setUsers(getUsers().filter((user) => user.uuid !== data.uuid));
          } else {
            console.warn("[Event] USER_DELETE event received without a uuid:", data);
          }
          break;
        case "USER_CREATE":
        case "USER_UPDATE":
          console.log(`[Event] ${event} triggered. Refreshing users.`);
          fetchUsers();
          break;
      }
    } else {
      console.warn("[Event] Received unknown event type:", payload);
    }
  });
};

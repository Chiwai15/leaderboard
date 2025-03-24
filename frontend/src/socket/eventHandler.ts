import { Socket } from "socket.io-client";

export type User = {
  uuid: string;
  firstname: string;
  lastname: string;
  score: number;
  // other fields...
};

type DataChangePayload =
  | { event: "SCORE_DECREASE" | "SCORE_INCREASE"; data: { uuid: string } }
  | { event: "USER_DELETE" | "USER_CREATE" | "USER_UPDATE"; data: {} };

export const registerUserTableEventHandler = (
  socket: Socket,
  getUsers: () => User[],
  setUsers: (users: User[]) => void,
  fetchUsers: () => void
) => {
    socket.off("data_change").on("data_change", (payload: DataChangePayload) => {
        const { event, data } = payload;
        console.log("[Event] Data change received:", payload);
        if (!data) return;
      
        switch (event) {
          case "SCORE_DECREASE":
            setUsers(
              getUsers().map((user) =>
                user.uuid === data.uuid
                  ? { ...user, score: Math.max(0, user.score - 1) }
                  : user
              )
            );
            break;
      
          case "SCORE_INCREASE":
            setUsers(
              getUsers().map((user) =>
                user.uuid === data.uuid
                  ? { ...user, score: user.score + 1 }
                  : user
              )
            );
            break;
      
            case "USER_DELETE":
                if (!data.uuid) {
                  console.warn("[Event] user_delete missing uuid:", data);
                  break;
                }
                setUsers(getUsers().filter((user) => user.uuid !== data.uuid));
                break;
          
              case "USER_UPDATE":
              case "USER_CREATE":
                console.log(`[Event] ${event} triggered. Refreshing users.`);
                fetchUsers(); // Full refresh
                break;
        }
      });
    }
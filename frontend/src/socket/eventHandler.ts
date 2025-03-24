import { Socket } from "socket.io-client";

export type User = {
  uuid: string;
  firstname: string;
  lastname: string;
  score: number;
  // other fields...
};

type DataChangePayload =
  | { event: "score_decrease" | "score_increase"; data: { uuid: string } }
  | { event: "user_delete" | "user_create" | "user_update"; data: {} };

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
          case "score_decrease":
            setUsers(
              getUsers().map((user) =>
                user.uuid === data.uuid
                  ? { ...user, score: Math.max(0, user.score - 1) }
                  : user
              )
            );
            break;
      
          case "score_increase":
            setUsers(
              getUsers().map((user) =>
                user.uuid === data.uuid
                  ? { ...user, score: user.score + 1 }
                  : user
              )
            );
            break;
      
            case "user_delete":
                if (!data.uuid) {
                  console.warn("[Event] user_delete missing uuid:", data);
                  break;
                }
                setUsers(getUsers().filter((user) => user.uuid !== data.uuid));
                break;
          
              case "user_update":
              case "user_create":
                console.log(`[Event] ${event} triggered. Refreshing users.`);
                fetchUsers(); // Full refresh
                break;
        }
      });
    }
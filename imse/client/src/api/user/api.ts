import api from "../../api";
import { UserFriendDTO } from "./UserFriendDTO";
import { UserWithJwtDTO } from "./UserWithJwtDTO";

export async function getUsers(): Promise<UserWithJwtDTO[]> {
  const response = await api.get("/user");
  return response.data;
}

export async function getUserFriends(token: string): Promise<UserFriendDTO[]> {
  const response = await api.get("/friend", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

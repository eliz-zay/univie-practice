import { UserDTO } from "./UserDTO";

export enum FriendRoleEnum {
  Initiator = "Initiator",
  Acceptor = "Acceptor",
}
export type UserFriendDTO = {
  friend: UserDTO;
  role: FriendRoleEnum;
  isAccepted: boolean;
};

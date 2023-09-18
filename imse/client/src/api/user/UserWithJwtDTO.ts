import { UserDTO } from "./UserDTO";

export type UserWithJwtDTO = {
  jwt: string;
  user: UserDTO;
};
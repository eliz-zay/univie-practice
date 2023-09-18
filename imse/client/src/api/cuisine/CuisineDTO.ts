import { UserDTO } from "../user/UserDTO";

export type CuisineDTO = {
  id: string;
  country: string;
  description: string;
  likedByUsers: UserDTO[];
};

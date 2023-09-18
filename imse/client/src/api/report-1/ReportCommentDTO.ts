import { UserDTO } from "../user/UserDTO";

export type ReportCommentDTO = {
  text: string;
  user: UserDTO;
  createdAt: Date;
}

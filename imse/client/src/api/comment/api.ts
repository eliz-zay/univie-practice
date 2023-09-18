import api from "../../api";
import { CreateCommentDTO } from "./CreateCommentDTO";

export async function postComment(
  token: string,
  commentDTO: CreateCommentDTO
): Promise<void[]> {
  const {recipeId, text} = commentDTO;
  const response = await api.post(`/comment/recipe/${recipeId}`, {text}, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

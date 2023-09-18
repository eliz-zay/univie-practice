import { useMutation, useQueryClient } from "react-query";
import { postComment } from "./api";
import { CreateCommentDTO } from "./CreateCommentDTO";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function usePostComment() {
  const queryClient = useQueryClient();

  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  const { mutate } = useMutation(
    (commentDTO: CreateCommentDTO) => postComment(currentUser?.token!, commentDTO),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );
  return mutate;
}

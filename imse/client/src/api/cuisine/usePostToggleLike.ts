import { useMutation, useQueryClient } from "react-query";
import { postToggleLike } from "./api";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

export default function usePostToggleLike() {
  const queryClient = useQueryClient();

  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  const { mutate } = useMutation(
    (id: string) => postToggleLike(id, currentUser?.token!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getCuisines");
      },
    }
  );
  return mutate;
}

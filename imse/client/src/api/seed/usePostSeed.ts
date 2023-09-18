import { useMutation, useQueryClient } from "react-query";
import { postSeed } from "./api";

export default function usePostSeed() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(() => postSeed(), {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  return mutate;
}

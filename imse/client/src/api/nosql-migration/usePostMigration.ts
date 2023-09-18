import { useMutation, useQueryClient } from "react-query";
import { postMigration } from "./api";

export default function usePostSeed() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(() => postMigration(), {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  return mutate;
}

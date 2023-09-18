import { useQuery } from "react-query";
import { getRecipes } from "./api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function useGetRecipes() {
  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  return useQuery(["getRecipes"], () => getRecipes(currentUser!.token!), {
    enabled: Boolean(currentUser),
  });
}

import { useQuery } from "react-query";
import { getIngredients } from "./api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

function useGetIngredients() {
  const { currentUser } = useSelector((state: RootState) => state.currentUser);
  
  return useQuery(["getIngredients"], () => getIngredients(currentUser!.token), {
    enabled: Boolean(currentUser),
  });
}

export default useGetIngredients;

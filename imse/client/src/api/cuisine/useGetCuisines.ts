import { useQuery } from "react-query";
import { getCuisines } from "./api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

function useGetCuisines() {
  const { currentUser } = useSelector((state: RootState) => state.currentUser);
  
  return useQuery(["getCuisines"], () => getCuisines(currentUser!.token), {
    enabled: Boolean(currentUser),
  });
}

export default useGetCuisines;

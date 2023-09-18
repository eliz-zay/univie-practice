import { useQuery } from "react-query";
import { getReportOne } from "./api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function useGetReportOne(ingredientType: string | undefined) {
  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  return useQuery(["getReportOne", ingredientType], () => getReportOne(currentUser!.token!, ingredientType), {
    enabled: Boolean(currentUser),
  });
}

import { useQuery } from "react-query";
import { getReportTwo } from "./api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function useGetReportTwo(username: string) {
  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  return useQuery(["getReportTwo" + username], () => getReportTwo(currentUser!.token!, username), {
    enabled: Boolean(currentUser),
  });
}

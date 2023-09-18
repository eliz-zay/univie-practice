import { useQuery } from "react-query";
import { getUserFriends } from "./api";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

export default function useGetUserFriends() {
  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  return useQuery(
    ["getUserFriends", currentUser?.token ?? ""],
    () => getUserFriends(currentUser!.token),
    {
      enabled: Boolean(currentUser),
    }
  );
}

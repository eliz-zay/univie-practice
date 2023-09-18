import { useQuery } from "react-query";
import { getUsers } from "./api";

export default function useGetUsers() {
  return useQuery(["getUsers"], () => getUsers());
}

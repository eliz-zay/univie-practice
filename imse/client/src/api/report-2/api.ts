import api from "../../api";
import { ReportTwoDTO } from "./ReportTwoDTO";

export async function getReportTwo(
  token: string,
  username: string
): Promise<ReportTwoDTO[]> {

  const queryParams = username !== "" ? `?username=${username}` : "";

  const response = await api.get(`/cuisine/report${queryParams}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

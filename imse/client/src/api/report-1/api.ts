import api from "../../api";
import { ReportOneDTO } from "./ReportOneDTO";
export async function getReportOne(
  token: string,
  ingredientType: string | undefined
): Promise<ReportOneDTO[]> {
  const response = await api.get(`/ingredient/report?ingredientType=${ingredientType ?? ""}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

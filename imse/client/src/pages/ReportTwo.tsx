import { Form } from "react-bootstrap";
import useGetReportTwo from "../api/report-2/useGetReportTwo";
import ReportTwoUserDropdown from "../components/ReportTwoUserDropdown";
import { useState } from "react";
import { UserDTO } from "../api/user/UserDTO";
import ReportTwoTable from "../components/Tables/ReportTwoTable";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

function ReportTwo() {
  const [chosenUser, setChosenUser] = useState<UserDTO>();
  const { data: reportTwo } = useGetReportTwo(chosenUser?.username ?? "");
  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="w-75 my-5 mx-auto">
      <div>
        Top 10 most liked cuisines among your friends sorted by the amount of
        recipes per cuisine.
      </div>
      <div className="ms-5">Use entities: User, Recipe, Cuisine</div>
      <div className="ms-5">Filter by: User's username</div>
      <div className="ms-5">Sort by: Number of recipes</div>

      <Form.Group className="my-3">
        <Form.Label>User's username</Form.Label>
        <ReportTwoUserDropdown
          chosenUser={chosenUser}
          setChosenUser={setChosenUser}
        />
      </Form.Group>
      <ReportTwoTable reportTwo={reportTwo}/>
    </div>
  );
}

export default ReportTwo;

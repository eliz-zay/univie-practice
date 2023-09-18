import {Dropdown } from "react-bootstrap";
import { UserDTO } from "../api/user/UserDTO";
import useGetUsers from "../api/user/useGetUsers";
import { UserWithJwtDTO } from "../api/user/UserWithJwtDTO";

type Props = {
  chosenUser: UserDTO | undefined;
  setChosenUser: (user: UserDTO) => void;
}

function ReportTwoUserDropdown({chosenUser, setChosenUser}: Props) {
  const { data: usersWithJwt } = useGetUsers();

  const handleSelect = (userWithJwt: UserWithJwtDTO) => {
    setChosenUser(userWithJwt.user);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">
        {chosenUser?.username ?? "Choose User"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {usersWithJwt?.map((userWithJwt) => (
          <Dropdown.Item
            key={userWithJwt.user.id}
            onClick={() => handleSelect(userWithJwt)}
          >
            {userWithJwt.user.username}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

}

export default ReportTwoUserDropdown;
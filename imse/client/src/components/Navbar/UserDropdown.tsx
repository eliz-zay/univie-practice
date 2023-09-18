import { Dropdown } from "react-bootstrap";
import useGetUsers from "../../api/user/useGetUsers";
import { UserWithJwtDTO } from "../../api/user/UserWithJwtDTO";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { UserDetailsDTO } from "../../api/user/UserDetailsDTO";
import { setCurrentUser } from "../../store/currentUserSlice";
import { useQueryClient } from "react-query";

function UserDropdown() {
  const queryClient = useQueryClient();
  const { data: usersWithJwt } = useGetUsers();
  const { currentUser } = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();


  const handleSelect = (userWithJwt: UserWithJwtDTO) => {
    const currentUserDetails: UserDetailsDTO = {
      id: userWithJwt.user.id,
      username: userWithJwt.user.username,
      token: userWithJwt.jwt,
    };
    dispatch(setCurrentUser(currentUserDetails));
    queryClient.invalidateQueries();
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {currentUser?.username ?? "Choose User"}
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

export default UserDropdown;

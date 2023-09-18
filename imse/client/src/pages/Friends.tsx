import { ListGroup } from "react-bootstrap";
import useGetUserFriends from "../api/user/useGetUserFriends";

function Friends() {
  const { data: friends } = useGetUserFriends();

  if (!friends) {
    return null;
  }

  return (
    <ListGroup className="mx-5 my-5">
      {friends.map((friend) => (
        <ListGroup.Item
          key={friend.friend.id}
          className="d-flex justify-content-between"
        >
          <div className="my-auto">{friend.friend.username}</div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default Friends;

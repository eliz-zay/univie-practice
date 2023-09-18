import { Button } from "react-bootstrap";
import usePostSeed from "../../api/seed/usePostSeed";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/currentUserSlice";

function FillSQLButton() {
  const postSeed = usePostSeed();
  const dispatch = useDispatch();

  const handleClick = () => {
    postSeed();
    dispatch(setCurrentUser(null))
  };

  return <Button onClick={handleClick}>Fill SQL</Button>;
}

export default FillSQLButton;

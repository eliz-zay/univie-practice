import { Button } from "react-bootstrap";
import usePostMigration from "../../api/nosql-migration/usePostMigration";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/currentUserSlice";

function FillNoSQLButton() {
  const postMigration = usePostMigration();
  const dispatch = useDispatch();

  const handleClick = () => {
    postMigration();
    dispatch(setCurrentUser(null));
  };

  return (
    <Button variant="warning" onClick={handleClick}>
      Migrate NoSQL
    </Button>
  );
}

export default FillNoSQLButton;

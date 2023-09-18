import { Button, ListGroup, Modal } from "react-bootstrap";
import { CuisineDTO } from "../../api/cuisine/CuisineDTO";

type Props = {
  cuisine: CuisineDTO | undefined;
  showModal: boolean;
  handleClose: () => void;
};

function LikedCuisinesModal({ cuisine, showModal, handleClose }: Props) {
  if (!cuisine) {
    return null;
  }
  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Likes of {cuisine.country}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {cuisine.likedByUsers.map((user) => (
              <ListGroup.Item key={user.id}>{user.username}</ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LikedCuisinesModal;

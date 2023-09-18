import { Button, ListGroup, Modal } from "react-bootstrap";
import { RecipeDTO } from "../../api/recipe/RecipeDTO";

type Props = {
  recipe: RecipeDTO | undefined;
  showModal: boolean;
  handleClose: () => void;
};

function SeeCommentsModal({ recipe, showModal, handleClose }: Props) {
  if (!recipe) {
    return null;
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Read comments of {recipe.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {recipe.comments.map((comment) => (
            <ListGroup.Item key={comment.id}>{comment.text}</ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SeeCommentsModal;

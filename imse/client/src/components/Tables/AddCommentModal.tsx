import { Button, Form, Modal } from "react-bootstrap";
import { RecipeDTO } from "../../api/recipe/RecipeDTO";
import usePostComment from "../../api/comment/usePostComment";
import { BaseSyntheticEvent, useState } from "react";

type Props = {
  recipe: RecipeDTO | undefined;
  showModal: boolean;
  handleClose: () => void;
};

function AddCommentModal({ recipe, showModal, handleClose }: Props) {
  const postComment = usePostComment();

  const [text, setText] = useState("");

  if (!recipe) {
    return null;
  }

  const handleSubmit = () => {
    postComment({ recipeId: recipe.id, text });
    handleClose();
    setText("");
  };

  const handleCloseWithEmptyText = () => {
    handleClose();
    setText("");
  }

  const handleChange = (event: BaseSyntheticEvent) => {
    setText(event.target.value);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleCloseWithEmptyText}>
        <Modal.Header closeButton>
          <Modal.Title>Add comment to {recipe.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Comment</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={text}
            type="text"
            aria-describedby="commentArea"
          />
          <Form.Text id="commentArea">
            Add here your comment about the recipe
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWithEmptyText}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCommentModal;

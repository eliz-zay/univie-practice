import { Button, ListGroup, Modal } from "react-bootstrap";
import { RecipeDTO } from "../../api/recipe/RecipeDTO";

type Props = {
  recipe: RecipeDTO | undefined;
  showModal: boolean;
  handleClose: () => void;
};

function IngredientsModal({ recipe, showModal, handleClose }: Props) {
  if (!recipe) {
    return null;
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Read comments of {recipe.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-bordered mx-auto my-5 w-75">
          <thead className="thead-light">
            <tr>
              <th scope="col">Ingredient name</th>
              <th scope="col">Type</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recipe.ingredientAmounts.map((row) => (
              <>
                <tr>
                  <td>{row.ingredient.name}</td>
                  <td>{row.ingredient.type}</td>
                  <td>{row.amount}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default IngredientsModal;

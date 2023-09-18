import { Button, ListGroup } from "react-bootstrap";
import { RecipeDTO } from "../../api/recipe/RecipeDTO";
import { useState } from "react";
import AddCommentModal from "./AddCommentModal";
import SeeCommentsModal from "./SeeCommentsModal";
import IngredientsModal from "./IngredientsModal";

type Props = {
  recipes: RecipeDTO[];
};

function RecipesTable({ recipes }: Props) {
  const sortedRecipes = recipes.sort((a, b) => (a.id > b.id ? 1 : -1));

  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [showSeeCommentsModal, setShowSeeCommentsModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  const [modalRecipe, setRecipe] = useState<RecipeDTO>();

  const handleAddCommentModalClose = () => setShowAddCommentModal(false);
  const handleSeeCommentsModalClose = () => setShowSeeCommentsModal(false);
  const handleIngredientModalClose = () => setShowIngredientModal(false);

  const handleAddCommentModalOpen = (recipe: RecipeDTO) => {
    setRecipe(recipe);
    setShowAddCommentModal(true);
  };

  const handleSeeCommentsModalOpen = (recipe: RecipeDTO) => {
    setRecipe(recipe);
    setShowSeeCommentsModal(true);
  };

  const handleIngredientModalOpen = (recipe: RecipeDTO) => {
    setRecipe(recipe);
    setShowIngredientModal(true);
  };

  return (
    <>
      <ListGroup className="mx-5 my-5">
        {sortedRecipes.map((recipe) => (
          <ListGroup.Item
            key={recipe.id}
            className="d-flex justify-content-between"
          >
            <div className="my-auto">{recipe.name}</div>
            <div>
              <Button variant="success" className="me-2" onClick={() => handleSeeCommentsModalOpen(recipe)}>
                See comments
              </Button>
              <Button variant="info" className="me-2" onClick={() => handleIngredientModalOpen(recipe)}>
                See ingredients
              </Button>
              <Button onClick={() => handleAddCommentModalOpen(recipe)}>
                Add comment
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <AddCommentModal
        recipe={modalRecipe}
        showModal={showAddCommentModal}
        handleClose={handleAddCommentModalClose}
      />
      <SeeCommentsModal
        recipe={modalRecipe}
        showModal={showSeeCommentsModal}
        handleClose={handleSeeCommentsModalClose}
      />
      <IngredientsModal
        recipe={modalRecipe}
        showModal={showIngredientModal}
        handleClose={handleIngredientModalClose}
      />
    </>
  );
}

export default RecipesTable;

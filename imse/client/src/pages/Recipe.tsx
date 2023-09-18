import useGetRecipes from "../api/recipe/useGetRecipes";
import RecipesTable from "../components/Tables/RecipesTable";

function Recipe() {
  const { data: recipes } = useGetRecipes();

  if (!recipes) {
    return null;
  }

  return <RecipesTable recipes={recipes} />;
}

export default Recipe;

import useGetCuisines from "../api/cuisine/useGetCuisines";
import useGetIngredients from "../api/ingredient/useGetIngredients";
import CuisinesTable from "../components/Tables/CuisinesTable";
import IngredientsTable from "../components/Tables/IngredientsTable";

function Ingredient() {
  const { data: ingredients } = useGetIngredients();

  if (!ingredients) {
    return null;
  }

  return <IngredientsTable ingredients={ingredients} />;
}

export default Ingredient;

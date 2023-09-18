import { Form } from "react-bootstrap";
import useGetReportOne from "../api/report-1/useGetReportOne";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";
import ReportOneIngredientDropdown from "../components/ReportOneIngredientDropdown";

function ReportOne() {
  const [ingredientType, setIngredientType] = useState<string>();

  const { currentUser } = useSelector((state: RootState) => state.currentUser);
  const { data: reportOne } = useGetReportOne(ingredientType);

  if (!reportOne || !currentUser) {
    return null;
  }

  return (
    <div className="w-75 my-5 mx-auto">
      <div>
        The list of the ingredients with the most commented recipe of the
        ingredient.
      </div>
      <div className="ms-5">Use entities: Comment, Recipe, Ingredient</div>
      <div className="ms-5">Filter by: Ingredient type</div>
      <div className="ms-5">Sort by: Number of comments</div>
      <Form.Group className="my-3">
        <Form.Label>Ingredient's type</Form.Label>
        <ReportOneIngredientDropdown
          chosenType={ingredientType}
          setChosenType={setIngredientType}
        />
      </Form.Group>

      <table className="table my-3">
        <thead className="thead-light">
          <tr>
            <th scope="col">Ingredient name</th>
            <th scope="col">Most commented recipes name</th>
            <th scope="col">Last comment of a recipe</th>
            <th scope="col">Number of comments</th>
          </tr>
        </thead>
        <tbody>
          {reportOne.map((row) => (
            <>
              <tr>
                <th scope="row">{row.ingredient.name}</th>
                <td>{row.popularRecipe.name}</td>
                <td>{row.recipeLastComment.text}</td>
                <td>{row.recipeCommentCount}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportOne;

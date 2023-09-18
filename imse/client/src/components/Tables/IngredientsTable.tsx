import { IngredientDTO } from "../../api/ingredient/IngredientDTO";

type Props = {
  ingredients: IngredientDTO[];
};

function IngredientsTable({ ingredients }: Props) {
  return (
    <table className="table table-bordered mx-auto my-5 w-75">
      <thead className="thead-light">
        <tr>
          <th scope="col">Ingredient name</th>
          <th scope="col">Type</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((row) => (
          <>
            <tr>
              <td>{row.name}</td>
              <td>{row.type}</td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
}

export default IngredientsTable;

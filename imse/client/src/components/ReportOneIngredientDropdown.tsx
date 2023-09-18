import { Dropdown } from "react-bootstrap";
import useGetIngredients from "../api/ingredient/useGetIngredients";

type Props = {
  chosenType: string | undefined;
  setChosenType: (type: string) => void;
};

function ReportOneIngredientDropdown({ chosenType, setChosenType }: Props) {
  const { data: ingredients } = useGetIngredients();

  if (!ingredients) {
    return null;
  }

  const types = Array.from(new Set(ingredients.map((i) => i.type)));

  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">
        {chosenType ?? "Choose Type"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {types.map((type) => (
          <Dropdown.Item key={type} onClick={() => setChosenType(type)}>
            {type}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ReportOneIngredientDropdown;

import useGetCuisines from "../api/cuisine/useGetCuisines";
import CuisinesTable from "../components/Tables/CuisinesTable";

function Cuisine() {
  const { data: cuisines } = useGetCuisines();

  if (!cuisines) {
    return null;
  }

  return <CuisinesTable cuisines={cuisines} />;
}

export default Cuisine;

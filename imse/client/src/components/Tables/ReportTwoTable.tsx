import { ReportTwoDTO } from "../../api/report-2/ReportTwoDTO";

type Props = {
  reportTwo: ReportTwoDTO[] | undefined;
};

function ReportTwoTable({ reportTwo }: Props) {
  if (!reportTwo) {
    return null;
  }

  return (
    <table className="table my-3">
      <thead className="thead-light">
        <tr>
          <th scope="col">Cuisine</th>
          <th scope="col">Amount of friends who like the cuisine</th>
          <th scope="col">
            Percentage of friends who like the cuisine out of all friends (liked
            friends / all friends)
          </th>
          <th scope="col">Number of cuisines recipes</th>
        </tr>
      </thead>
      <tbody>
        {reportTwo.map((row) => (
          <>
            <tr key={row.cuisine.id}>
              <th scope="row">{row.cuisine.country}</th>
              <td>{row.likedFriendsCount}</td>
              <td>{row.likedFriendsPercent.toFixed(2)}%</td>
              <td>{row.recipeCount}</td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
}

export default ReportTwoTable;

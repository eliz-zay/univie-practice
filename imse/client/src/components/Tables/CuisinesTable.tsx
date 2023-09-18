import { Button, ListGroup, Modal } from "react-bootstrap";
import { CuisineDTO } from "../../api/cuisine/CuisineDTO";
import usePostToggleLike from "../../api/cuisine/usePostToggleLike";
import { useState } from "react";
import LikedCuisinesModal from "./LikedCuisinesModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type Props = {
  cuisines: CuisineDTO[];
};

function CuisinesTable({ cuisines }: Props) {
  const toggleLike = usePostToggleLike();

  const sortedCuisines = cuisines.sort((a, b) => (a.id > b.id ? 1 : -1));

  const { currentUser } = useSelector((state: RootState) => state.currentUser);

  const [showModal, setShowModal] = useState(false);
  const [cuisine, setCuisine] = useState<CuisineDTO>();
  const handleModalClose = () => setShowModal(false);

  if (!currentUser) {
    return null;
  }

  const handleLikeClick = (id: string) => {
    toggleLike(id);
  };

  const getLikeLabel = (cuisine: CuisineDTO) => {
    const likedIDs = cuisine.likedByUsers.map((user) => user.id);
    if (likedIDs.includes(currentUser!.id)) {
      return "Dislike";
    }
    return "Like";
  };

  const handleModalOpen = (cuisine: CuisineDTO) => {
    setCuisine(cuisine);
    setShowModal(true);
  };

  return (
    <>
      <ListGroup className="mx-5 my-5">
        {sortedCuisines.map((cuisine) => (
          <ListGroup.Item
            key={cuisine.id}
            className="d-flex justify-content-between"
          >
            <div className="my-auto">{cuisine.country}</div>
            <div className="w-50 d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => handleModalOpen(cuisine)}
              >
                {"Check who liked"}
              </Button>
              <Button
                className="w-25"
                onClick={() => handleLikeClick(cuisine.id)}
              >
                {getLikeLabel(cuisine)}
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <LikedCuisinesModal
        cuisine={cuisine}
        showModal={showModal}
        handleClose={handleModalClose}
      />
    </>
  );
}

export default CuisinesTable;

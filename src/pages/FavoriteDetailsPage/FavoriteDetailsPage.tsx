import { useParams } from "react-router-dom";
import FavoriteForm from "./FavoriteForm";
import { Alert, Navbar, Title } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { removeFavorite, selectFavoriteById, updateFavorite } from "../../store/favoritesSlice";

export function FavoriteDetailsPage() {
  const { favoriteId } = useParams();
  const favorite = useAppSelector(state => selectFavoriteById(state, favoriteId || ''));
  const dispatch = useAppDispatch();

  if (!favorite) {
    return <Alert>Favorite not found</Alert>;
  }

  return (
    <>
      <Navbar height={100}>
        <Navbar.Section>
          <Title order={2}>Edit {favorite?.name}</Title>
        </Navbar.Section>
      </Navbar>

      <FavoriteForm
        favorite={favorite}
        onDelete={() => dispatch(removeFavorite(favorite.id))}
        onUpdate={(id, updated) => dispatch(updateFavorite({ id, updated }))}
      />
    </>
  );
}

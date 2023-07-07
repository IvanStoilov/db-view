import { useParams } from "react-router-dom";
import FavoriteForm from "./FavoriteForm";
import { Alert, Navbar, Title } from "@mantine/core";
import { useAppContext } from "../../hooks/AppContext";

export function FavoriteDetailsPage() {
  const { favoriteId } = useParams();
  const { favorites } = useAppContext();
  const favorite = favorites.items.find((fav) => fav.id === favoriteId);

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
        onDelete={() => favorites.remove(favorite)}
        onUpdate={favorites.update}
      />
    </>
  );
}

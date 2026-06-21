import { useParams } from "react-router";
import useProfile from "../../lib/hooks/useProfile";
import { ImageList, ImageListItem, Typography } from "@mui/material";

export default function ProfilePhotos() {
  const { id } = useParams();
  const { photos, photosAreLoading } = useProfile(id);

  if (photosAreLoading) return <Typography>Loading photos...</Typography>;
  else if (!photos || photos.length === 0)
    return <Typography>No photos found for this user</Typography>;

  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {photos.map((photo) => (
        <ImageListItem key={photo.id}>
          <img
            srcSet={`${photo.url.replace(
              "/upload/",
              "/upload/w_164,h_164,c_fill,f_auto,dpr_2,g_face",
            )}`}
            src={`${photo.url}.replace(
              "/upload/",
              "/upload/w_164,h_164,c_fill,f_auto,g_face",`}
            alt={"user profile image"}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

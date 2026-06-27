import { useParams } from "react-router";
import useProfile from "../../lib/hooks/useProfile";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PhotoUploadWidget from "../../app/shared/components/PhotoUploadWidget";

export default function ProfilePhotos() {
  const { id } = useParams();
  const { photos, photosAreLoading, isCurrentUser, uploadPhoto } =
    useProfile(id);
  const [editMode, setEditMode] = useState(false);

  if (photosAreLoading) return <Typography>Loading photos...</Typography>;
  else if (!photos || photos.length === 0)
    return <Typography>No photos found for this user</Typography>;

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto.mutate(file, {
      onSuccess: () => {
        setEditMode(false);
      },
    });
  };

  return (
    <Box>
      {isCurrentUser && (
        <Box>
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Add photo"}
          </Button>
        </Box>
      )}
      {editMode ? (
        <PhotoUploadWidget
          uploadPhoto={handlePhotoUpload}
          loading={uploadPhoto.isPending}
        />
      ) : (
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
      )}
    </Box>
  );
}

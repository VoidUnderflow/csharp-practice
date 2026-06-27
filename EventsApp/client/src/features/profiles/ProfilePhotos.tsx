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
import StarButton from "../../app/shared/components/StarButton";
import DeleteButton from "../../app/shared/components/DeleteButton";

export default function ProfilePhotos() {
  const { id } = useParams();
  const {
    photos,
    photosAreLoading,
    isCurrentUser,
    uploadPhoto,
    profile,
    setMainPhoto,
    deletePhoto,
  } = useProfile(id);
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
                  "/upload/w_164,h_164,c_fill,f_auto,dpr_2,g_face/",
                )}`}
                src={`${photo.url.replace(
                  "/upload/",
                  "/upload/w_164,h_164,c_fill,f_auto,g_face/",
                )}`}
                alt={"user profile image"}
                loading="lazy"
              />
              {isCurrentUser && (
                <div>
                  <Box
                    sx={{ position: "absolute", top: 0, left: 0 }}
                    onClick={() => setMainPhoto.mutate(photo)}
                  >
                    <StarButton selected={photo.url === profile?.imageUrl} />
                  </Box>
                  {profile?.imageUrl !== photo.url && (
                    <Box
                      sx={{ position: "absolute", top: 0, right: 0 }}
                      onClick={() => deletePhoto.mutate(photo.id)}
                    >
                      <DeleteButton />
                    </Box>
                  )}
                </div>
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}

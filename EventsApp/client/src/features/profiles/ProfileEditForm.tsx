import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useParams } from "react-router";
import useProfile from "../../lib/hooks/useProfile";
import TextInput from "../../app/shared/components/TextInput";
import {
  editProfileSchema,
  type EditProfileSchema,
} from "../../lib/schemas/editProfileSchema";

type ProfileEditFormProps = {
  setEditMode: (editMode: boolean) => void;
};

export default function ProfileEditForm({ setEditMode }: ProfileEditFormProps) {
  const { id } = useParams();
  const { profile, editProfile } = useProfile(id);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<EditProfileSchema>({
    mode: "onTouched",
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    if (profile)
      reset({
        displayName: profile.displayName,
        bio: profile.bio ?? "",
      });
  }, [profile, reset]);

  const onSubmit = (data: EditProfileSchema) => {
    editProfile.mutate(data, {
      onSuccess: () => setEditMode(false),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={3}
      mt={3}
    >
      <TextInput label="Display Name" control={control} name="displayName" />
      <TextInput
        label="Add your bio"
        control={control}
        name="bio"
        multiline
        rows={4}
      />
      <Button
        type="submit"
        variant="contained"
        color="success"
        disabled={!isDirty}
        loading={editProfile.isPending}
        fullWidth
      >
        Update profile
      </Button>
    </Box>
  );
}

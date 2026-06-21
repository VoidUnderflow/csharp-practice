import { Grid, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import useProfile from "../../lib/hooks/useProfile";
import { useParams } from "react-router";

export default function ProfilePage() {
  const { id } = useParams();
  const { profile, profileIsLoading } = useProfile(id);

  if (profileIsLoading) return <Typography>Loading profile...</Typography>;
  else if (!profile) return <Typography>Profile not found</Typography>;

  return (
    <Grid container>
      <Grid size={12}>
        <ProfileHeader profile={profile} />
        <ProfileContent />
      </Grid>
    </Grid>
  );
}

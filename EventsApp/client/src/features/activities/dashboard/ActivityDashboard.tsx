import { Grid } from "@mui/material";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";

export function ActivityDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid size={8}>
        <ActivityList />
      </Grid>
      <Grid
        size={4}
        sx={{ position: "sticky", top: 112, alignSelf: "flex-start" }}
      >
        <ActivityFilters />
      </Grid>
    </Grid>
  );
}

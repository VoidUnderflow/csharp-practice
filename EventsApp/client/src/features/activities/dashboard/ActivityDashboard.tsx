import { Grid } from "@mui/material";
import type { Activity } from "../../../lib/types";
import { ActivityList } from "./ActivityList";

interface ActivityDashboardProps {
  activities: Activity[];
}

export function ActivityDashboard({ activities }: ActivityDashboardProps) {
  return (
    <Grid container>
      <Grid size={9}>
        <ActivityList activities={activities} />
      </Grid>
    </Grid>
  );
}

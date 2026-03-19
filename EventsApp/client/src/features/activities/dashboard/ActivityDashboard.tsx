import { Grid } from "@mui/material";
import type { Activity } from "../../../lib/types";
import { ActivityList } from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";

interface ActivityDashboardProps {
  activities: Activity[];
  selectedActivity?: Activity;
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
}

export function ActivityDashboard({
  activities,
  selectActivity,
  cancelSelectActivity,
  selectedActivity,
}: ActivityDashboardProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={7}>
        <ActivityList activities={activities} selectActivity={selectActivity} />
      </Grid>
      <Grid size={5}>
        {selectedActivity && (
          <ActivityDetail
            activity={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
          />
        )}{" "}
      </Grid>
    </Grid>
  );
}

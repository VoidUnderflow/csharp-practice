import { Grid } from "@mui/material";
import type { Activity } from "../../../lib/types";
import { ActivityList } from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

interface ActivityDashboardProps {
  activities: Activity[];
  selectedActivity?: Activity;
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  openForm: (id: string) => void;
  closeForm: () => void;
  editMode: boolean;
}

export function ActivityDashboard({
  activities,
  selectActivity,
  cancelSelectActivity,
  selectedActivity,
  openForm,
  closeForm,
  editMode,
}: ActivityDashboardProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={7}>
        <ActivityList activities={activities} selectActivity={selectActivity} />
      </Grid>
      <Grid size={5}>
        {selectedActivity && !editMode && (
          <ActivityDetail
            selectedActivity={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          />
        )}
        {editMode && (
          <ActivityForm closeForm={closeForm} activity={selectedActivity} />
        )}
      </Grid>
    </Grid>
  );
}

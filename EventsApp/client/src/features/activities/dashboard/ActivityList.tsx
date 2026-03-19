import { Box } from "@mui/material";
import type { Activity } from "../../../lib/types";
import ActivityCard from "./ActivityCard";

interface ActivityListProps {
  activities: Activity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

export function ActivityList({
  activities,
  selectActivity,
  deleteActivity,
}: ActivityListProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {activities.map((activity) => (
        <ActivityCard
          activity={activity}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        />
      ))}
    </Box>
  );
}

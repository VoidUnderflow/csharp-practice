import { Box } from "@mui/material";
import type { Activity } from "../../../lib/types";
import ActivityCard from "./ActivityCard";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {activities.map((activity) => (
        <ActivityCard activity={activity} />
      ))}
    </Box>
  );
}

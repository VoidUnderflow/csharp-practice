import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import type { Activity } from "../../../lib/types";
import { useActivities } from "../../../lib/hooks/useActivities";

interface ActivityCardProps {
  activity: Activity;
}

// TODO: Replace {} with routing to a specific activity.

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { deleteActivity } = useActivities();

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5">{activity.title}</Typography>
        <Typography sx={{ color: "text.secondary", mb: 1 }}>
          {activity.date}
        </Typography>
        <Typography variant="body2">{activity.description}</Typography>
        <Typography variant="subtitle1">{activity.city}</Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", pb: 2 }}
      >
        <Chip label={activity.category} variant="outlined" />
        <Box display={"flex"} gap={2}>
          <Button size="medium" variant="contained" onClick={() => {}}>
            View
          </Button>
          <Button
            size="medium"
            variant="contained"
            color="error"
            onClick={() => deleteActivity.mutate(activity.id)}
            loading={deleteActivity.isPending}
          >
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Activity } from "../../../lib/types";

interface ActivityDetailProps {
  activity: Activity;
  cancelSelectActivity: () => void;
}

export default function ActivityDetail({
  activity,
  cancelSelectActivity,
}: ActivityDetailProps) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardMedia
        component="img"
        src={`/images/categoryImages/${activity.category}.jpg`}
      />
      <CardContent>
        <Typography variant="h5">{activity.title}</Typography>{" "}
        <Typography variant="subtitle1" fontWeight="light">
          {activity.date}
        </Typography>
        <Typography variant="body1">{activity.description}</Typography>{" "}
      </CardContent>
      <CardActions>
        <Button color="primary">Edit</Button>
        <Button color="inherit" onClick={() => cancelSelectActivity()}>
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
}

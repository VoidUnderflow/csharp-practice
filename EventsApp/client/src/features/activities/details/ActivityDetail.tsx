import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Activity } from "../../../lib/types";
import { Link, useNavigate } from "react-router";

export default function ActivityDetail() {
  const navigate = useNavigate();

  // TODO: Replace this.
  const activity = {} as Activity;
  if (!activity) return <Typography>Loading...</Typography>;

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
        <Button
          component={Link}
          to={`/activities/${activity.id}`}
          color="primary"
          onClick={() => {}}
        >
          Edit
        </Button>
        <Button color="inherit" onClick={() => navigate("/activities")}>
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
}

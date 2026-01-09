import { useEffect, useState } from "react";
import "./App.css";
import type { Activity } from "./lib/types";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("http://localhost:5200/api/activities")
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  return (
    <>
      <Typography variant="h3" className="app" style={{ color: "red" }}>
        EventsApp
      </Typography>
      <List>
        {activities.map((activity) => (
          <ListItem key={activity.id}>
            <ListItemText>{activity.title}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default App;

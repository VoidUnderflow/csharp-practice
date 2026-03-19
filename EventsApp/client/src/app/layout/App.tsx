import { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import type { Activity } from "../../lib/types";
import NavBar from "./NavBar";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5200/api/activities")
      .then((response) => setActivities(response.data));
  }, []);

  return (
    <>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <List>
          {activities.map((activity) => (
            <ListItem key={activity.id}>
              <ListItemText>{activity.title}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}

export default App;

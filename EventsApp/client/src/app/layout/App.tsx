import { useState } from "react";
import { Box, Container, CssBaseline, Typography } from "@mui/material";
import type { Activity } from "../../lib/types";
import NavBar from "./NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import { useActivities } from "../../lib/hooks/useActivities";

function App() {
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState(false);
  const { activities, isPending } = useActivities();

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities!.find((x) => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleOpenForm(id?: string) {
    if (id) handleSelectActivity(id);
    else handleCancelSelectActivity();

    setEditMode(true);
  }

  function handleCloseForm() {
    setEditMode(false);
  }

  return (
    <Box sx={{ bgcolor: "#eeeeee" }}>
      <CssBaseline />
      <NavBar openForm={handleOpenForm} />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {!activities || isPending ? (
          <Typography>Loading...</Typography>
        ) : (
          <ActivityDashboard
            activities={activities}
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelSelectActivity}
            editMode={editMode}
            openForm={handleOpenForm}
            closeForm={handleCloseForm}
          />
        )}
      </Container>
    </Box>
  );
}

export default App;

import {
  AppBar,
  Box,
  Button,
  Container,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { Group } from "@mui/icons-material";

export default function NavBar() {
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#4527a0" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <MenuItem
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Group fontSize="large" />
                <Typography variant="h4" fontWeight="bold">
                  Activities app
                </Typography>
              </MenuItem>
            </Box>
            <Box sx={{ display: "flex" }}>
              <MenuItem
                sx={{
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Activities
              </MenuItem>
              <MenuItem
                sx={{
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                About
              </MenuItem>
              <MenuItem
                sx={{
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Contact
              </MenuItem>
            </Box>
            <Button size="large" variant="contained" color="warning">
              Create activity
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

import {
  AppBar,
  Box,
  Container,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { Group } from "@mui/icons-material";
import MenuItemLink from "../shared/components/MenuItemLink";

export default function NavBar() {
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#4527a0" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <MenuItemLink to="/">
                <Group fontSize="large" />
                <Typography variant="h4" fontWeight="bold">
                  Activities app
                </Typography>
              </MenuItemLink>
            </Box>
            <Box sx={{ display: "flex" }}>
              <MenuItemLink to="/activities">Activities</MenuItemLink>
              <MenuItemLink to="/createActivity">Create Activity</MenuItemLink>
            </Box>
            <MenuItem>User menu placeholder</MenuItem>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

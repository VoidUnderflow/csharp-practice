import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import { Group } from "@mui/icons-material";
import MenuItemLink from "../shared/components/MenuItemLink";
import { useStore } from "../../lib/hooks/useStore";
import { Observer } from "mobx-react-lite";
import { useAccount } from "../../lib/hooks/useAccount";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const { uiStore } = useStore();
  const { currentUser } = useAccount();

  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: "#4527a0" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <MenuItemLink to="/">
                <Group fontSize="large" />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ position: "relative" }}
                >
                  Activities app
                </Typography>
                <Observer>
                  {() =>
                    uiStore.isLoading ? (
                      <CircularProgress
                        size={20}
                        thickness={7}
                        sx={{
                          color: "white",
                          position: "absolute",
                          top: "30%",
                          left: "105%",
                        }}
                      />
                    ) : null
                  }
                </Observer>
              </MenuItemLink>
            </Box>
            <Box sx={{ display: "flex" }}>
              <MenuItemLink to="/activities">Activities</MenuItemLink>
              <MenuItemLink to="/counter">Counter</MenuItemLink>
              <MenuItemLink to="/errors">Errors</MenuItemLink>
            </Box>
            <Box display="flex" alignItems="center">
              {currentUser ? (
                <UserMenu />
              ) : (
                <>
                  <MenuItemLink to="/login">Login</MenuItemLink>
                  <MenuItemLink to="/register">Register</MenuItemLink>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

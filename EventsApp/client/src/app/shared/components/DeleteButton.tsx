import { Delete, DeleteOutline } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export default function DeleteButton() {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        sx={{
          opacity: 0.8,
          transition: "opacity 0.3s",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <DeleteOutline
          sx={{
            fontSize: 32,
            color: "white",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <Delete
          sx={{
            fontSize: 28,
            color: "red",
            position: "absolute",
            top: 2,
            left: 2,
          }}
        />
      </Button>
    </Box>
  );
}

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useParams } from "react-router";
import { useForm, type FieldValues } from "react-hook-form";

export default function ActivityForm() {
  const { register, reset, handleSubmit } = useForm();
  const { id } = useParams();
  const { updateActivity, createActivity, activity, isLoadingActivity } =
    useActivities(id);

  useEffect(() => {
    if (activity) reset(activity);
  }, [activity, reset]);

  const onSubmit = async (data: FieldValues) => {
    console.log("Placeholder, form submitted.");
  };

  if (isLoadingActivity) return <Typography>Loading activity...</Typography>;

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? "Edit activity" : "Create activity"}
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={3}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          {...register("title")}
          name="title"
          label="Title"
          defaultValue={activity?.title}
        />
        <TextField
          {...register("description")}
          name="description"
          label="Description"
          multiline
          rows={3}
          defaultValue={activity?.description}
        />
        <TextField
          {...register("category")}
          name="category"
          label="Category"
          defaultValue={activity?.category}
        />
        <TextField
          {...register("date")}
          name="date"
          label="Date"
          type="date"
          defaultValue={
            activity?.date
              ? new Date(activity.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
        />
        <TextField
          {...register("city")}
          name="city"
          label="City"
          defaultValue={activity?.city}
        />
        <TextField
          {...register("venue")}
          name="venue"
          label="Venue"
          defaultValue={activity?.venue}
        />
        <Box display={"flex"} justifyContent="end" gap={3}>
          <Button color="inherit" onClick={() => navigate("/activities")}>
            Cancel
          </Button>
          <Button
            color="success"
            variant="contained"
            type="submit"
            loading={updateActivity.isPending || createActivity.isPending}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

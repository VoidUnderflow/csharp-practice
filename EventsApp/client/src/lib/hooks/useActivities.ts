import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "../types";
import { agent } from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";

export function useActivities(id?: string) {
  const queryClient = useQueryClient();
  const { currentUser } = useAccount();
  const location = useLocation();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    enabled: !id && location.pathname === "/activities" && !!currentUser,

    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },

    select: (data) => {
      return data.map((activity) => {
        return {
          ...activity,
          isHost: currentUser?.id === activity.hostId,
          isGoing: activity.attendees.some(
            (activityAttendee) => activityAttendee.id === currentUser?.id,
          ),
        };
      });
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    enabled: !!id && !!currentUser, // this query executes only if id was provided

    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },

    select: (data) => {
      return {
        ...data,
        isHost: currentUser?.id === data.hostId,
        isGoing: data.attendees.some(
          (activityAttendee) => activityAttendee.id === currentUser?.id,
        ),
      };
    },
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put("/activities", activity);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = agent.post("/activities", activity);
      return (await response).data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      await agent.post(`/activities/${id}/attend`);
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["activities", id] });

      // Get a copy of the old activity, to rollback to if needed.
      const prevActivity = queryClient.getQueryData<Activity>([
        "activities",
        id,
      ]);

      // Update attendance (imo, this should be its own function someplace else because
      // this logic repeats itself in multiple places; alas...).
      queryClient.setQueryData<Activity>(["activities", id], (oldActivity) => {
        if (!oldActivity || !currentUser) return oldActivity;

        const isHost = oldActivity.hostId === currentUser.id;
        const isAttending = oldActivity.attendees.some(
          (attendee) => attendee.id === currentUser.id,
        );

        return {
          ...oldActivity,
          isCancelled: isHost
            ? !oldActivity.isCancelled
            : oldActivity.isCancelled,
          attendees: isAttending
            ? isHost
              ? oldActivity.attendees
              : oldActivity.attendees.filter(
                  (attendee) => attendee.id !== currentUser.id,
                )
            : [
                ...oldActivity.attendees,
                {
                  id: currentUser.id,
                  displayName: currentUser.displayName,
                  imageUrl: currentUser.imageUrl,
                },
              ],
        };
      });

      return { prevActivity };
    },

    onError: (error, id, context) => {
      console.log(error);
      if (context?.prevActivity)
        queryClient.setQueryData(["activities", id], context.prevActivity);
    },
  });

  return {
    activities,
    isLoading,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
    updateAttendance,
  };
}

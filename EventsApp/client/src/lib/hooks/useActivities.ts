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
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
    enabled: !id && location.pathname === "/activities" && !!currentUser,
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
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled: !!id && !!currentUser, // this query executes only if id was provided
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities", id],
      });
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

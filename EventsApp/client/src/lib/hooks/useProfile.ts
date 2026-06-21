import { useQuery } from "@tanstack/react-query";
import { agent } from "../api/agent";
import { type Photo, type Profile } from "../types";

export default function useProfile(id?: string) {
  const { data: profile, isLoading: profileIsLoading } = useQuery<Profile>({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
  });

  const { data: photos, isLoading: photosAreLoading } = useQuery<Photo[]>({
    queryKey: ["photos", id],
    queryFn: async () => {
      const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
      return response.data;
    },
  });

  return {
    profile,
    profileIsLoading,
    photos,
    photosAreLoading,
  };
}

import { useQuery } from "@tanstack/react-query";
import { agent } from "../api/agent";
import type { Profile } from "../types";

export default function useProfile(id?: string) {
  const { data: profile, isLoading: profileIsLoading } = useQuery<Profile>({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await agent.get<Profile>("/profiles/${id}");
      return response.data;
    },
  });

  return {
    profile,
    profileIsLoading,
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agent } from "../api/agent";
import type { Activity, Photo, Profile, User } from "../types";
import { useMemo, useState } from "react";
import { type EditProfileSchema } from "../schemas/editProfileSchema";

export default function useProfile(id?: string, predicate?: string) {
  const [filter, setFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileIsLoading } = useQuery<Profile>({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
    enabled: !!id && !predicate,
  });

  const { data: photos, isLoading: photosAreLoading } = useQuery<Photo[]>({
    queryKey: ["photos", id],
    queryFn: async () => {
      const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
      return response.data;
    },
    enabled: !!id && !predicate,
  });

  const { data: followings, isLoading: loadingFollowings } = useQuery<
    Profile[]
  >({
    queryKey: ["followings", id, predicate],
    queryFn: async () => {
      const response = await agent.get<Profile[]>(
        `/profiles/${id}/follow-list?predicate=${predicate}`,
      );

      return response.data;
    },
    enabled: !!id && !!predicate,
  });

  const { data: userActivities, isLoading: isLoadingUserActivities } = useQuery(
    {
      queryKey: ["user-activities", filter],
      queryFn: async () => {
        const response = await agent.get<Activity[]>(
          `/profiles/${id}/activities`,
          {
            params: {
              filter,
            },
          },
        );
        return response.data;
      },
      enabled: !!id && !!filter,
    },
  );

  const uploadPhoto = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await agent.post("/profiles/add-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: async (photo: Photo) => {
      await queryClient.invalidateQueries({
        queryKey: ["photos", id],
      });

      queryClient.setQueryData(["user"], (data: User) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url,
        };
      });

      queryClient.setQueryData(["profile", id], (data: Profile) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url,
        };
      });
    },
  });

  const setMainPhoto = useMutation({
    mutationFn: async (photo: Photo) => {
      await agent.put(`/profiles/${photo.id}/setMain`);
    },
    onSuccess: (_, photo) => {
      queryClient.setQueryData(["user"], (userData: User) => {
        if (!userData) return userData;
        return {
          ...userData,
          imageUrl: photo.url,
        };
      });
      queryClient.setQueryData(["profile", id], (profile: Profile) => {
        if (!profile) return profile;
        return {
          ...profile,
          imageUrl: photo.url,
        };
      });
    },
  });

  const deletePhoto = useMutation({
    mutationFn: async (photoId: string) => {
      await agent.delete(`/profiles/${photoId}/delete`);
    },
    onSuccess: (_, photoId) => {
      queryClient.setQueryData(["photos", id], (photos: Photo[]) => {
        return photos?.filter((photo) => photo.id !== photoId);
      });
    },
  });

  const editProfile = useMutation({
    mutationFn: async (data: EditProfileSchema) => {
      await agent.put("/profiles", data);
    },
    onSuccess: (_, data) => {
      queryClient.setQueryData(["profile", id], (profile: Profile) => {
        if (!profile) return profile;
        return {
          ...profile,
          displayName: data.displayName,
          bio: data.bio,
        };
      });

      queryClient.setQueryData(["user"], (user: User) => {
        if (!user) return user;
        return {
          ...user,
          displayName: data.displayName,
        };
      });
    },
  });

  const updateFollowing = useMutation({
    mutationFn: async () => {
      await agent.post(`/profiles/${id}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followings", id, "followers"],
      });
      queryClient.setQueryData(["profile", id], (profile: Profile) => {
        if (!profile || profile.followersCount === undefined) return profile;
        return {
          ...profile,
          isFollowedByCurrentUser: !profile.isFollowedByCurrentUser,
          followersCount: profile.isFollowedByCurrentUser
            ? profile.followersCount - 1
            : profile.followersCount + 1,
        };
      });
    },
  });

  const isCurrentUser = useMemo(() => {
    return id === queryClient.getQueryData<User>(["user"])?.id;
  }, [id, queryClient]);

  return {
    profile,
    profileIsLoading,
    photos,
    photosAreLoading,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
    editProfile,
    updateFollowing,
    followings,
    loadingFollowings,
    userActivities,
    isLoadingUserActivities,
    filter,
    setFilter,
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import { agent } from "../api/agent";
import type { User } from "../types";
import { useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: async (credentials: LoginSchema) => {
      await agent.post("/login?useCookies=true", credentials);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      await agent.post("/account/logout");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["activities"] });
      navigate("/");
    },
  });

  const registerUser = useMutation({
    mutationFn: async (credentials: RegisterSchema) => {
      await agent.post("/account/register", credentials);
    },
  });

  const verifyEmail = useMutation({
    mutationFn: async ({ userId, code }: { userId: string; code: string }) => {
      await agent.get(`/confirmEmail?userId=${userId}&code=${code}`);
    },
  });

  const resendConfirmationEmail = useMutation({
    mutationFn: async (email: string) => {
      await agent.get(`/account/resendConfirmEmail?email=${email}`);
    },
    onSuccess: () => {
      toast.success("Email sent - please check your email!");
    },
  });

  const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/account/user-info");
      return response.data;
    },
    enabled: !queryClient.getQueryData(["user"]),
  });

  return {
    loginUser,
    currentUser,
    loadingUserInfo,
    logoutUser,
    registerUser,
    verifyEmail,
    resendConfirmationEmail,
  };
};

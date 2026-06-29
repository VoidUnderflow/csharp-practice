using Application.Activities.DTOs;
using Application.Profiles.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        string? currentUserId = null;

        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDto, Activity>();
        CreateMap<EditActivityDto, Activity>();

        CreateMap<Activity, ActivityDto>()
            .ForMember(
                activityDto => activityDto.HostDisplayName,
                memberOptions => memberOptions.MapFrom(
                    activity => activity.Attendees.FirstOrDefault(attendee => attendee.IsHost)!.User.DisplayName
                )
            )
            .ForMember(
                activityDto => activityDto.HostId,
                memberOptions => memberOptions.MapFrom(
                    activity => activity.Attendees.FirstOrDefault(attendee => attendee.IsHost)!.User.Id
                )
            );

        CreateMap<ActivityAttendee, UserProfile>()
            .ForMember(userProfile => userProfile.DisplayName, memberOptions => memberOptions.MapFrom(activityAttendee => activityAttendee.User.DisplayName))
            .ForMember(userProfile => userProfile.Bio, memberOptions => memberOptions.MapFrom(activityAttendee => activityAttendee.User.Bio))
            .ForMember(userProfile => userProfile.ImageUrl, memberOptions => memberOptions.MapFrom(activityAttendee => activityAttendee.User.ImageUrl))
            .ForMember(userProfile => userProfile.Id, memberOptions => memberOptions.MapFrom(activityAttendee => activityAttendee.User.Id))
            .ForMember(userProfile => userProfile.FollowersCount,
                       config => config.MapFrom(activityAttendee => activityAttendee.User.Followers.Count))
            .ForMember(userProfile => userProfile.FollowingCount,
                       config => config.MapFrom(activityAttendee => activityAttendee.User.Followings.Count))
            .ForMember(userProfile => userProfile.IsFollowedByCurrentUser,
                       config => config.MapFrom(activityAttendee =>
                                    activityAttendee.User.Followers.Any(
                                        follower => follower.Observer.Id == currentUserId
            )));

        CreateMap<User, UserProfile>()
            .ForMember(userProfile => userProfile.FollowersCount,
                       config => config.MapFrom(user => user.Followers.Count))
            .ForMember(userProfile => userProfile.FollowingCount,
                       config => config.MapFrom(user => user.Followings.Count))
            .ForMember(userProfile => userProfile.IsFollowedByCurrentUser,
                       config => config.MapFrom(user => user.Followers.Any(follower => follower.Observer.Id == currentUserId)));

        CreateMap<Comment, CommentDto>()
            .ForMember(commentDto => commentDto.DisplayName, memberOptions => memberOptions.MapFrom(comment => comment.User.DisplayName))
            .ForMember(commentDto => commentDto.UserId, memberOptions => memberOptions.MapFrom(comment => comment.User.Id))
            .ForMember(commentDto => commentDto.ImageUrl, memberOptions => memberOptions.MapFrom(comment => comment.User.ImageUrl));
    }
}

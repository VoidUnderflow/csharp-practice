using System;
using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }

    // n-to-n
    public ICollection<ActivityAttendee> Activities { get; set; } = [];

    // 1-to-n
    public ICollection<Photo> Photos { get; set; } = [];

    // 1-to-n
    public ICollection<UserFollowing> Followings { get; set; } = [];

    // 1-to-n
    public ICollection<UserFollowing> Followers { get; set; } = [];
}
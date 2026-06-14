using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
  public required DbSet<Activity> Activities { get; set; }
  public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }
  public required DbSet<Photo> Photos { get; set; }

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    builder.Entity<ActivityAttendee>(activityAttendeeConfig => activityAttendeeConfig.HasKey(activityAttendee => new { activityAttendee.ActivityId, activityAttendee.UserId }));

    builder.Entity<ActivityAttendee>()
      .HasOne(activityAttendee => activityAttendee.User)
      .WithMany(user => user.Activities)
      .HasForeignKey(activityAttendee => activityAttendee.UserId);

    builder.Entity<ActivityAttendee>()
      .HasOne(activityAttendee => activityAttendee.Activity)
      .WithMany(activity => activity.Attendees)
      .HasForeignKey(activityAttendee => activityAttendee.ActivityId);
  }
}
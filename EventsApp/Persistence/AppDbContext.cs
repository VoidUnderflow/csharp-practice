using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.VisualBasic;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
  public required DbSet<Activity> Activities { get; set; }
  public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }
  public required DbSet<Photo> Photos { get; set; }
  public required DbSet<Comment> Comments { get; set; }

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

    var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
      dt => dt.ToUniversalTime(),
      dt => DateTime.SpecifyKind(dt, DateTimeKind.Utc)
    );

    foreach (var entityType in builder.Model.GetEntityTypes())
    {
      foreach (var property in entityType.GetProperties())
      {
        if (property.ClrType == typeof(DateTime))
        {
          property.SetValueConverter(dateTimeConverter);
        }
      }
    }
  }


}
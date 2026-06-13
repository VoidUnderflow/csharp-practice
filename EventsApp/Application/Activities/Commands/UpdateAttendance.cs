using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, AppDbContext context)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Fetch the activity we're trying to update the attendance for.
            var activity = await context.Activities
                .Include(activity => activity.Attendees)
                .ThenInclude(activityAttendee => activityAttendee.User)
                .SingleOrDefaultAsync(activity => activity.Id == request.Id, cancellationToken);

            // No activity found => 404.
            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

            // Get the user who's making the request.
            var user = await userAccessor.GetUserAsync();

            // Is the user already attending the event?
            var attendance = activity.Attendees
                .FirstOrDefault(activityAttendee => activityAttendee.UserId == user.Id);

            // Is the user the host of this activity?
            var isHost = activity.Attendees
                .Any(activityAttendee => activityAttendee.IsHost && activityAttendee.UserId == user.Id);

            if (attendance != null)
            {
                // If the user is the host, cancel or re-open the activity.
                if (isHost) activity.IsCancelled = !activity.IsCancelled;
                // Otherwise, the user is not the host so just remove their attendance.
                else activity.Attendees.Remove(attendance);
            }
            else
            {
                // Event doesn't have any attendees => create activity attendee object.
                activity.Attendees.Add(new ActivityAttendee
                {
                    UserId = user.Id,
                    ActivityId = activity.Id,
                    IsHost = false
                });
            }

            var result = await context.SaveChangesAsync(cancellationToken) > 0;
            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating the DB", 400);
        }
    }
}
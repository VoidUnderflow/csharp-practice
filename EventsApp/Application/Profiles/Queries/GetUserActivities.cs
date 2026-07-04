using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetUserActivities
{
    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
        public required string UserId { get; set; }
        public required string Filter { get; set; }
    }

    public class Handler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = dbContext.ActivityAttendees
                .Where(attendee => attendee.User.Id == request.UserId)
                .OrderBy(attendee => attendee.Activity.Date)
                .Select(attendee => attendee.Activity)
                .AsQueryable();

            var today = DateTime.UtcNow;

            query = request.Filter switch
            {
                "past" => query.Where(activity => activity.Date <= today
                    && activity.Attendees.Any(attendee => attendee.UserId == request.UserId)),
                "hosting" => query.Where(activity => activity.Attendees.Any(attendee => attendee.IsHost
                    && attendee.UserId == request.UserId)),
                _ => query.Where(activity => activity.Date >= today
                    && activity.Attendees.Any(attendee => attendee.UserId == request.UserId))
            };

            var projectedActivities = query.ProjectTo<UserActivityDto>(mapper.ConfigurationProvider);
            var activities = await projectedActivities.ToListAsync(cancellationToken);

            return Result<List<UserActivityDto>>.Success(activities);
        }
    }
}
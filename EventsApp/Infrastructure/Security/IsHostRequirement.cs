using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsHostRequirement : IAuthorizationRequirement
{

}

public class IsHostRequirementHandler(
        AppDbContext dbContext,
        IHttpContextAccessor httpContextAccessor
    ) : AuthorizationHandler<IsHostRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        // Fetch user id.
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return;

        // Validate activity id provided in the request.
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext?.GetRouteValue("id") is not string activityId) return;

        var attendee = await dbContext.ActivityAttendees.SingleOrDefaultAsync(
            activityAttendee => activityAttendee.UserId == userId &&
                                activityAttendee.ActivityId == activityId
        );
        if (attendee == null) return;
        if (attendee.IsHost) context.Succeed(requirement);
    }
}
using System.Security.Claims;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class UserAccessor(IHttpContextAccessor httpContextAccesor, AppDbContext dbContext) : IUserAccessor
{
    public async Task<User> GetUserAsync()
    {
        return await dbContext.Users.FindAsync(GetUserId())
            ?? throw new UnauthorizedAccessException("No user is logged in.");
    }

    public string GetUserId()
    {
        return httpContextAccesor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new Exception("No user found");
    }

    public async Task<User> GetUserWithPhotosAsync()
    {
        var requestUserId = GetUserId();

        return await dbContext.Users
            .Include(user => user.Photos)
            .FirstOrDefaultAsync(user => user.Id == requestUserId)
            ?? throw new UnauthorizedAccessException("No user is logged in");
    }
}
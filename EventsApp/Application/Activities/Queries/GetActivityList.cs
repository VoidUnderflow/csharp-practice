using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;
// Mediator class between the API and the business logic(?)
public class GetActivityList
{
    private const int MaxPageSize = 50;
    // The request.
    public class Query : IRequest<Result<PagedList<ActivityDto, DateTime?>>>
    {
        public DateTime? Cursor { get; set; }
        private int _pageSize = 3;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
    // The response.
    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<PagedList<ActivityDto, DateTime?>>>
    {
        public async Task<Result<PagedList<ActivityDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Activities
                .OrderBy(activity => activity.Date)
                .AsQueryable();

            if (request.Cursor.HasValue)
            {
                query = query.Where(activity => activity.Date >= request.Cursor.Value);
            }

            var activities = await query
                .Take(request.PageSize + 1)
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider,
                    new { currentUserId = userAccessor.GetUserId() })
                .ToListAsync(cancellationToken);

            DateTime? nextCursor = null;
            if (activities.Count > request.PageSize)
            {
                nextCursor = activities.Last().Date;
                activities.RemoveAt(activities.Count - 1);
            }

            return Result<PagedList<ActivityDto, DateTime?>>.Success(
                new PagedList<ActivityDto, DateTime?>
                {
                    Items = activities,
                    NextCursor = nextCursor
                }
            );
        }
    }
}

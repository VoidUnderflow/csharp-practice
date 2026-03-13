using System;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;
// Mediator class between the API and the business logic(?)
public class GetActivityList
{
    // The request.
    public class Query : IRequest<List<Activity>> {}
    // The response.
    public class Handler(AppDbContext context): IRequestHandler<Query, List<Activity>>
    {
        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Activities.ToListAsync(cancellationToken);
        }
    }
}

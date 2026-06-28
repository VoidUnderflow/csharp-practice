using System.Diagnostics;
using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommentHub(IMediator mediator) : Hub
{
    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);
        await Clients.Group(command.ActivityId).SendAsync("ReceiveComment", comment.Value);
    }
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var activityId = httpContext?.Request.Query["activityId"];

        if (string.IsNullOrEmpty(activityId)) throw new HubException("No activity with this id");

        // Add current connection to the group associated with the current activity.
        await Groups.AddToGroupAsync(Context.ConnectionId, activityId!);

        // Fetch all the comments for the current activity.
        var result = await mediator.Send(new GetComments.Query { ActivityId = activityId! });

        // Send comments to the caller, under the "LoadComments" identifier.
        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}
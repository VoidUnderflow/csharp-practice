using Application.Activities.Commands;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ActivitiesController() : BaseApiController
{
  [HttpGet]
  public async Task<ActionResult<List<Activity>>> GetActivities()
  {
    // Decouples the controller from the logic that fetches the activities.
    return await Mediator.Send(new GetActivityList.Query());
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Activity>> GetActivityDetail(string id)
  {
    return await Mediator.Send(new GetActivityDetails.Query { Id = id });
  }

  [HttpPost]
  public async Task<ActionResult<string>> CreateActivity(Activity activity)
  {
    return await Mediator.Send(new CreateActivity.Command { Activity = activity });
  }
}
using API.Middleware;
using API.SignalR;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(opt =>
{
  var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
  opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddDbContext<AppDbContext>(opt =>
{
  opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();

// SignalR for comments.
builder.Services.AddSignalR();

// Since mediator is injected into the ActivitiesController => need to add it as a service here.
builder.Services.AddMediatR(x =>
{
  x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
  x.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// Interface Application uses to access Users
builder.Services.AddScoped<IUserAccessor, UserAccessor>();

// Cloudinary image uploader / URL fetcher.
builder.Services.AddScoped<IPhotoService, PhotoService>();

// Add auto-mapper.
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfiles>());

// Validators used by API endpoints.
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();

// Exception handling middleware.
builder.Services.AddTransient<ExceptionMiddleware>();

// Identity.
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
  opt.User.RequireUniqueEmail = true;

})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

// Authorization (e.g: editing activities).
builder.Services.AddAuthorization(opt =>
{
  opt.AddPolicy("IsActivityHost", policy =>
  {
    policy.Requirements.Add(new IsHostRequirement());
  });
});
builder.Services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

// Load up Cloudinary settings from appsettings.json.
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

// Register middleware.
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(options =>
  options
  .AllowAnyHeader()
  .AllowAnyMethod()
  .AllowCredentials()
  .WithOrigins("http://localhost:5173", "https://localhost:5173"));
app.UseAuthentication();
app.UseAuthorization();

// Make .NET server also serve the client.
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGroup("api").MapIdentityApi<User>();

// Registering route redirection for SignalR.
app.MapHub<CommentHub>("/comments");

// Client redirection.
app.MapFallbackToController("Index", "Fallback");

// Configure the HTTP request pipeline.
app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
  var context = services.GetRequiredService<AppDbContext>();
  var userManager = services.GetRequiredService<UserManager<User>>();
  await context.Database.MigrateAsync();
  await DbInitialiser.SeedData(context, userManager);
}
catch (Exception ex)
{
  var logger = services.GetRequiredService<ILogger<Program>>();
  logger.LogError(ex, "An error occurred during migration.");
}

app.Run();

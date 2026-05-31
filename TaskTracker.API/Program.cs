using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Data;
using TaskTracker.API.Repositories;
using TaskTracker.API.Services;
using TaskTracker.API.Extensions;
using TaskTracker.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Configure database context with SQL Server
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TaskTrackerConnection")));

// Register repositories for dependency injection

builder.Services.AddScoped<ITaskRepository,         TaskRepository>();
builder.Services.AddScoped<IProjectRepository,     ProjectRepository>();
builder.Services.AddScoped<IUserRepository,        UserRepository>();
builder.Services.AddScoped<ICommentRepository,     CommentRepository>();
builder.Services.AddScoped<IProjectUpdateRepository, ProjectUpdateRepository>();

// Register services for dependency injection

builder.Services.AddScoped<ITaskService,         TaskService>();
builder.Services.AddScoped<IProjectService,     ProjectService>();
builder.Services.AddScoped<IUserService,        UserService>();
builder.Services.AddScoped<ICommentService,     CommentService>();
builder.Services.AddScoped<IProjectUpdateService, ProjectUpdateService>();

// Add controllers

builder.Services.AddControllers();

// Configure CORS to allow React dev server (localhost / 127.0.0.1)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy
            .SetIsOriginAllowed(origin =>
            {
                if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                {
                    return false;
                }

                return uri.Scheme is "http" or "https" &&
                       (uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase) ||
                        uri.Host.Equals("127.0.0.1"));
            })
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Use global exception middleware for error handling
app.UseMiddleware<GlobalExceptionMiddleware>();

// Seed database with initial data

app.SeedDatabase();

// Enable CORS
app.UseCors("AllowReact");
app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Run the application
app.Run();

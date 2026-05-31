using System.Net;
using System.Text.Json;

namespace TaskTracker.API.Middleware;

// Catches unhandled errors so the API returns JSON
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            var body = JsonSerializer.Serialize(new
            {
                message = "Something went wrong on the server. Please try again later."
            });
            await context.Response.WriteAsync(body);
        }
    }
}

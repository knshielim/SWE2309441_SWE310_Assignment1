using Microsoft.EntityFrameworkCore;

namespace TaskTracker.API.Helpers;

// Helper to turn database errors into simple messages for the API response
public static class DbExceptionHelper
{
    public static string GetFriendlyMessage(DbUpdateException ex)
    {
        var msg = ex.InnerException?.Message ?? ex.Message;

        // Duplicate key (e.g. email already exists)
        if (msg.Contains("UNIQUE", StringComparison.OrdinalIgnoreCase) ||
            msg.Contains("duplicate", StringComparison.OrdinalIgnoreCase))
        {
            if (msg.Contains("Email", StringComparison.OrdinalIgnoreCase))
                return "This email address is already registered.";

            return "A record with the same value already exists.";
        }

        // Foreign key failed (e.g. project or user does not exist)
        if (msg.Contains("FOREIGN KEY", StringComparison.OrdinalIgnoreCase) ||
            msg.Contains("REFERENCE", StringComparison.OrdinalIgnoreCase))
        {
            return "Cannot save the task because the project or assigned user does not exist.";
        }

        return "Could not save your changes. Please check the data and try again.";
    }
}

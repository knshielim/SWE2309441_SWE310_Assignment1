using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Data;

namespace TaskTracker.API.Extensions;

public static class DbInitializer
{
    public static void SeedDatabase(this IApplicationBuilder app)
    {
        using (var scope = app.ApplicationServices.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<TaskDbContext>();
            var logger = services.GetRequiredService<ILogger<TaskDbContext>>();

            context.Database.EnsureCreated(); 

            bool hasData = false;
            try
            {
                hasData = context.Users.Any();
            }
            catch (Exception ex)
            {
                logger.LogError($"Error checking for data: {ex.Message}");
                return;
            }

            if (!hasData)
            {
                var sqlPath = Path.Combine(AppContext.BaseDirectory, "init.sql");
                if (File.Exists(sqlPath))
                {
                    try
                    {
                        var initSql = File.ReadAllText(sqlPath);
                        logger.LogInformation("Database tables are empty. Injecting seed data records...");
                        
                        context.Database.ExecuteSqlRaw(initSql); 
                        logger.LogInformation("Database successfully seeded with records!");
                    }
                    catch (Exception ex)
                    {
                        logger.LogError($"Failed to execute seed data: {ex.Message}");
                    }
                }
                else
                {
                    logger.LogWarning($"Could not find init.sql at: {sqlPath}");
                }
            }
            else
            {
                logger.LogInformation("Database already contains data. Skipping seeding step.");
            }
        }
    }
}
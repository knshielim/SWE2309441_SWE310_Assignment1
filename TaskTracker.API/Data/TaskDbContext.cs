using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Data;

public class TaskDbContext : DbContext {
    public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options) { }

    // Database tables
    public DbSet<User> Users { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<ProjectUpdate> ProjectUpdates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        // Task entity relationships
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.AssignedUser)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.AssignedTo)
            .OnDelete(DeleteBehavior.SetNull);

        // Comment entity relationships
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Task)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        // ProjectUpdate entity relationships
        modelBuilder.Entity<ProjectUpdate>()
            .HasOne(u => u.Project)
            .WithMany(p => p.Updates)
            .HasForeignKey(u => u.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectUpdate>()
            .HasOne(u => u.User)
            .WithMany(u => u.ProjectUpdates)
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        // Project entity relationships
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Owner)
            .WithMany()
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

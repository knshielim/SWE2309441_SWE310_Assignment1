using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Data;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories;

public class CommentRepository(TaskDbContext dbContext) : ICommentRepository
{
    private readonly TaskDbContext _dbContext = dbContext;

    // Retrieve all comments that may be filtered by taskId, with user data
    public async Task<IEnumerable<Comment>> GetAllAsync(int? taskId = null)
    {
        var query = _dbContext.Comments
            .Include(c => c.User)
            .AsQueryable();

        if (taskId.HasValue)
            query = query.Where(c => c.TaskId == taskId.Value);

        return await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
    }

    // Retrieve a comment by ID from the database with user data
    public async Task<Comment?> GetByIdAsync(int id)
    {
        return await _dbContext.Comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.CommentId == id);
    }

    // Create a new comment in the database
    public async Task<Comment> CreateAsync(Comment comment)
    {
        await _dbContext.Comments.AddAsync(comment);
        await _dbContext.SaveChangesAsync();
        return comment;
    }

    // Update an existing comment in the database
    public async Task<Comment?> UpdateAsync(int id, Comment comment)
    {
        var existing = await _dbContext.Comments.FirstOrDefaultAsync(c => c.CommentId == id);
        if (existing is null) return null;

        existing.Content = comment.Content;
        await _dbContext.SaveChangesAsync();
        return existing;
    }

    // Delete a comment from the database
    public async Task<bool> DeleteAsync(int id)
    {
        var comment = await _dbContext.Comments.FirstOrDefaultAsync(c => c.CommentId == id);
        if (comment is null) return false;

        _dbContext.Comments.Remove(comment);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}

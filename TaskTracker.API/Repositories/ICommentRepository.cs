using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories;

public interface ICommentRepository
{
    Task<IEnumerable<Comment>> GetAllAsync(int? taskId = null);
    Task<Comment?> GetByIdAsync(int id);
    Task<Comment> CreateAsync(Comment comment);
    Task<Comment?> UpdateAsync(int id, Comment comment);
    Task<bool> DeleteAsync(int id);
}

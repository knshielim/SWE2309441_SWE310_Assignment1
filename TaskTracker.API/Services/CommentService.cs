using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;
using TaskTracker.API.Repositories;

namespace TaskTracker.API.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepo;
    private readonly ITaskRepository _taskRepo;
    private readonly IUserRepository _userRepo;

    public CommentService(
        ICommentRepository commentRepo,
        ITaskRepository taskRepo,
        IUserRepository userRepo)
    {
        _commentRepo = commentRepo;
        _taskRepo = taskRepo;
        _userRepo = userRepo;
    }

    // Retrieve all comments that may be filtered by taskId
    public Task<IEnumerable<Comment>> GetAllCommentsAsync(int? taskId = null) =>
        _commentRepo.GetAllAsync(taskId);

    // Retrieve a comment by ID from the repository
    public Task<Comment?> GetCommentByIdAsync(int id) => _commentRepo.GetByIdAsync(id);

    // Validate that task and user exist before creating comment
    public async Task<string?> ValidateCommentAsync(int taskId, int userId)
    {
        if (await _taskRepo.GetByIdAsync(taskId) is null)
            return $"Task with id {taskId} does not exist.";

        if (await _userRepo.GetByIdAsync(userId) is null)
            return $"User with id {userId} does not exist.";

        return null;
    }

    // Create a new comment in the repository
    public Task<Comment> CreateCommentAsync(CommentCreateDto dto)
    {
        var comment = new Comment
        {
            TaskId = dto.TaskId,
            UserId = dto.UserId,
            Content = dto.Content
        };
        return _commentRepo.CreateAsync(comment);
    }

    // Update an existing comment in the repository
    public Task<Comment?> UpdateCommentAsync(int id, CommentUpdateDto dto)
    {
        var comment = new Comment { Content = dto.Content };
        return _commentRepo.UpdateAsync(id, comment);
    }

    // Delete a comment from the repository
    public Task<bool> DeleteCommentAsync(int id) => _commentRepo.DeleteAsync(id);
}

using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Data;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories
{
    public class UserRepository(TaskDbContext dbContext) : IUserRepository
    {
        private readonly TaskDbContext _dbContext = dbContext;

        // Retrieve all users from the database
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }

        // Retrieve a user by ID from the database
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == id);
        }

        // Retrieve a user by email from the database
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        // Create a new user in the database
        public async Task<User> CreateAsync(User user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        // Update an existing user in the database
        public async Task<User?> UpdateAsync(int id, User user)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (existingUser == null) return null;

            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.Role = user.Role;

            await _dbContext.SaveChangesAsync();
            return existingUser;
        }

        // Delete a user from the database
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return false;

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
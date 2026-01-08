using Field_Ops.Application.DTO;


namespace Field_Ops.Application.Contracts.Repository
{
    public interface IServiceTasksRepository
    {
        Task<int> CreateAsync(ServiceTaskCreateDto dto);
        Task<IEnumerable<dynamic>> GetAllAsync();
        Task<dynamic?> GetByIdAsync(int id);
        Task<int> UpdateStatusAsync(ServiceTaskUpdateStatusDto dto);
        Task<int> DeleteAsync(int id, int actionUserId);
        Task<IEnumerable<dynamic>> GetTasksByCustomerAsync(int actionUserId);
        Task<IEnumerable<dynamic>> GetTasksByStatusAsync(string status);
        Task<IEnumerable<dynamic>> GetTasksByTechnicianAsync(int employeeId);
        Task<int> UpdateAsync(ServiceTaskUpdateDto dto);
        Task<IEnumerable<dynamic>> GetTasksBySubscriptionIdAsync(int subscriptionId);
        Task<IEnumerable<dynamic>> GetAwaitingApprovalTasksAsync(int actionUserId);
    }

}

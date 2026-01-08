using Field_Ops.Application.DTO;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IComplaintsRepository
    {
        Task<int> CreateAsync(ComplaintCreateDto dto);
        Task<IEnumerable<dynamic>> GetAllAsync();
        Task<dynamic?> GetByIdAsync(int id);
        Task<int> UpdateAsync(ComplaintUpdateDto dto);
        Task<int> DeleteAsync(int id, int actionUserId);
        Task<int> UpdateStatusAsync(ComplaintStatusUpdateDto dto);
        Task<IEnumerable<dynamic>> GetComplaintsAssignedToTechnicianAsync(int employeeId);
    }
}

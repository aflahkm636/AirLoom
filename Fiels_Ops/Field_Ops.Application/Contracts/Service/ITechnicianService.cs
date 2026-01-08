using Field_Ops.Application.common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface ITechniciansService
    {
        Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync();
        Task<ApiResponse<IEnumerable<dynamic>>> GetActiveAsync();
        Task<ApiResponse<dynamic?>> GetByIdAsync(int id);
    }
}

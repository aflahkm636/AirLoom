using System.Collections.Generic;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface ITechniciansRepository
    {
        Task<IEnumerable<dynamic>> GetAllAsync();
        Task<IEnumerable<dynamic>> GetActiveAsync();
        Task<dynamic?> GetByIdAsync(int id);
    }
}

using Field_Ops.Application.DTO.MaterialUsageDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IMaterialUsageRepository
    {
        Task<int> CreateAsync(MaterialUsageCreateDto dto, int actionUserId);
        Task<bool> DeleteAsync(int id, int actionUserId);
        Task<dynamic?> GetByIdAsync(int id);
        Task<IEnumerable<dynamic>> GetByTaskAsync(int taskId);
    }




}

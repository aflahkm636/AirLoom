using Field_Ops.Application.DTO.SubscriptionPlanDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface ISubscriptionPlanRepository
    {
        Task<int> CreateAsync(SubscriptionPlanCreateDto dto);
        Task<IEnumerable<dynamic>> GetAllAsync();
        Task<dynamic> GetByIdAsync(int id);
        Task<bool> UpdateAsync(SubscriptionPlanUpdateDto dto);
        Task<bool> DeleteAsync(int id, int deletedBy);
    }

}

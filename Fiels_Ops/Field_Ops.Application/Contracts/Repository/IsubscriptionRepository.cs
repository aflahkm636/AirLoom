using Field_Ops.Application.DTO.SubscriptionDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface ISubscriptionRepository
    {
        Task<int> CreateAsync(SubscriptionCreateDto dto);
        Task<IEnumerable<dynamic>> GetAllAsync();
        Task<dynamic?> GetByIdAsync(int id);
        Task<IEnumerable<dynamic>> GetByCustomerIdAsync(int customerId);
        Task<int> UpdateAsync(SubscriptionUpdateDto dto);
        Task<int> DeleteAsync(int id, int deletedBy);
        Task<int> CancelAsync(int id, int modifiedBy, DateTime cancelledOn);
        Task<int> PauseAsync(int id, int modifiedBy);
        Task<int> ResumeAsync(int id, int modifiedBy);
        //Task<int> AutoCancelPaymentAsync(int id, int modifiedBy);
    }

}

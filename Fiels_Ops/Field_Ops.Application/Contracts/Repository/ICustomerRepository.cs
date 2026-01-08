using Field_Ops.Application.DTO.CustomerDto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface ICustomerRepository
    {
        Task<bool> AddCustomerAsync(CustomerRegisterDto dto);
        Task<IEnumerable<CustomerDto>> GetAllAsync();
        Task<CustomerDto?> GetByIdAsync(int id);
        Task<CustomerDto?> GetByUserIdAsync(int userId);
        Task<int> GetCustomerIdByUserId(int userId);
    }

}

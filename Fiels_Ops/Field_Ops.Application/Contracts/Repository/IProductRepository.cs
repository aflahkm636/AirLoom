using Field_Ops.Application.DTO.InventoryDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IProductsRepository
    {
        Task<int> CreateAsync(ProductCreateDto dto);
        Task<int> UpdateAsync(ProductUpdateDto dto);
        Task<int> DeleteAsync(int id, int actionUserId);

        Task<(IEnumerable<dynamic> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize);
        Task<dynamic> GetByIdAsync(int id);
        Task<IEnumerable<dynamic>> FilterAsync(ProductFilterDto dto);

        Task<int> IncreaseQuantityAsync(int id, int qty, int actionUserId);
        Task<int> DecreaseQuantityAsync(int id, int qty, int actionUserId);

        Task<dynamic> GetLowStockAsync();
        Task<decimal> GetTotalInventoryValueAsync();
    }

}

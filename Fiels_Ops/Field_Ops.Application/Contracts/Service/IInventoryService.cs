using Field_Ops.Application.common;
using Field_Ops.Application.DTO.InventoryDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IInventoryService
    {
        Task<ApiResponse<int>> CreateAsync(ProductCreateDto dto);
        Task<ApiResponse<bool>> UpdateAsync(ProductUpdateDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id, int actionUserId);
        Task<ApiResponse<dynamic>> FilterAsync(ProductFilterDto dto);
        Task<ApiResponse<dynamic>> GetAllAsync(int page, int pageSize);

        Task<ApiResponse<dynamic>> GetByIdAsync(int id);
        Task<ApiResponse<bool>> IncreaseQuantityAsync(int id, int qty, int userId);
        Task<ApiResponse<bool>> DecreaseQuantityAsync(int id, int qty, int userId);
        Task<ApiResponse<dynamic>> LowStockAsync();
        Task<ApiResponse<decimal>> GetInventoryValueAsync();
    }
}

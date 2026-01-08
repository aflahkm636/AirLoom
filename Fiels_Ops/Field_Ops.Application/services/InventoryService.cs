using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.InventoryDto;

public class InventoryService : IInventoryService
{
    private readonly IProductsRepository _repo;
    private readonly ICloudinaryService _cloudinaryService;

    public InventoryService(IProductsRepository repo, ICloudinaryService cloudinaryService)
    {
        _repo = repo;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<ApiResponse<int>> CreateAsync(ProductCreateDto dto)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));
        if (string.IsNullOrWhiteSpace(dto.Name)) throw new ArgumentException("Name is required.");
        if (dto.Price <= 0) throw new ArgumentException("Price must be positive.");
        if (dto.QuantityInStock < 0) throw new ArgumentException("Invalid Quantity.");
        if (dto.ReorderLevel < 0) throw new ArgumentException("Invalid ReorderLevel.");
        if (dto.ActionUserId <= 0) throw new ArgumentException("Invalid ActionUserId.");


        if (dto.ProductImageFile != null)
        {
            using var stream = dto.ProductImageFile.OpenReadStream();

            var cloudResult = await _cloudinaryService.UploadImageAsync(
                stream,
                dto.ProductImageFile.FileName,
                "Field_Ops/products"
            );

            dto.ProductImage = cloudResult.Url;
        }
        else
        {
            dto.ProductImage = null;
        }

            int id = await _repo.CreateAsync(dto);

        return ApiResponse<int>.SuccessResponse(200, "Product created successfully.", id);
    }

    public async Task<ApiResponse<bool>> UpdateAsync(ProductUpdateDto dto)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));
        if (dto.Id <= 0) throw new ArgumentException("Invalid Id.");
        if (dto.ActionUserId <= 0) throw new ArgumentException("Invalid ActionUserId.");

        var existing = await _repo.GetByIdAsync(dto.Id);
        if (existing == null)
            throw new ArgumentException("Product not found.");

        string? oldImage = existing.ProductImage; 

        if (dto.ProductImageFile != null)
        {
            using var stream = dto.ProductImageFile.OpenReadStream();

            var cloudResult = await _cloudinaryService.UploadImageAsync(
                stream,
                dto.ProductImageFile.FileName,
                "Field_Ops/products"
            );

            dto.ProductImage = cloudResult.Url;

            if (!string.IsNullOrWhiteSpace(oldImage))
            {
                string publicId = ExtractPublicId(oldImage);
                await _cloudinaryService.DeleteImageAsync(publicId);
            }
        }
        else
        {
            dto.ProductImage = oldImage; 
        }

        int result = await _repo.UpdateAsync(dto);

        return ApiResponse<bool>.SuccessResponse(200, "Product updated successfully.", true);
    }



    public async Task<ApiResponse<bool>> DeleteAsync(int id, int actionUserId)
    {
        if (id <= 0) throw new ArgumentException("Invalid Id.");
        if (actionUserId <= 0) throw new ArgumentException("Invalid ActionUserId.");

        int result = await _repo.DeleteAsync(id, actionUserId);
        bool success = result > 0;

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Product deleted successfully." 
          
        );
    }

   
    public async Task<ApiResponse<dynamic>> FilterAsync(ProductFilterDto dto)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        var result = await _repo.FilterAsync(dto);
        return ApiResponse<dynamic>.SuccessResponse(200, "Products fetched successfully.", result);
    }

    public async Task<ApiResponse<dynamic>> GetAllAsync(int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 10;

        var (items, totalCount) = await _repo.GetAllPagedAsync(page, pageSize);

        var result = new
        {
            items,
            pagination = new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            }
        };

        return ApiResponse<dynamic>.SuccessResponse(
            200,
            "Products fetched.",
            result
        );
    }


    public async Task<ApiResponse<dynamic>> GetByIdAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("Invalid Id.");

        var data = await _repo.GetByIdAsync(id);

        return ApiResponse<dynamic>.SuccessResponse(200, "Product fetched.", data);
    }


    public async Task<ApiResponse<bool>> IncreaseQuantityAsync(int id, int qty, int userId)
    {
        if (id <= 0) throw new ArgumentException("Invalid Id.");
        if (qty <= 0) throw new ArgumentException("Quantity must be positive.");
        if (userId <= 0) throw new ArgumentException("Invalid UserId.");

        int result = await _repo.IncreaseQuantityAsync(id, qty, userId);

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Quantity increased."
         
        );
    }


 
    public async Task<ApiResponse<bool>> DecreaseQuantityAsync(int id, int qty, int userId)
    {
        if (id <= 0) throw new ArgumentException("Invalid Id.");
        if (qty <= 0) throw new ArgumentException("Quantity must be positive.");
        if (userId <= 0) throw new ArgumentException("Invalid UserId.");

        int result = await _repo.DecreaseQuantityAsync(id, qty, userId);

        return ApiResponse<bool>.SuccessResponse(
            200,
            "Quantity decreased."
        );
    }


    public async Task<ApiResponse<dynamic>> LowStockAsync()
    {
        var data = await _repo.GetLowStockAsync();

        return ApiResponse<dynamic>.SuccessResponse(200, "Low stock products fetched.", data);
    }

    public async Task<ApiResponse<decimal>> GetInventoryValueAsync()
    {
        decimal value = await _repo.GetTotalInventoryValueAsync();

        return ApiResponse<decimal>.SuccessResponse(200, "Total inventory value calculated.", value);
    }

    private string ExtractPublicId(string url)
    {
        var parts = url.Split('/');
        var fileName = parts[^1];    
        var folder = parts[^2];        

        return $"Field_Ops/{folder}/{fileName.Split('.')[0]}";
    }

}

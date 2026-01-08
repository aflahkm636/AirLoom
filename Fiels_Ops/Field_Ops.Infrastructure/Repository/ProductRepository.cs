using Dapper;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.DTO.InventoryDto;
using System.Data;
using System.Dynamic;

public class ProductsRepository : IProductsRepository
{
    private readonly IDbConnection _db;

    public ProductsRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<int> CreateAsync(ProductCreateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "CREATE");
        p.Add("@Name", dto.Name);
        p.Add("@Type", dto.Type);
        p.Add("@Category", dto.Category);
        p.Add("@Price", dto.Price);
        p.Add("@QuantityInStock", dto.QuantityInStock);
        p.Add("@ReorderLevel", dto.ReorderLevel);
        p.Add("@ProductImage", dto.ProductImage);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.ExecuteScalarAsync<int>("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }

    public async Task<int> UpdateAsync(ProductUpdateDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "UPDATE");
        p.Add("@Id", dto.Id);
        p.Add("@Name", dto.Name);
        p.Add("@Type", dto.Type);
        p.Add("@Category", dto.Category);
        p.Add("@Price", dto.Price);
        p.Add("@ReorderLevel", dto.ReorderLevel);
        p.Add("@ProductImage", dto.ProductImage);
        p.Add("@ActionUserId", dto.ActionUserId);

        return await _db.ExecuteScalarAsync<int>("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }

    public async Task<int> DeleteAsync(int id, int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "DELETE");
        p.Add("@Id", id);
        p.Add("@ActionUserId", actionUserId);

        return await _db.ExecuteScalarAsync<int>("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }

    public async Task<(IEnumerable<dynamic> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETALL");
        p.Add("@Page", page);
        p.Add("@PageSize", pageSize);

        using var multi = await _db.QueryMultipleAsync(
            "SP_PRODUCTS",
            p,
            commandType: CommandType.StoredProcedure
        );

        var items = await multi.ReadAsync();
        var totalCount = await multi.ReadFirstAsync<int>();

        return (items, totalCount);
    }


    public async Task<dynamic> GetByIdAsync(int id)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "GETBYID");
        p.Add("@Id", id);

        return await _db.QueryFirstOrDefaultAsync("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<dynamic>> FilterAsync(ProductFilterDto dto)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "FILTER");
        p.Add("@Name", string.IsNullOrWhiteSpace(dto.Name) ? null : dto.Name);
        p.Add("@Category", string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category);
        p.Add("@Type", string.IsNullOrWhiteSpace(dto.Type) ? null : dto.Type);

        // 🔥 Convert 0 → NULL (because 0 is NOT a valid filter)
        p.Add("@MinPrice", dto.MinPrice == 0 ? null : dto.MinPrice);
        p.Add("@MaxPrice", dto.MaxPrice == 0 ? null : dto.MaxPrice);
        var result = await _db.QueryAsync("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
        return result;
    }

    public async Task<int> IncreaseQuantityAsync(int id, int qty, int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "INCREASE_QUANTITY");
        p.Add("@Id", id);
        p.Add("@Quantity", qty);
        p.Add("@ActionUserId", actionUserId);

        return await _db.ExecuteScalarAsync<int>("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }

    public async Task<int> DecreaseQuantityAsync(int id, int qty, int actionUserId)
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "DECREASE_QUANTITY");
        p.Add("@Id", id);
        p.Add("@Quantity", qty);
        p.Add("@ActionUserId", actionUserId);

        return await _db.ExecuteScalarAsync<int>("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }

    public async Task<dynamic> GetLowStockAsync()
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "LOW_STOCK");

        return await _db.QueryAsync("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }

    public async Task<decimal> GetTotalInventoryValueAsync()
    {
        var p = new DynamicParameters();
        p.Add("@FLAG", "TOTAL_INVENTORY_VALUE");

        return await _db.ExecuteScalarAsync<decimal>("SP_PRODUCTS", p, commandType: CommandType.StoredProcedure);
    }
}

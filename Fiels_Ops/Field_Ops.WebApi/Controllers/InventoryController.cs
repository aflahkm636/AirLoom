using Field_ops.Domain;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.InventoryDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize] 
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;

    public InventoryController(IInventoryService service)
    {
        _service = service;
    }


    [HttpPost("create")]
    [Authorize(Policy = Permissions.INVENTORY_CREATE)]
    public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
    {
        try
        {
            dto.ActionUserId = User.GetUserId();

            var response = await _service.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

   
    [HttpPut("update")]
    [Authorize(Policy = Permissions.INVENTORY_UPDATE)]
    public async Task<IActionResult> Update([FromForm] ProductUpdateDto dto)
    {
        try
        {
            dto.ActionUserId = User.GetUserId();

            var response = await _service.UpdateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Policy = Permissions.INVENTORY_DELETE)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            int userId = User.GetUserId();

            var response = await _service.DeleteAsync(id, userId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("all")]
    [Authorize(Policy = Permissions.INVENTORY_VIEW)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var response = await _service.GetAllAsync(page, pageSize);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }


    [HttpGet("{id}")]
    [Authorize(Policy = Permissions.INVENTORY_VIEW)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var response = await _service.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }


    [HttpPost("filter")]
    [Authorize(Policy = Permissions.INVENTORY_VIEW)]
    public async Task<IActionResult> Filter([FromBody] ProductFilterDto dto)
    {
        try
        {
            var response = await _service.FilterAsync(dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost("increase")]
    [Authorize(Policy = Permissions.INVENTORY_MANAGE_STOCK)]
    public async Task<IActionResult> IncreaseQuantity(int id, int qty)
    {
        try
        {
            int userId = User.GetUserId();

            var response = await _service.IncreaseQuantityAsync(id, qty, userId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }


    [HttpPost("decrease")]
    [Authorize(Policy = Permissions.INVENTORY_MANAGE_STOCK)]
    public async Task<IActionResult> DecreaseQuantity(int id, int qty)
    {
        try
        {
            int userId = User.GetUserId();

            var response = await _service.DecreaseQuantityAsync(id, qty, userId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }


    [HttpGet("low-stock")]
    [Authorize(Policy = Permissions.INVENTORY_VIEW)]
    public async Task<IActionResult> LowStock()
    {
        try
        {
            var response = await _service.LowStockAsync();
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }


    [HttpGet("inventory-value")]
    [Authorize(Policy = Permissions.INVENTORY_VIEW)]
    public async Task<IActionResult> InventoryValue()
    {
        try
        {
            var response = await _service.GetInventoryValueAsync();
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}

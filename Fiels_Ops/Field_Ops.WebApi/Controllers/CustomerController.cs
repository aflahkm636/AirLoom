using Field_ops.Domain;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.CustomerDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomerController(ICustomerService service)
    {
        _service = service;
    }

    [HttpGet("all")]
    [Authorize(Policy = Permissions.CUSTOMER_VIEW)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var response = await _service.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    [Authorize(Policy = Permissions.CUSTOMER_VIEW)]
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

    [HttpGet("by-user/{userId}")]
    [Authorize(Policy = Permissions.CUSTOMER_VIEW)]
    public async Task<IActionResult> GetByUserId(int userId)
    {
        try
        {
            var response = await _service.GetByUserIdAsync(userId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

 
}

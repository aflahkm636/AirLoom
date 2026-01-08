using Field_ops.Domain;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.BIllingDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BillingController : ControllerBase
{
    private readonly IBillingService _service;
    private readonly ICustomerRepository _customerRepo;

    public BillingController(IBillingService service ,ICustomerRepository customerRepository)
    {
        _service = service;
        _customerRepo = customerRepository;
    }


    [HttpGet("pending")]
    [Authorize(Policy = Permissions.BILLING_VIEW)]
    public async Task<IActionResult> GetPending()
    {
        var response = await _service.GetPendingAsync();
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id}")]
    [Authorize(Policy = Permissions.BILLING_VIEW)]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await _service.GetByIdAsync(id);
        return StatusCode(response.StatusCode, response);
    }

    [HttpPut("update-discount")]
    [Authorize(Policy = Permissions.BILLING_UPDATE_DISCOUNT)]
    public async Task<IActionResult> UpdateDiscount([FromBody] BillingDiscountUpdateDto dto)
    {
        dto.ActionUserId = User.GetUserId();

        var response = await _service.UpdateDiscountAsync(dto );

        return StatusCode(response.StatusCode, response);
    }

    [HttpPut("finalize/{id}")]
    [Authorize(Policy = Permissions.BILLING_FINALIZE)]
    public async Task<IActionResult> Finalize(int id)
    {
        var actionUserId = User.GetUserId();

        var response = await _service.FinalizeAsync(id, actionUserId);
        return StatusCode(response.StatusCode, response);
    }

    [HttpPut("regenerate/{id}")]
    [Authorize(Policy = Permissions.BILLING_FINALIZE)]
    public async Task<IActionResult> Regenerate(int id)
    {
        var actionUserId = User.GetUserId();

        var response = await _service.RegenerateAsync(id, actionUserId);
        return StatusCode(response.StatusCode, response);
    }


    [HttpGet("my-bills")]
    [Authorize(Policy = Permissions.BILLING_VIEW_OWN)]
    public async Task<IActionResult> GetMyBills()
    {
        var userId = User.GetUserId();
        int id=await _customerRepo.GetCustomerIdByUserId(userId);

        var response = await _service.GetByCustomerAsync(id);
        return StatusCode(response.StatusCode, response);
    }
}

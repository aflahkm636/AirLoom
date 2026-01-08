using Field_ops.Domain;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.SubscriptionDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SubscriptionsController : ControllerBase
{
    private readonly ISubscriptionService _service;
    private readonly IEmployeesRepository _emprepo;

    public SubscriptionsController(ISubscriptionService service, IEmployeesRepository emprepo)
    {
        _service = service;
        _emprepo = emprepo;
    }

    private async Task<(string role, int departmentId, int userId)> GetUserContext()
    {
        var user = User.GetUser();
        int deptId = await _emprepo.DepartmentIdByUSerID(user.UserId);
        return (user.Role, deptId, user.UserId);
    }

    [HttpPost]
    [Authorize(Policy = Permissions.SUBSCRIPTION_CREATE)]
    public async Task<IActionResult> Create([FromBody] SubscriptionCreateDto dto)

    {
          var (role, deptId, userId) = await GetUserContext();

            dto.CreatedBy = userId;

            var result = await _service.CreateAsync(dto, role, deptId);
            return StatusCode(result.StatusCode, result);
    }


    [HttpGet]
    [Authorize(Policy = Permissions.SUBSCRIPTION_VIEW)]
    public async Task<IActionResult> GetAll()
    {
        
            var (role, deptId, _) = await GetUserContext();

            var result = await _service.GetAllAsync(role, deptId);
            return StatusCode(result.StatusCode, result);

    }

    [HttpGet("{id}")]
    [Authorize(Policy = Permissions.SUBSCRIPTION_VIEW)]
    public async Task<IActionResult> GetById(int id)
    {
            var (role, deptId, _) = await GetUserContext();

            var result = await _service.GetByIdAsync(id, role, deptId);
            return StatusCode(result.StatusCode, result);

    }

    [HttpGet("by-customer/{customerId}")]
    [Authorize(Policy = Permissions.SUBSCRIPTION_VIEW)]
    public async Task<IActionResult> GetByCustomerId(int customerId)
    {
            var (role, deptId, _) = await GetUserContext();


            var result = await _service.GetByCustomerIdAsync(customerId, role, deptId);
            return StatusCode(result.StatusCode, result);

    }

    [HttpPut]
    [Authorize(Policy = Permissions.SUBSCRIPTION_UPDATE)]
    public async Task<IActionResult> Update([FromBody] SubscriptionUpdateDto dto)
    {
            var (role, deptId, userId) = await GetUserContext();
            dto.ModifiedBy = userId;

            var result = await _service.UpdateAsync(dto, role, deptId);
            return StatusCode(result.StatusCode, result);

    }


    [HttpPut("{id}/pause")]
    [Authorize(Policy = Permissions.SUBSCRIPTION_MANAGE)]
    public async Task<IActionResult> Pause(int id)
    {
        var (role, deptId, userId) = await GetUserContext();
        var result = await _service.PauseAsync(id, userId, role, deptId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}/resume")]
    [Authorize(Policy = Permissions.SUBSCRIPTION_MANAGE)]
    public async Task<IActionResult> Resume(int id)
    {
        var (role, deptId, userId) = await GetUserContext();
        var result = await _service.ResumeAsync(id, userId, role, deptId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}/cancel")]
    [Authorize(Policy = Permissions.SUBSCRIPTION_MANAGE)]
    public async Task<IActionResult> Cancel(int id)
    {
        var (role, deptId, userId) = await GetUserContext();
        var result = await _service.CancelAsync(id, userId, role, deptId);
        return StatusCode(result.StatusCode, result);
    }

}
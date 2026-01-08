using Field_ops.Domain;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ServiceTasksController : ControllerBase
{
    private readonly IServiceTasksService _service;
    private readonly IEmployeesRepository _empRepo;

    public ServiceTasksController(IServiceTasksService service, IEmployeesRepository empRepo)
    {
        _service = service;
        _empRepo = empRepo;
    }

    [HttpPost]
    [Authorize(Policy = Permissions.TASK_CREATE)]
    public async Task<IActionResult> Create(ServiceTaskCreateDto dto)
    {
        dto.ActionUserId = User.GetUserId();
        var response = await _service.CreateAsync(dto);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet]
    [Authorize(Policy = Permissions.TASK_VIEW)]
    public async Task<IActionResult> GetAll()
    {
        var response = await _service.GetAllAsync();
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id:int}")]
    [Authorize(Policy = Permissions.TASK_VIEW)]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await _service.GetByIdAsync(id);
        return StatusCode(response.StatusCode, response);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = Permissions.TASK_UPDATE)]
    public async Task<IActionResult> Update(int id, ServiceTaskUpdateDto dto)
    {
        dto.Id = id;
        dto.ActionUserId = User.GetUserId();

        var response = await _service.UpdateAsync(dto);
        return StatusCode(response.StatusCode, response);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Policy = Permissions.TASK_UPDATE_STATUS)]
    public async Task<IActionResult> UpdateStatus(int id, ServiceTaskUpdateStatusDto dto)
    {
        dto.Id = id;
        dto.ActionUserId = User.GetUserId();

        // If employeeId is not provided or is 0, try to resolve it from the current user
        if (dto.EmployeeId == null || dto.EmployeeId <= 0)
        {
            int userId = User.GetUserId();
            int resolvedEmployeeId = await _empRepo.GetEmployeeIdByUSerID(userId);
            if (resolvedEmployeeId > 0)
            {
                dto.EmployeeId = resolvedEmployeeId;
            }
        }

        var response = await _service.UpdateStatusAsync(dto);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("awaiting-approval")]
    [Authorize(Policy = Permissions.TASK_VIEW)]
    public async Task<IActionResult> GetAwaitingApproval()
    {
        var response = await _service.GetAwaitingApprovalAsync(User.GetUserId());
        return StatusCode(response.StatusCode, response);
    }
}

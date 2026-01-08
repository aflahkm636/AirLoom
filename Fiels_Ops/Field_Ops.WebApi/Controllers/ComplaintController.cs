using Field_ops.Domain;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[Route("api/[controller]")]
[ApiController]
public class ComplaintsController : ControllerBase
{
    private readonly IComplaintsService _service;
    private readonly ICustomerRepository _customerRepository;
    private readonly IEmployeesRepository _employeesRepository;

    public ComplaintsController(IComplaintsService service ,ICustomerRepository customerRepository,IEmployeesRepository employeesRepository)
    {
        _service = service;
        _customerRepository = customerRepository;
        _employeesRepository = employeesRepository;
    }

    [Authorize(Policy = Permissions.COMPLAINT_CREATE_OWN)]
    [HttpPost]
    public async Task<IActionResult> Create(ComplaintCreateDto dto)
    {
        try
        {
            int userId = User.GetUserId();
            dto.CustomerId=await _customerRepository.GetCustomerIdByUserId(userId);
            dto.ActionUserId =userId;
            var result = await _service.CreateAsync(dto);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(400, new { success = false, message = ex.Message });
        }
    }

    [Authorize(Policy = Permissions.COMPLAINT_VIEW)]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _service.GetAllAsync();
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(400, new { success = false, message = ex.Message });
        }
    }

    [Authorize(Policy = Permissions.COMPLAINT_VIEW)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(400, new { success = false, message = ex.Message });
        }
    }

    [Authorize(Policy = Permissions.COMPLAINT_UPDATE)]
    [HttpPut]
    public async Task<IActionResult> Update(ComplaintUpdateDto dto)
    {
        try
        {
            dto.ActionUserId = User.GetUserId();
            var result = await _service.UpdateAsync(dto);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(400, new { success = false, message = ex.Message });
        }
    }


    [Authorize(Policy = Permissions.COMPLAINT_UPDATE_STATUS)]
    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus(ComplaintStatusUpdateDto dto)
    {
        try
        {
            dto.ActionUserId = User.GetUserId();
            var result = await _service.UpdateStatusAsync(dto);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(400, new { success = false, message = ex.Message });
        }
    }

    [Authorize(Policy = Permissions.COMPLAINT_DELETE_OWN)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            int actionUserId = User.GetUserId();
            var result = await _service.DeleteAsync(id, actionUserId);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(400, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("assigned-to-technician")]
    [Authorize(Policy = Permissions.COMPLAINT_VIEW_ASSIGNED)]
    public async Task<IActionResult> GetComplaintsAssignedToTechnicianAsync()
    {
        try
        {
            int userId = User.GetUserId();
            int employeeId=await _employeesRepository.GetEmployeeIdByUSerID(userId);
            var result = await _service.GetComplaintsAssignedToTechnicianAsync(employeeId);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(400, new { success = false, message = ex.Message });
        }
    }
}

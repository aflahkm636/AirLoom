using Field_ops.Domain;
using Field_Ops.Application.DTO.DepartmentDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _service;

    public DepartmentsController(IDepartmentService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Policy = Permissions.DEPARTMENT_CREATE)]
    public async Task<IActionResult> Create([FromBody] DepartmentCreateDto dto)
    {
        try
        {
            dto.CreatedBy = User.GetUserId();
            var result = await _service.CreateAsync(dto);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet]
    [Authorize(Policy = Permissions.DEPARTMENT_VIEW)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var result = await _service.GetAllAsync();
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    [Authorize(Policy = Permissions.DEPARTMENT_VIEW)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _service.GetByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPut]
    [Authorize(Policy = Permissions.DEPARTMENT_UPDATE)]
    public async Task<IActionResult> Update([FromBody] DepartmentUpdateDto dto)
    {
        try
        {
            dto.ModifiedBy = User.GetUserId();
            var result = await _service.UpdateAsync(dto);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = Permissions.DEPARTMENT_DELETE)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {

            int deletedBy = User.GetUserId();
            var result = await _service.DeleteAsync(id, deletedBy);
            return StatusCode(result.StatusCode, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}

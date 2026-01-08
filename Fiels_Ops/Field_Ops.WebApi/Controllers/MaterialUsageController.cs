using Field_ops.Domain;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.MaterialUsageDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MaterialUsageController : ControllerBase
{
    private readonly IMaterialUsageService _service;

    public MaterialUsageController(IMaterialUsageService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Policy = Permissions.MATERIAL_USAGE_CREATE)]
    public async Task<IActionResult> Create([FromBody] MaterialUsageCreateDto dto)
    {
       
            int actionUserId = User.GetUserId();

            var response = await _service.CreateAsync(dto, actionUserId);
            return StatusCode(response.StatusCode, response);
        
        
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = Permissions.MATERIAL_USAGE_DELETE)]
    public async Task<IActionResult> Delete(int id)
    {
       
            int actionUserId = User.GetUserId();

            var response = await _service.DeleteAsync(id, actionUserId);
            return StatusCode(response.StatusCode, response);
       
    }

    [HttpGet("{id:int}")]
    [Authorize(Policy = Permissions.MATERIAL_USAGE_VIEW)]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await _service.GetByIdAsync(id);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("task/{taskId:int}")]
    [Authorize(Policy = Permissions.MATERIAL_USAGE_VIEW)]
    public async Task<IActionResult> GetByTask(int taskId)
    {
        var response = await _service.GetByTaskAsync(taskId);
        return StatusCode(response.StatusCode, response);
    }
}

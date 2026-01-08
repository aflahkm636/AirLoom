using Field_ops.Domain;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.SubscriptionPlanDto;
using Field_Ops.Application.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Field_Ops.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubscriptionPlansController : ControllerBase
    {
        private readonly ISubscriptionPlanService _service;

        public SubscriptionPlansController(ISubscriptionPlanService service)
        {
            _service = service;
        }

        [Authorize(Policy = Permissions.SUBSCRIPTION_PLAN_CREATE)]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SubscriptionPlanCreateDto dto)
        {
            dto.CreatedBy = User.GetUserId();
            var response = await _service.CreateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Policy = Permissions.SUBSCRIPTION_PLAN_VIEW)]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _service.GetAllAsync();
            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Policy = Permissions.SUBSCRIPTION_PLAN_VIEW)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _service.GetByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Policy = Permissions.SUBSCRIPTION_PLAN_UPDATE)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SubscriptionPlanUpdateDto dto)
        {
            dto.Id = id; 
            dto.ModifiedBy = User.GetUserId();

            var response = await _service.UpdateAsync(dto);
            return StatusCode(response.StatusCode, response);
        }

        [Authorize(Policy = Permissions.SUBSCRIPTION_PLAN_DELETE)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            int deletedBy = User.GetUserId();
            var response = await _service.DeleteAsync(id, deletedBy);
            return StatusCode(response.StatusCode, response);
        }
    }

}

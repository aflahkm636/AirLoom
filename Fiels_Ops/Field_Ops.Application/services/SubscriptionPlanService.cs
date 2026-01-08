using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.SubscriptionPlanDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.services
{
    public class SubscriptionPlanService : ISubscriptionPlanService
    {
        private readonly ISubscriptionPlanRepository _repo;

        public SubscriptionPlanService(ISubscriptionPlanRepository repo)
        {
            _repo = repo;
        }

        public async Task<ApiResponse<int>> CreateAsync(SubscriptionPlanCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return ApiResponse<int>.FailResponse(400, "Plan name is required.");

            if (dto.BillingCycleInMonths <= 0)
                return ApiResponse<int>.FailResponse(400, "Invalid billing cycle.");

            if (dto.PricePerCycle <= 0)
                return ApiResponse<int>.FailResponse(400, "Price must be greater than zero.");

            if (dto.ServiceFrequencyInDays <= 0)
                return ApiResponse<int>.FailResponse(400, "Invalid service frequency.");

            int newId = await _repo.CreateAsync(dto);

            if (newId <= 0)
                return ApiResponse<int>.FailResponse(400, "Failed to create subscription plan.");

            return ApiResponse<int>.SuccessResponse(
                201,
                "Subscription plan created successfully.",
                newId
            );
        }

        public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return ApiResponse<IEnumerable<dynamic>>
                .SuccessResponse(200, "Plans fetched successfully.", list);
        }

        public async Task<ApiResponse<dynamic>> GetByIdAsync(int id)
        {
            var plan = await _repo.GetByIdAsync(id);

            if (plan == null)
                return ApiResponse<dynamic>.FailResponse(404, "Plan not found.");

            return ApiResponse<dynamic>
                .SuccessResponse(200, "Plan fetched successfully.", plan);
        }

        public async Task<ApiResponse<bool>> UpdateAsync(SubscriptionPlanUpdateDto dto)
        {
            if (dto.Id <= 0)
                return ApiResponse<bool>.FailResponse(400, "Invalid plan id.");

            bool updated = await _repo.UpdateAsync(dto);

            if (!updated)
                return ApiResponse<bool>.FailResponse(400, "Failed to update subscription plan.");

            return ApiResponse<bool>.SuccessResponse(
                200,
                "Subscription plan updated successfully.",
                true
            );
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id, int deletedBy)
        {
            if (id <= 0)
                return ApiResponse<bool>.FailResponse(400, "Invalid plan id.");

            bool deleted = await _repo.DeleteAsync(id, deletedBy);

            if (!deleted)
                return ApiResponse<bool>.FailResponse(400, "Failed to delete subscription plan.");

            return ApiResponse<bool>.SuccessResponse(
                200,
                "Subscription plan deleted successfully.",
                true
            );
        }
    }


}

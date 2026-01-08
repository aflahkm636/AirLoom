using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;

namespace Field_Ops.Application.Services
{
    public class TechniciansService : ITechniciansService
    {
        private readonly ITechniciansRepository _repo;

        public TechniciansService(ITechniciansRepository repo)
        {
            _repo = repo;
        }

        public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync()
        {
            var Technicians = await _repo.GetAllAsync();
            return ApiResponse<IEnumerable<dynamic>>
                .SuccessResponse(200, "Technicians fetched successfully", Technicians);
        }

        public async Task<ApiResponse<IEnumerable<dynamic>>> GetActiveAsync()
        {
            var list = await _repo.GetActiveAsync();
            return ApiResponse<IEnumerable<dynamic>>
                .SuccessResponse(200, "Active technicians fetched successfully", list);
        }

        public async Task<ApiResponse<dynamic?>> GetByIdAsync(int id)
        {
            if (id <= 0)
                return ApiResponse<dynamic?>
                    .FailResponse(400, "Invalid Technician ID");

            var tech = await _repo.GetByIdAsync(id);

            return tech != null
                ? ApiResponse<dynamic?>.SuccessResponse(200, "Technician fetched successfully", tech)
                : ApiResponse<dynamic?>.FailResponse(404, "Technician not found");
        }
    }
}

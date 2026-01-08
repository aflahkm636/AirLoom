using Field_ops.Domain.Enums;
using Field_Ops.Application.common;
using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.SubscriptionDto;
using Field_Ops.Application.Exceptions;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _repo;

    public SubscriptionService(ISubscriptionRepository repo)
    {
        _repo = repo;
    }

    private static readonly HashSet<int> FullAccessDepartments = new() { 2, 7 };

    private static readonly HashSet<int> ReadOnlyDepartments = new() { 6 ,5};

    private bool CanManageSubscription(string role, int departmentId)
    {
        if (role == "Admin")
            return true;

        return FullAccessDepartments.Contains(departmentId);
    }

    private bool HasReadAccess(string role, int departmentId)
    {
        if (role == "Admin")
            return true;

        if (FullAccessDepartments.Contains(departmentId))
            return true;

        return ReadOnlyDepartments.Contains(departmentId);
    }


    public async Task<ApiResponse<int>> CreateAsync(SubscriptionCreateDto dto, string role, int departmentId)
    {
        if (!CanManageSubscription(role, departmentId))
            throw new AccessViolationException("You are not allowed to perform this action.");

        int newId = await _repo.CreateAsync(dto);

        if (newId <= 0)
            throw new ValidationException("Failed to create subscription.");

        return ApiResponse<int>.SuccessResponse(200, "Subscription created.");
    }


    public async Task<ApiResponse<IEnumerable<dynamic>>> GetAllAsync(string role, int departmentId)
    {
        if (!HasReadAccess(role, departmentId))
            throw new AccessViolationException("You are not allowed to view subscriptions.");

        var result = await _repo.GetAllAsync();
        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(200, "Subscriptions fetched.", result);
    }


    public async Task<ApiResponse<dynamic>> GetByIdAsync(int id, string role, int departmentId)
    {
        if (!HasReadAccess(role, departmentId))
            throw new AccessViolationException("You are not allowed to view this subscription.");

        var item = await _repo.GetByIdAsync(id);

        if (item == null)
            throw new NotFoundException("Subscription not found.");

        return ApiResponse<dynamic>.SuccessResponse(200, "Subscription fetched.", item);
    }


    public async Task<ApiResponse<IEnumerable<dynamic>>> GetByCustomerIdAsync(int customerId, string role, int departmentId)
    {
        if (!HasReadAccess(role, departmentId))
            throw new AccessViolationException("You are not allowed to view customer subscriptions.");

        var list = await _repo.GetByCustomerIdAsync(customerId);

        if (list == null || !list.Any())
            throw new NotFoundException("No subscriptions found for this customer.");

        return ApiResponse<IEnumerable<dynamic>>.SuccessResponse(200, "Customer subscriptions fetched.", list);
    }


    public async Task<ApiResponse<bool>> UpdateAsync(SubscriptionUpdateDto dto, string role, int departmentId)
    {
        if (!CanManageSubscription(role, departmentId))
            throw new AccessViolationException("You are not allowed to update subscriptions.");

        int rows = await _repo.UpdateAsync(dto);

        if (rows == 0)
            throw new NotFoundException("Subscription not found.");

        return ApiResponse<bool>.SuccessResponse(200, "Subscription updated.");
    }


    //public async Task<ApiResponse<bool>> DeleteAsync(int id, int deletedBy, string role, int departmentId)
    //{
    //    if (!CanManageSubscription(role, departmentId))
    //        throw new AccessViolationException("You are not allowed to delete subscriptions.");

    //    int rows = await _repo.DeleteAsync(id, deletedBy);

    //    if (rows == 0)
    //        throw new NotFoundException("Subscription not found.");

    //    return ApiResponse<bool>.SuccessResponse(200, "Subscription deleted.");
    //}


    public async Task<ApiResponse<bool>> PauseAsync(
     int id, int userId, string role, int departmentId)
    {
        if (!CanManageSubscription(role, departmentId))
            throw new AccessViolationException("Not allowed.");

        int rows = await _repo.PauseAsync(id, userId);

        if (rows == 0)
            throw new NotFoundException("Subscription not found.");

        return ApiResponse<bool>.SuccessResponse(200, "Subscription paused.");
    }
    public async Task<ApiResponse<bool>> ResumeAsync(
        int id, int userId, string role, int departmentId)
    {
        if (!CanManageSubscription(role, departmentId))
            throw new AccessViolationException("Not allowed.");

        int rows = await _repo.ResumeAsync(id, userId);

        if (rows == 0)
            throw new NotFoundException("Subscription not found.");

        return ApiResponse<bool>.SuccessResponse(200, "Subscription resumed.");
    }
    public async Task<ApiResponse<bool>> CancelAsync(
        int id, int userId, string role, int departmentId)
    {
        if (!CanManageSubscription(role, departmentId))
            throw new AccessViolationException("Not allowed.");

        int rows = await _repo.CancelAsync(
            id,
            userId,
            DateTime.UtcNow.Date  
        );

        if (rows == 0)
            throw new NotFoundException("Subscription not found.");

        return ApiResponse<bool>.SuccessResponse(200, "Subscription cancelled.");
    }


}

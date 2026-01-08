using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;

namespace Field_Ops.Application.Services
{
    public class AutomationService : IAutomationService
    {
        private readonly IAutomationRepository _repo;
        private readonly IBillingRepository _billingRepo;

        public AutomationService(
            IAutomationRepository repo,
            IBillingRepository billingRepo)
        {
            _repo = repo;
            _billingRepo = billingRepo;
        }


        public async Task RunAutoServiceDue()
        {
            var list = await _repo.GetSubscriptionsDueForServiceAsync();

            foreach (var item in list)
            {
                await _repo.AutoCreateServiceTaskAsync(
                    subscriptionId: (int)item.Id,
                    notes: "Auto-created service task (Scheduled)"
                );
            }
        }



        public async Task RunMonthlyBilling()
        {
            var billMonth = new DateTime(
                DateTime.UtcNow.Year,
                DateTime.UtcNow.Month,
                1
            );

            var subs = await _repo.GetSubscriptionsForBillingAsync(billMonth);

            foreach (var sub in subs)
            {
                try
                {
                    await _billingRepo.GenerateAsync(
                        subscriptionId: (int)sub.Id,
                        billMonth: billMonth,
                        systemUserId: 1
                    );
                }
                catch
                {
                    // log & continue
                }
            }
        }
    }

}

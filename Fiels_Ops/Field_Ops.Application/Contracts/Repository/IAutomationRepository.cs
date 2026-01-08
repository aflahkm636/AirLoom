using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Repository
{
    public interface IAutomationRepository
    {
        Task<IEnumerable<dynamic>> GetSubscriptionsDueForServiceAsync();
        Task<IEnumerable<dynamic>> GetSubscriptionsForBillingAsync(DateTime billMonth);

        Task<bool> AutoCreateServiceTaskAsync(int subscriptionId, string? notes);
    }


}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface IAutomationService
    {
        Task RunAutoServiceDue();
        Task RunMonthlyBilling();
    }
}

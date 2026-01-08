using Hangfire;
using Field_Ops.Application.Contracts.Service;

namespace Field_Ops.WebApi.Jobs
{
    public static class HangfireJobRegistrar
    {
        public static void RegisterRecurringJobs()
        {
            // 1️⃣ Auto-create service tasks when NextServiceDate is due
            RecurringJob.AddOrUpdate<IAutomationService>(
                "auto-service-due",
                service => service.RunAutoServiceDue(),
                Cron.Hourly
            );

            // 2️⃣ Monthly billing draft generation (OPTION B)
            RecurringJob.AddOrUpdate<IAutomationService>(
                "monthly-billing-generate",
                service => service.RunMonthlyBilling(),
                Cron.Monthly
            );
        }

    }
}

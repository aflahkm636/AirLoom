using Field_Ops.Application.Contracts.Repository;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.Services;
using Field_Ops.Application.Settings;
using Field_Ops.Infrastructure.Repository;
using System.Data;
using Microsoft.Data.SqlClient;
using Field_Ops.Application.Service;
using Field_Ops.Application.services;
using Field_Ops.Infrastructure.Services;

namespace Field_Ops.WebApi.Extensions
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddFieldOpsDependencies(
            this IServiceCollection services, IConfiguration config)
        {
            services.Configure<JwtSettings>(config.GetSection("Jwt"));

            services.AddScoped<IDbConnection>(sp =>
            {
                var connString = config.GetConnectionString("DefaultConnection")
                    ?? throw new InvalidOperationException("Connection string not found");

                var conn = new SqlConnection(connString);
                conn.Open();
                return conn;
            });

            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<IEmployeesRepository, EmployeesRepository>();
            services.AddScoped<ITechniciansRepository, TechniciansRepository>();
            services.AddScoped<ISubscriptionPlanRepository, SubscriptionPlanRepository>();
            services.AddScoped<IDepartmentRepository, DepartmentRepository>();
            services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
            services.AddScoped<IComplaintsRepository, ComplaintsRepository>();
            services.AddScoped<IServiceTasksRepository,ServiceTasksRepository>();
            services.AddScoped<ITaskEmployeesRepository, TaskEmployeesRepository>();
            services.AddScoped<IAutomationRepository, AutomationRepository>();
            services.AddScoped<IProductsRepository, ProductsRepository>();
            services.AddScoped<IMaterialUsageRepository, MaterialUsageRepository>();
            services.AddScoped<IBillingRepository, BillingRepository>();
            

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IUserService, UserService>(); 
            services.AddScoped<IEmployeesService, EmployeesService>();
            services.AddScoped<ITechniciansService, TechniciansService>();
            services.AddScoped<ISubscriptionPlanService, SubscriptionPlanService>();
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<ISubscriptionService, SubscriptionService>();
            services.AddScoped<IComplaintsService, ComplaintsService>();
            services.AddScoped<IServiceTasksService, ServiceTasksService>();
            services.AddScoped<ITaskEmployeesService, TaskEmployeesService>();
            services.AddScoped<IAutomationService, AutomationService>();
            services.AddScoped<IInventoryService, InventoryService>();
            services.AddScoped<IMaterialUsageService, MaterialUsageService>();
            services.AddScoped<IBillingService, BillingService>();
            services.AddScoped<IPdfService, PdfService>();
            services.AddScoped<ICustomerService, CustomerService>();
            return services;
        }
    }
}

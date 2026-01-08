using System.Net;
using System.Text.Json;
using Field_Ops.Application.Exceptions;

namespace Field_Ops.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, _logger);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex, ILogger logger)
        {
            HttpStatusCode statusCode = HttpStatusCode.InternalServerError;
            string message = ex.Message;

           
            switch (ex)
            {
                case ValidationException:
                    statusCode = HttpStatusCode.BadRequest;
                    break;

                case NotFoundException:
                    statusCode = HttpStatusCode.NotFound;
                    break;

                case ConflictException:
                    statusCode = HttpStatusCode.Conflict;
                    break;

                default:
                    logger.LogError(ex, "Unhandled exception occurred");
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                StatusCode = (int)statusCode,
                Message = message
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}

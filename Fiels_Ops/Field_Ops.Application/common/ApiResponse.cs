using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.common
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public string? Message { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public T? Data { get; set; }

        public ApiResponse() { }

        public ApiResponse(int statusCode, string? message = null, T? data = default)
        {
            Data = data;
            Message = message;
            StatusCode = statusCode;
        }
        public static ApiResponse<T> SuccessResponse(
                int statusCode = 200,
                string message = "Success",
                T? data = default)
                => new(statusCode, message, data);
        public static ApiResponse<T> FailResponse(int statusCode , string message)
        {
            return new(statusCode, message, default);
        }
    }
}

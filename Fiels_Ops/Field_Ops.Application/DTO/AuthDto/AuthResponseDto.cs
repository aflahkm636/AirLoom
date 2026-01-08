using System.Text.Json.Serialization;

namespace Field_Ops.Application.DTOs.AuthDto
{
    public class AuthResponseDto
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? AccessToken { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? RefreshToken { get; set; }

        public AuthResponseDto(int statusCode, string message)
        {
            StatusCode = statusCode;
            Message = message;
            
        }
        public AuthResponseDto(int statusCode, string message, string token)
        {
            StatusCode = statusCode;
            Message = message;
            AccessToken = token;
        }
    }
}
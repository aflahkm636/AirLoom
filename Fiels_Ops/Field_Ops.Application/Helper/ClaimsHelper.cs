using Field_Ops.Application.DTO.UserDto;
using System.Security.Claims;


namespace Field_Ops.Application.Helper
{
    public static class ClaimsHelper
    {
  
        public static int GetUserId(this ClaimsPrincipal user)
        {
            // Try custom UserId claim first, then fall back to standard 'sub' claim
            var id = user.FindFirst("UserId")?.Value 
                  ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? user.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(id))
                throw new Exception("UserId claim missing in JWT.");

            return int.Parse(id);
        }



        public static string GetRole(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Role)?.Value
                ?? throw new Exception("Role claim missing in JWT.");
        }


        public static string GetEmail(this ClaimsPrincipal user)
        {
            return user.FindFirst("email")?.Value
                ?? throw new Exception("Email claim missing in JWT.");
        }



        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirst("UserName")?.Value
                ?? throw new Exception("UserName claim missing in JWT.");
        }


    
        public static LoggedInUser GetUser(this ClaimsPrincipal user)
        {
            return new LoggedInUser
            {
                UserId = user.GetUserId(),
                Role = user.GetRole()
            };
        }
    }
}

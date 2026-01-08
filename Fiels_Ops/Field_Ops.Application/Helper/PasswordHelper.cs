

namespace Field_Ops.Application.Helper
{
    public static class PasswordHelper
    {
        public static string GenerateTemporaryPassword()
        {
            var guid = Guid.NewGuid().ToString("N").Substring(0, 8);
            return $"FldopsTemp@{guid}";
        }
    }
}

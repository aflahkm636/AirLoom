using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.CustomerDto
{
   public class CustomerRegisterDto
{
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? Phone { get; set; }
    public string? PasswordHash { get; set; }

    public IFormFile? ProfileImageFile { get; set; }  
    public string? ProfileImage { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Pincode { get; set; }

        [JsonIgnore]
    public int CreatedBy { get; set; }
}

}

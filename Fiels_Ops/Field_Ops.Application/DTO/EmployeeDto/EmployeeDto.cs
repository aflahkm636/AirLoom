using Field_ops.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System.Text.Json.Serialization;


namespace Field_Ops.Application.DTO.EmployeeDto
{
    public class EmployeeCreateDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password{ get; set; }
        public Roles Role { get; set; }
        public IFormFile? ProfileImageFile { get; set; }  
        public string? ProfileImage { get; set; }

        public string? Designation { get; set; }
        public int DepartmentId { get; set; }     
        public DateTime JoiningDate { get; set; }
        public decimal? Salary { get; set; }
        public bool Status { get; set; } = true;

        [JsonIgnore]
        public int CreatedBy { get; set; }
    }


}

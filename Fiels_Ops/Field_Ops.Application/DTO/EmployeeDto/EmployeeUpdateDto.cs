using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.EmployeeDto
{
    public class EmployeeUpdateDto
    {
        public int Id { get; set; }
        public string? Designation { get; set; }
        public int? DepartmentId { get; set; }
        public decimal? Salary { get; set; }
        public bool? Status { get; set; }

        [JsonIgnore]
        public int ModifiedBy { get; set; }
    }
}

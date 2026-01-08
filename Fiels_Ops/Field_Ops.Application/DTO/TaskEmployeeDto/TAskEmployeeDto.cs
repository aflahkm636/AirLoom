using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.TaskEMployeeDto
{
    
        public class TaskEmployeeAssignDto
        {
            public int TaskId { get; set; }
            public int EmployeeId { get; set; }
            public string? Role { get; set; }
        [JsonIgnore]
            public int ActionUserId { get; set; }
        }
    public class TaskEmployeeUpdateDto
    {
        public int Id { get; set; }
        public string Role { get; set; } = default!;

        [JsonIgnore]
        public int ActionUserId { get; set; }
    }



}

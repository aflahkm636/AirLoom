using Field_ops.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO
{
    public class ServiceTaskCreateDto
    {
        public int? SubscriptionId { get; set; }   
        public int? ComplaintId { get; set; }
        public DateTime? TaskDate { get; set; }
        public string? Notes { get; set; }

        [JsonIgnore]
        public int ActionUserId { get; set; }
    }
    public class ServiceTaskUpdateDto
    {
        public int Id { get; set; }
        public DateTime? TaskDate { get; set; }
        public string? Notes { get; set; }

        public bool? RequiresMaterialUsage { get; set; }

        public int ActionUserId { get; set; }
    }
    public class ServiceTaskUpdateStatusDto
    {
        public int Id { get; set; }
        public ServiceTaskStatus Status { get; set; }
        public string? Notes { get; set; }
        [JsonIgnore]
        public int ActionUserId { get; set; }
        public int? EmployeeId { get; set; }   // required for technician, optional for staff
        [JsonIgnore]
        public string? UserRole { get; set; }  // for SP authorization
        [JsonIgnore]
        public int? DeptId { get; set; }       // for SP authorization
    }

}

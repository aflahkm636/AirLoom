using Field_ops.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO
{
    public class ComplaintCreateDto
    {
        [JsonIgnore]
        public int CustomerId { get; set; }
        public string Description { get; set; }
        [JsonIgnore]
        public int ActionUserId { get; set; }
    }

    public class ComplaintUpdateDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        [JsonIgnore]
        public int ActionUserId { get; set; }
    }

    public class ComplaintStatusUpdateDto
    {
        [JsonIgnore]
        public int Id { get; set; }
        public ComplaintStatus NewStatus { get; set; }
        public string? ResolutionNote { get; set; }
        [JsonIgnore]
        public int ActionUserId { get; set; }
    }

    public class MyComplaintDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string? ResolutionNote { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime CreatedOn { get; set; }
    }

}

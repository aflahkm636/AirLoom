using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.SubscriptionDto
{
    public class SubscriptionCreateDto
    {
        public int CustomerId { get; set; }
        public int PlanId { get; set; }
        public int MachineProductId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Status { get; set; }
         [JsonIgnore]
        public int? CreatedBy { get; set; }
    }
    public class SubscriptionUpdateDto
    {
        public int Id { get; set; }
        public int? PlanId { get; set; }
        public int? MachineProductId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Status { get; set; }
        public DateTime? LastServiceDate { get; set; }
        [JsonIgnore]
        public int? ModifiedBy { get; set; }
    }
}

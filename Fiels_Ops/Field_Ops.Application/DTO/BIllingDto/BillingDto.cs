using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.BIllingDto
{
    public class BillingDiscountUpdateDto
    {
        public int BillingId { get; set; }
        public decimal DiscountPercent { get; set; }
        [JsonIgnore]
        public int ActionUserId { get; set; }
    }
    public class BillingDto
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }
        public int SubscriptionId { get; set; }

        public decimal SubscriptionAmount { get; set; }
        public decimal ExtraUsageAmount { get; set; }

        public decimal Amount { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }

        public decimal TaxPercent { get; set; }
        public decimal TaxAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime BillMonth { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }

    public class InvoicePdfDto
    {
        public string InvoiceNumber { get; set; } = string.Empty;

        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        public DateTime BillMonth { get; set; }

        public decimal SubscriptionAmount { get; set; }
        public decimal ExtraUsageAmount { get; set; }

        public decimal Amount { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }

        public decimal TaxPercent { get; set; }
        public decimal TaxAmount { get; set; }

        public decimal TotalAmount { get; set; }
    }

}

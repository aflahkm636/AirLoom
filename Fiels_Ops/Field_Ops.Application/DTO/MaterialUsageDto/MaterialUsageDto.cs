using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.MaterialUsageDto
{
    public class MaterialUsageCreateDto
    {
        public int TaskId { get; set; }
        public int ProductId { get; set; }
        public int QuantityUsed { get; set; }
        public string UsageType { get; set; } = "Extra";
    }
}

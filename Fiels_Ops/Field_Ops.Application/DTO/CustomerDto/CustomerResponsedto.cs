using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.CustomerDto
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Phone { get; set; } = default!;

        public string Address { get; set; } = default!;
        public string City { get; set; } = default!;
        public string Pincode { get; set; } = default!;
        public string? ProfileImage { get; set; }

        public bool Status { get; set; }
    }
    public class CustomerCreatedResultDto
    {
        public int NewUserId { get; set; }
        public int NewCustomerId { get; set; }
    }

}

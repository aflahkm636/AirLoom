using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.DepartmentDto
{
    public class DepartmentCreateDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool? Status { get; set; }
        public int? CreatedBy { get; set; }
    }


    public class DepartmentUpdateDto
    {
        public int Id { get; set; }               
            public string? Name { get; set; }
        public string? Description { get; set; }
        public bool? Status { get; set; }
        public int? ModifiedBy { get; set; }
    }
}

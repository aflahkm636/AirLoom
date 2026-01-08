using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.DTO.InventoryDto
{
    public class ProductCreateDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public int QuantityInStock { get; set; }
        public int ReorderLevel { get; set; }
        public IFormFile? ProductImageFile { get; set; }  
        public string? ProductImage { get; set; }
        public int ActionUserId { get; set; }
    }
    public class ProductUpdateDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Category { get; set; }
        public decimal? Price { get; set; }
        public int? ReorderLevel { get; set; }
        public IFormFile? ProductImageFile { get; set; }  
        public string? ProductImage { get; set; }
        public int ActionUserId { get; set; }
    }

    public class ProductFilterDto
    {
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? Type { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }

}

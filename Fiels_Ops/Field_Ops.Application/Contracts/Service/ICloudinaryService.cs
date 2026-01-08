using Field_Ops.Application.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Contracts.Service
{
    public interface ICloudinaryService
    {
        Task<CloudinaryUploadResult> UploadImageAsync(
            Stream stream,
            string fileName,
            string folder = "Field_Ops/products"
        );

        Task<bool> DeleteImageAsync(string publicId);
    }

}

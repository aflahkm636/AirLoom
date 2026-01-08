using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Field_Ops.Application.Helper
{
    public class CloudinarySettings
    {
        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
    }

    public class CloudinaryUploadResult
{
    public string Url { get; set; }
    public string PublicId { get; set; }
    public string Format { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
}

}

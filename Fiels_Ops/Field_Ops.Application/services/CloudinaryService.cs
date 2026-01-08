using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.Helper;
using Microsoft.Extensions.Options;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB limit

    public CloudinaryService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<CloudinaryUploadResult> UploadImageAsync(Stream stream, string fileName, string folder = "Field_Ops/products")
    {
        if (stream == null || stream.Length == 0)
            throw new ArgumentException("File stream is empty");

        ValidateFile(fileName, stream.Length);

        try
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, stream),
                Folder = folder,
                UseFilename = true,
                UniqueFilename = true,
                Overwrite = false
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult == null || uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                throw new Exception("Cloudinary upload failed");
            Console.WriteLine("CLOUDINARY UPLOAD HIT → " + folder);


            return new CloudinaryUploadResult
            {
                Url = uploadResult.SecureUrl?.ToString(),
                PublicId = uploadResult.PublicId,
                Format = uploadResult.Format,
                Width = uploadResult.Width,
                Height = uploadResult.Height
            };
        }
        catch (Exception ex)
        {
            throw new Exception("Cloudinary image upload error: " + ex.Message);
        }
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
            throw new ArgumentException("Invalid publicId");

        var deletionParams = new DeletionParams(publicId);

        try
        {
            var result = await _cloudinary.DestroyAsync(deletionParams);
            return result.Result == "ok";
        }
        catch
        {
            return false;
        }
    }

    private void ValidateFile(string fileName, long fileSize)
    {
        string ext = Path.GetExtension(fileName).ToLower();

        if (!AllowedExtensions.Contains(ext))
            throw new ArgumentException("Invalid file type. Allowed: jpg, jpeg, png, webp");

        if (fileSize > MaxFileSizeBytes)
            throw new ArgumentException($"File size exceeds {MaxFileSizeBytes / 1024 / 1024} MB limit");
    }
}

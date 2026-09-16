const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, folder = 'apk_grocery') => {
  return new Promise((resolve, reject) => {
    // Validate that real Cloudinary credentials are configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo' ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud'
    ) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.'
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('mock_')) return true;
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
    return false;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};

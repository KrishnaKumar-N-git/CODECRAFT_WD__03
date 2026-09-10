const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, folder = 'apk_grocery') => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary credentials are demo / unconfigured
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud') {
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return resolve({
        url: `https://picsum.photos/seed/${mockId}/600/600`,
        publicId: mockId
      });
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

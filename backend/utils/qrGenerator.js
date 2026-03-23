const QRCode = require("qrcode");

module.exports = async (data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error("QR generation error:", error);
    throw error;
  }
};

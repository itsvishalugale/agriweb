const crypto = require("crypto");

function generateNFT(data) {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

  return {
    nftId: hash,
    txId: hash,
  };
}

module.exports = generateNFT;

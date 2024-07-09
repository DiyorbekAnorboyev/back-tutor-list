const QRCode = require("qrcode");

const generateQR = async (link) => {
  const qrCode = await QRCode.toDataURL(link)
  return qrCode
};

const nameToString = (name) => {
  name = name.replace(/[ ]/g, "_");
  return name;
};

const sumToFormat = (sum) => {
  return Number(sum).toLocaleString("en-US");
};

const nowDate = () => {
  return new Date().toLocaleDateString("uz-US", options);
};

let options = { year: "numeric", month: "numeric", day: "numeric" };

module.exports = { generateQR, nameToString, sumToFormat, nowDate, options };

const ImageKit = require("imagekit");

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
// async function upLoadFile(buffer) {
//   console.log(buffer);
//   const result = await imageKit.upload({
//     file: buffer.toString("base64"),
//     fileName: "image.jpg",
//   });
//   console.log("upload file is working");
//   return result;
// }

async function upLoadFile(base64File) {
  const result = await imageKit.upload({
    file: base64File,
    fileName: "image.jpg",
  });

  return result;
}

module.exports = upLoadFile;

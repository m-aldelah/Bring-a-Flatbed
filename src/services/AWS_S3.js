import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  MAIN_BUCKET_ACCESS_KEY,
  MAIN_BUCKET_SECRET_KEY,
} from "@env";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';

import { Buffer } from "buffer";
const S3 = require("aws-sdk/clients/s3");

const bucketName = AWS_BUCKET_NAME;
const region = AWS_BUCKET_REGION;
const accessKey = MAIN_BUCKET_ACCESS_KEY;
const secretKey = MAIN_BUCKET_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});
async function getFile(fileObject) {
  let uri = fileObject.uri;
  let fileExtension = fileObject.filename.split(".").pop();
  if (Platform.OS === "ios") {
    try {
      await FileSystem.copyAsync({
        from: uri,
        to: FileSystem.cacheDirectory + "/" + fileObject.filename,
      });
      uri = FileSystem.cacheDirectory + "/" + fileObject.filename;
    } catch (e) {
      console.log("error inside file AWS_S.js ", e);
    }
  }
  const options = { encoding: FileSystem.EncodingType.Base64 };
  const File = await FileSystem.readAsStringAsync(uri, options);

  return { File, fileExtension };
}
export async function uploadImages(fileObject) {
  let { File, fileExtension } = await getFile(fileObject);
  const params = {
    Bucket: bucketName,
    Key: uuidv4() + "_" + Date.now() + "." + fileExtension, // File name you want to save as in S3
    Body: Buffer.from(File, "base64"),
    ContentType: `image/${fileExtension}`,
  };
  const link = await s3.upload(params).promise();
  return link.Location;
}

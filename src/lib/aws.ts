import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

export const s3 = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
]);

export const s3Put = async (params: PutObjectCommandInput) => {
  const { Bucket, Key } = params;
  if (!Bucket || !Key) throw new Error("Invalid params");
  await s3.send(new PutObjectCommand(params));

  const region = process.env.AWS_REGION;
  if (!region) throw new Error("Invalid region");
  const file = encodeURIComponent(Key);

  return `https://${Bucket}.s3.${region}.amazonaws.com/${file}`;
};

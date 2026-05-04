const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const region = (process.env.AWS_REGION || '').trim();
const bucket = (process.env.AWS_S3_BUCKET_NAME || '').trim();

const s3 = new S3Client({
  region,
  endpoint: `https://s3.${region}.amazonaws.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: (process.env.AWS_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || '').trim(),
  },
});

function getS3Url(key) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function uploadBuffer(buffer, originalname, mimetype) {
  const ext = path.extname(originalname).toLowerCase();
  const key = `website/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  const params = { Bucket: bucket, Key: key, Body: buffer, ContentType: mimetype };

  try {
    // Try with public-read ACL so each object is publicly accessible immediately
    await s3.send(new PutObjectCommand({ ...params, ACL: 'public-read' }));
  } catch (err) {
    // Bucket has Object Ownership = "Bucket owner enforced" (ACLs disabled) — upload without ACL
    if (err.Code === 'AccessControlListNotSupported' || err.name === 'AccessControlListNotSupported') {
      await s3.send(new PutObjectCommand(params));
    } else {
      throw err;
    }
  }

  return { key, location: getS3Url(key) };
}

async function deleteFromS3(key) {
  await s3.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  }));
}

function keyFromUrl(url) {
  // virtual-hosted: https://bucket.s3.region.amazonaws.com/key
  const vHostMarker = `.amazonaws.com/`;
  const vIdx = url.indexOf(vHostMarker);
  if (vIdx !== -1) return url.slice(vIdx + vHostMarker.length);
  // path-style fallback: https://s3.region.amazonaws.com/bucket/key
  const pathMarker = `/${bucket}/`;
  const pIdx = url.indexOf(pathMarker);
  return pIdx !== -1 ? url.slice(pIdx + pathMarker.length) : null;
}

module.exports = { uploadBuffer, getS3Url, deleteFromS3, keyFromUrl };

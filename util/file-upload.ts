import aws, { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: region
});

/**
 * 
 * @param key distinct filename
 * @param body stream-converted format of the file
 * @returns AWS filepath based on bucket and filename
 */
async function uploadFile(key: string, body: any) {
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: body,
        ACL: 'public-read'
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

/**
 * 
 * @param key the deleted filename - should be distinct
 */
async function deleteFile (key: string) {
    const deleteParams = {
        Bucket: bucketName,
        Key: key
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);
}

const fileHandler = {
    uploadFile,
    deleteFile
}

export default fileHandler;

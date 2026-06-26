import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY, AWS_S3_BUCKET_NAME, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../common/config/config.service";
import { randomUUID } from "node:crypto";
import { Store_Enum } from "../common/enum/multer.enum";
import fs from "node:fs"
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
    
    private readonly client: S3Client
    constructor() {
        this.client = new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            }
        })
    }

    async uploadFile({
        path,
        store_type = Store_Enum.memory,
        file,
    }: {
        path: string,
        file: Express.Multer.File,
        store_type?: Store_Enum
    }) {

        const command = new PutObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            ACL: ObjectCannedACL.private,
            Key: `social_media_App/${path}/${randomUUID()}__${file.originalname}`,
            Body: store_type === Store_Enum.memory ? file.buffer : fs.createReadStream(file.path),
            ContentType: file.mimetype
        })

        await this.client.send(command)

        return command.input.Key
    }

    async uploadLargeFile({
        path,
        store_type = Store_Enum.memory,
        file,
    }: {
        path: string,
        file: Express.Multer.File,
        store_type?: Store_Enum
    }) {

        const command = new Upload({
            client: this.client,
            params: {
                Bucket: AWS_S3_BUCKET_NAME,
                ACL: ObjectCannedACL.private,
                Key: `social_media_App/${path}/${randomUUID()}__${file.originalname}`,
                Body: store_type === Store_Enum.memory ? file.buffer : fs.createReadStream(file.path),
                ContentType: file.mimetype
            }
        })

        // command.on("httpUploadProgress", (progress) => {
        //     console.log("File upload progress is ::: ", progress);
        // });
        return await command.done();
    }

    async uploadFiles({
        path,
        store_type = Store_Enum.memory,
        files,
        isLarge = false
    }: {
        path: string,
        files: Express.Multer.File[],
        store_type?: Store_Enum,
        isLarge?: boolean
    }): Promise<string[]> {
        
        let urls: any = []
        if (isLarge) {
            urls = await Promise.all(files.map((file) => {
                return this.uploadLargeFile({ path, file })
            }))
        } else {
            urls = await Promise.all(files.map((file) => {
                return this.uploadFile({ path, file })
            }))
        }

        return urls as string[]
    }

    async createSignedUrl({
        path,
        store_type = Store_Enum.memory,
        fileName,
        ContentType,
        expiresIn = 60
    }: {
        path: string,
        fileName: string,
        ContentType: string,
        store_type?: Store_Enum,
        expiresIn?: number
    }) {
        const Key = `social_media_App/${path}/${randomUUID()}__${fileName}`
        const command = new PutObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            ACL: ObjectCannedACL.private,
            Key,
            ContentType
        })

        const url = await getSignedUrl(this.client, command, { expiresIn })

        return { url, Key }
    }
}

export const s3Service = new S3Service()

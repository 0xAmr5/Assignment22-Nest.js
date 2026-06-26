import { BadGatewayException } from "@nestjs/common";
import { Request } from "express";
import multer from "multer";
import { tmpdir } from "node:os";
import { multer_enum, Store_Enum } from "../enum/multer.enum";

export const multerCloud = ({
    customTypes = multer_enum.image,
    store_type = Store_Enum.memory,
    fileSize = 5 * 1024 * 1024
}: {
    customTypes?: string[],
    store_type?: Store_Enum,
    fileSize?: number
} = {}) => {
    
    const storage = store_type === Store_Enum.memory ? multer.memoryStorage() : multer.diskStorage({
        destination: function (req: Request, file: Express.Multer.File, cb: Function) {
            cb(null, tmpdir());
        },
        filename: function (req: Request, file: Express.Multer.File, cb: Function) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + "__" + file.originalname);
        }
    })

    function fileFilter(req: Request, file: Express.Multer.File, cb: Function) {
        if (!customTypes.includes(file.mimetype)) {
            cb(new BadGatewayException("inValid file Type!"))
        } else {
            cb(null, true);
        }
    }

    const upload = multer({ storage, fileFilter, limits: { fileSize } })
    return upload
}
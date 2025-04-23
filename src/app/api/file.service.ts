import { randomUUID } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { ENV } from "@env/envirolment"

/**
 *
 * @param bufferData file buffer data
 * @param folderName upload folder name
 * @param fileName  file name with extention
 * @return string | null
 */
export function uploadFile(bufferData: any, folderName: string, fileName: string) {
    let randomName: string | null;
    try {
        const fileExtension = path.extname(fileName);
        const uploadDir = path.join(process.cwd(), `public/uploads/${folderName}/`);

        randomName = randomUUID() + fileExtension;
        // check file dir and create dir
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }
        writeFileSync(uploadDir + randomName, bufferData);

    } catch (error) {
        randomName = null
    }

    return randomName;

}

/**
 * 
 * @param fileName  file name with extention
 * @param folderName folder name
 * @return string | null
 */
export function getFile(fileName: string, folderName: string) {
    let filePath: string | null;
    try {
        if (!fileName) {
            throw "No file"
        }

        const filePaht = `${ENV.FILE_UPLOAD_PATH}/${folderName}/${fileName}`;
        console.log(filePaht);

        filePath = existsSync(path.join(process.cwd(), `public/uploads/${folderName}/${fileName}`)) ? filePaht : null;
    } catch (error) {
        filePath = null
    }
    return filePath;
}
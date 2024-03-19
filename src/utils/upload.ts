import * as CryptoJS from 'crypto-js'
import { uploadFile } from '@/api/file'
import { FileType, getFiletype, type TransportedFile } from '@/api/local/type';
import { addUploadRecord } from '@/api/local';
import { getCurDateString } from './date';


const MB = 1024 * 1024
const KB = 1024

const CHUNK_SIZE = 1 * MB; // 1mb

let calcMd5 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        let offset = 0;
        const spark = CryptoJS.algo.MD5.create();

        fileReader.onload = (event) => {
            const chunk = event.target?.result as ArrayBuffer;
            const wordArray = CryptoJS.lib.WordArray.create(chunk);
            spark.update(wordArray);

            offset += CHUNK_SIZE;
            if (offset < file.size) {
                readSlice(offset);
            } else {
                const md5 = spark.finalize().toString();
                resolve(md5);
            }
        }

        fileReader.onerror = (error) => {
            reject(error);
        }

        const readSlice = (start: number) => {
            const slice = file.slice(start, start + CHUNK_SIZE);
            fileReader.readAsArrayBuffer(slice);
        }

        readSlice(0);
    });
}

let sliceFile = (file: File, chunkSize: number) => {
    const totalChunk = Math.ceil(file.size / chunkSize);
    let chunks: Blob[] = []
    for (let i = 0; i < totalChunk; ++i) {
        const start = i * chunkSize
        // const end = Math.min(start + chunkSize, file.size)

        const slicedBlob = file.slice(start, start + chunkSize);
        //这里重新设置其mime信息，以方便后端识别
        let chunk = new File([slicedBlob], file.name, { type: file.type });
        // let chunk = slicedBlob

        chunks.push(chunk)
    }
    return chunks
}

export const batchUploadByChunk = async (files: FileList, fileParent: string, token: string) => {
    for (let i = 0; i < files.length; i++) {
        let md5 = await calcMd5(files[i])

        let chunks = sliceFile(files[i], 1 * MB)
        let fileId = ''

        for (let j = 0; j < chunks.length; ++j) {
            const formData = new FormData()
            formData.append('fileId', fileId)
            formData.append('fileParentId', fileParent)
            formData.append('md5', md5)
            formData.append('token', token)
            formData.append('chunkIndex', String(j))
            formData.append('chunkNum', String(chunks.length))
            //模拟文件名上传
            formData.append('file', chunks[j], files[i].name)

            //send
            let resDto = await uploadFile(formData)
            fileId = resDto?.fileId

            if (resDto.fileId == undefined) {
                ElMessage({
                    type: 'error',
                    message: '文件上传失败'
                })
                return
            }
            //上传完成
            if(resDto.status == 1){
                break
            }
        }
        ElMessage({
            type: 'success',
            message: '文件上传成功'
        })

        //将上传记录保存到LocalStorage
        let originalName = files[i].name
        let type = getFiletype(originalName)
        let record:TransportedFile = {name:originalName, type:type, createTime:getCurDateString(), size:files[i].size, folderType:0}
        addUploadRecord(record)
    }
}
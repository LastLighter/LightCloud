import type{ TransportedFile } from "./type";
const uploadRecord = 'upload-record'
const downloadRecord = 'download-record'

export function addUploadRecord(record:TransportedFile):void{
    try{
        let arr:TransportedFile[] = JSON.parse(localStorage.getItem(uploadRecord)||'[]') as TransportedFile[]
        arr.push(record)
        localStorage.setItem(uploadRecord, JSON.stringify(arr))
    }catch(error){
        ElMessage({
            type: 'error',
            message: '文件上传记录保存失败'
        })
    }
}

export function getUploadRecord():TransportedFile[]{
    return JSON.parse(localStorage.getItem(uploadRecord)||'[]') as TransportedFile[]
}

export function setUploadRecord(records:TransportedFile[]){
    let json = JSON.stringify(records)
    localStorage.setItem(uploadRecord,json)
}

export function addDownloadRecord(record:TransportedFile):void{
    try{
        console.log(record);
        
        let arr:TransportedFile[] = JSON.parse(localStorage.getItem(downloadRecord)||'[]') as TransportedFile[]
        console.log(arr);
        
        arr.push(record)
        localStorage.setItem(downloadRecord, JSON.stringify(arr))
    }catch(error){
        ElMessage({
            type: 'error',
            message: '文件下载记录保存失败'
        })
    }
}

export function setUDownloadRecord(records:TransportedFile[]){
    let json = JSON.stringify(records)
    localStorage.setItem(downloadRecord,json)
}

export function getDownloadRecord():TransportedFile[]{
    return JSON.parse(localStorage.getItem(downloadRecord)||'[]') as TransportedFile[]
}
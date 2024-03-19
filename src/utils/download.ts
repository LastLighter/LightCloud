import { download } from '@/api/file/index'
import { addDownloadRecord } from '@/api/local'
import { getFiletype, type TransportedFile } from '@/api/local/type'
import { useCommonStore } from '@/stores/common'
import { getCurDateString } from './date'


export const sliceDownloadFile = async (fid: string, uid: bigint) => {
    let chunkSize: bigint = 2n * 1024n * 1024n
    let start: bigint = 0n
    let fileSize: bigint = chunkSize
    let fileName = ''
    let arrs: ArrayBuffer[] = []
    while (start < fileSize) {
        let res = await download(fid, uid, start, start + chunkSize)
        fileSize = res.headers['content-range'].split('/')[1];
        let disposition: string = res.headers['content-disposition']
        fileName = decodeURIComponent(getFileName(disposition))
        start += chunkSize
        arrs.push(res.data)
    }
    
    
    let file = new Blob(arrs, { type: 'application/octet-stream' })
    // 创建一个 URL，用于生成下载链接
    const url = URL.createObjectURL(file);

    // 创建一个 <a> 元素
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // 将 <a> 元素添加到 DOM 中
    document.body.appendChild(link);

    // 模拟用户点击下载链接
    link.click();

    // 清理创建的 URL
    URL.revokeObjectURL(url);

    //添加下载记录
    let type = getFiletype(fileName)
    let record:TransportedFile = {name:fileName, type:type, createTime:getCurDateString(), size:Number(fileSize), folderType:0}
    addDownloadRecord(record)
}

let getFileName = (disposition: string) => {
    const regex = /filename="([^"]+)"/;
    const match = disposition.match(regex);
    let filename = ''

    if (match && match[1]) {
        filename = match[1];
    } 
    return filename
}
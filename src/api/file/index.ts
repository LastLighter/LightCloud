import request from "@/utils/request"
import { type RenameDto, type FileQueryDto, type FileUploadDto, type GetFileDto, type NewFolderDto, type MoveDto, type CommonDto, type CategoryDto } from './type';
import type { FileEntity } from "../component/type";
import axios, { type AxiosResponse } from "axios";

enum API {
    LIST = '/file/list',
    LIST_DIR = '/file/listDir',
    LIST_CATEGORY = '/file/listByCategory',
    GET_SIZE = '/file/getSize',
    UPLOAD = '/file/upload',
    GET_FILE = '/file',
    NEW_FOLDER = '/file/newFolder',
    RENAME = '/file/rename',
    MOVE = '/file/move',
    DOWNLOAD = '/file/download/',
    DELETE = '/file/delete/',
    RECYCLE = '/file/recycle/',
    RESTORE = '/file/restore/',
    LIST_RECYCLE = '/file/recycle'
}

export const reqFileList = (dto: FileQueryDto) => {
    return request.get<FileQueryDto, FileEntity[]>(API.LIST, { params: dto })
}

export const reqListDir = (dto: FileQueryDto) => {
    return request.get<FileQueryDto, FileEntity[]>(API.LIST_DIR, { params: dto })
}

export const reqListCategory = (dto: FileQueryDto) => {
    return request.get<FileQueryDto, FileEntity[]>(API.LIST_CATEGORY, { params: dto })
}

export const reqChildrenSize = (token:string, fileParent: string, category:number) => {
    return request.get<string, number>(API.GET_SIZE, { params: { token:token, fileParent: fileParent, fileCategory: category } })
}

export const uploadFile = (formData: FormData) => {
    return request.post<FormData, FileUploadDto>(API.UPLOAD, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getFile = async (dto: GetFileDto) => {
    let res = await axios.get<GetFileDto, any>(API.GET_FILE, { params: dto })
    return res.data
}
export const getFileURL = (token:string, fid:string, category:string) => '/api' + API.GET_FILE + `/${fid}?token=${token}&category=${category}` 

export const newFodler = (dto: NewFolderDto) => {
    request.post<NewFolderDto, string>(API.NEW_FOLDER, dto)
}

export const rename = (dto: RenameDto) => {
    request.put<RenameDto, string>(API.RENAME, dto)
}

export const move = (dto: MoveDto) => {
    request.put<MoveDto, string>(API.MOVE, dto)
}

export const download = async(fid:string, uid:bigint, start: bigint, end: bigint) => {
    const config = {
        headers: {
            Range: `bytes=${start}-${end}`,
        },
        //不设置的话，默认会被以json格式解析，会导致得到的是string类型
        responseType: 'arraybuffer'
    };
    let res:AxiosResponse<ArrayBuffer> = await axios.get<any,AxiosResponse<ArrayBuffer>>(`/api/file/download/${fid}?uid=${uid}`, config)
    return res
}

export const deleteFile = (dto: CommonDto) => {
    return request.delete<CommonDto, string>(API.DELETE + dto.fid, { params: { token: dto.token } })
}

export const recycle = (token:string, fid:string) => {
    return request.put<string, string>(API.RECYCLE + fid + '?token=' + token)
}

export const restore = (token:string, fid:string) => {
    return request.put<string, string>(API.RESTORE + fid + '?token=' + token)
}

export const listRecycle = (token:string) => {
    return request.get<string, FileEntity[]|string>(API.LIST_RECYCLE, {params:{token:token}})
}
export interface FileQueryDto{
    userId?: number
    fileMd5?: string
    fileParent?: string
    fileCategory?: number
    name?: string
    token?: string
    page?: number
    pageSize?: number
    offset?: number
}

export interface FileUploadDto{
    fileId:string;
    status:number;
}

export interface GetFileDto{
    fid:string,
    category:string,
    token:string
}

export interface NewFolderDto{
    fid:string,
    folderName:string,
    token:string
}

export interface RenameDto{
    fid:string,
    fileName:string,
    token: string
}

export interface CategoryDto{
    category:number,
    userId:number
}

export interface MoveDto{
    fids:string,
    targetFid:string,
    token:string
}

export interface CommonDto{
    token:string,
    fid:string
}
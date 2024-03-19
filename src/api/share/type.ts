export interface ShareQueryDto{
    page:number,
    pageSize:number,
    token:string
}

export interface ShareEntity{
    shareId?:string,
    fid?:string,
    uid?:string,
    validity?:number,
    createTime?:string,
    expiredTime?:string,
    code?:string,
    view?:number
}

export interface AddShareDto {
    fid?:string,
    token:string,
    validity?:number,
}

export interface ShareResDto extends ShareEntity{
    name:string,
    folderType:number,
    fileSize:number,
    fileCategory:number
}

export interface shareInfoDto{
    userName:string,
    createTime:string,
    uid:string
}
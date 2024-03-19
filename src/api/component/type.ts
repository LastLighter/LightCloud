export interface Menu {
    menuIcon: string,  
    menuName: string,
    menuId:string  
}

export interface FileEntity {
    fid: string
    name: string
    filePath: string
    userId: number  
    fileMd5: string
    fileParent: string
    fileSize: string
    fileCover: string
    folderType: number
    fileCategory: number
    status: number
    createTime: string
    lastUpdateTime: string
    recoveryTime: string
}

export interface FilePath{
    name: string,
    fid: string
}

export interface ContextData{
    file:FileEntity,
    x:number,
    y:number
}

export interface Toggle{
    expand: boolean
}
export interface ToggleFileEntity extends Toggle{
    file:FileEntity,
}
export interface PageItem{
    name:string,
    page:number
}

export interface DropDownItem{
    name:string,
    iconPath:string,
    handler:() => void
}
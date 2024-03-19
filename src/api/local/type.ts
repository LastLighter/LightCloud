export enum FileType {
    Video = 1,
    Image = 2,
    Music = 3,
    Document = 4,
    Archive = 5,
    Other = 6
}

export interface TransportedFile{
    name:string,
    type:FileType,
    createTime:string,
    size:number,
    folderType?:number,
    shareId?:string
}

const VideoSuffix = ["mp4","m4v","mkv","avi","mov"];
const MusicSuffix = ["mp3","flac","m4a","wav","aac"];
const ImageSuffix = ["png","jpg","jpeg","webp","gif","svg"];
const DocumentSuffix = ["pdf","doc","docx","xlsx","xls","md","txt"];
const ArchiveSuffix = ["zip","7z","rar","tar","gz"];
export function getFiletype(name:string):FileType {
    let suffix = name.substring(name.lastIndexOf('.') + 1)
    if (VideoSuffix.includes(suffix)) {
        return FileType.Video;
    } else if (MusicSuffix.includes(suffix)) {
        return FileType.Music;
    } else if (ImageSuffix.includes(suffix)) {
        return FileType.Image;
    } else if (DocumentSuffix.includes(suffix)) {
        return FileType.Document;
    } else if (ArchiveSuffix.includes(suffix)) {
        return FileType.Archive;
    } else {
        return FileType.Other;
    }
}
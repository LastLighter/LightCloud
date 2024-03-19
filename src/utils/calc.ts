export function calcIcon(type:number)  {
    if(type == 1){
        return '/secondMenu/video.svg'
    }else if(type == 2){
        return '/secondMenu/image.svg'
    }else if(type == 3){
        return '/secondMenu/music.svg'
    }else if(type == 4){
        return '/secondMenu/document.svg'
    }else if(type == 5){
        return '/secondMenu/compress.svg'
    }else if(type == 6){
        return '/secondMenu/another.svg'
    }
}

let MB = 1024 * 1024
let KB = 1024
export function calcSize(size:number){
    if(size == null || size == undefined || Number.isNaN(size) ||size == 0){
        return undefined
    }
    if(size > MB){
        return (size/MB).toFixed(1) + 'MB'
    }else if(size > KB){
        return (size/KB).toFixed(1) + 'KB'
    }else{
        return (size).toFixed(1) +'B'
    }
}

export function getFileSuffix(name:string){
    let index = name.lastIndexOf('.')
    return name.substring(index + 1)
}
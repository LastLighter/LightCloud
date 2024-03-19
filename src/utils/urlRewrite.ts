import type { ShareEntity } from "@/api/share/type"

export const getShareLink = (share:ShareEntity) => {
    let url = getShareURL(share.shareId)
    let code = share.code
    let text = '分享链接：' + url + ' \n提取码：' + code
    return text
}

export const getShareURL = (shareId:string) => {
    let sharePrefix = window.location.host + '/shareView/'
    let url = sharePrefix + shareId
    return url
}
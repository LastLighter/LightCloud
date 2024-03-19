import request from "@/utils/request"
import type { AddShareDto, ShareEntity, ShareQueryDto, shareInfoDto, ShareResDto } from "./type"

enum API{
    LIST = '/share/list',
    ADD = '/share/add',
    CANCLE = '/share/cancel',
    GET = '/share/get/',
    GET_INFO = '/share/getInfo/',
    getFileList = '/share/getFileList/',
    SAVE = '/share/save'
}

export const listShare = (dto:ShareQueryDto) => {
    return request.get<ShareQueryDto,shareResDto[]>(API.LIST, {params:dto})
}

export const addShare = (dto:AddShareDto) => {
    return request.post<AddShareDto,ShareEntity>(API.ADD, null, {params:dto})
}

export const cancleShare = (shareId:string, token:string) => {
    return request.delete<any,string>(API.CANCLE, {params:{shareId:shareId, token:token}})
}

export const getShare = (shareId:string, code:string) => {
    return request.get<string,ShareResDto|string>(API.GET +shareId, {params:{code:code}})
}

export const getShareInfo = (shareId:string) => {
    return request.get<string,shareInfoDto>(API.GET_INFO + '/' +shareId)
}

export const saveShare = (token:string, shareId:string, fidList:string, targetFid:string) => {
    return request.post<any,string>(API.SAVE,{token:token, shareId:shareId, fidList:fidList, targetFid:targetFid})
}
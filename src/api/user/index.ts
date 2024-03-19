import request from "@/utils/request";
import type { UserRegisterDto,UserResetPsDto,LoginData, UserRenameDto  } from "./type";
import type { UserInfo } from "../common/type";

enum API {
    GET_BY_TOKEN = '/user',
    LOGIN_URL = '/user/login',
    REGISTER_URL = '/user',
    ADMINISTRATION_URL = '/user/administration/login',
    RESET_PASSWORD_URL = '/user/reset-password',
    AVATAR = '/user/avatar',
    UPLOADAVATAR = '/user/avatar',
    LOGIN_OUT = '/user/logout',
    RESET_NAME = '/user/reset-username'
}

export const getByToken = (token:string) => {
    return request.get<string,UserInfo>(API.GET_BY_TOKEN,{params:{token:token}})
}

export const AvatarURL = '/api' + API.AVATAR

export const register = (user: UserRegisterDto) => {
    return request.post<any,any>(API.REGISTER_URL,user)
}

export const userLogin = (data:LoginData):Promise<UserInfo|string> => {
    return request.post<any,UserInfo|string>(API.LOGIN_URL, data)
}

export const adminnistrationLogin = (data:LoginData) => {
    return request.post<any,string>(API.ADMINISTRATION_URL, data)
}

export const resetPs = (data:UserResetPsDto) => {
    return request.put<any,any>(API.RESET_PASSWORD_URL, data)
}

export const uploadAvatar = (file:File, token:string) => {
    const formData = new FormData()
    formData.append('file',file)
    return request.post(API.UPLOADAVATAR, formData,  {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params:{
            token:token
        }
    })
}

export const logout = (token:string) => {
    request.delete(API.LOGIN_OUT, {params:{token:token}})
}

export const rename = (dto:UserRenameDto) => {
    request.put(API.RESET_NAME, dto)
}
import request from "@/utils/request";

enum API{
    ICON_CODE = '/code/iconCheckCode',
    EMAIL_CODE = '/code/emailCheckCode'
}

export const getIconCode = () => {
    return request.get<any,any>(API.ICON_CODE)
}

export const getEmailCode = (email:string):Promise<string> => {
    return request.get<any,string>(API.EMAIL_CODE,{params:{
        'email':email
    }})
}

export interface Token{
    token: string,
}

export interface Code{
    codeKey: string,
    code: string,
}

export interface UserRegisterDto extends Code{
    nickName: string,
    email: string,
    password: string,
}

export interface UserResetPsDto extends Code{
    email:string,
    password:string,
}

export interface LoginData {
    email: string,
    password: string,
    code: string,
    codeKey: string,
}

export interface UserRenameDto{
    token:string,
    name:string
}
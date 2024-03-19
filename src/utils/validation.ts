export const validateEmail = (email:string):boolean => {
    // 正则表达式用于检查电子邮件的格式
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validatePs = (ps:string):boolean => {
    if(ps.length >= 8 && ps.length <=16)
        return true
    return false
}

export const validateCode = (code:string):boolean => {
    if(code.length >= 4 && code.length <=6)
        return true
    return false
}

export const validateNickName = (name:string):boolean => {
    if(name.length >= 1 && name.length <=16)
        return true
    return false
}
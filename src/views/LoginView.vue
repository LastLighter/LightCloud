<script setup lang="ts">
import { ref, watch } from 'vue'
import { register, userLogin, resetPs } from '@/api/user'
import { getIconCode, getEmailCode } from '@/api/code'
import type { CheckCode } from '@/api/code/type'
import type { LoginData, UserRegisterDto, UserResetPsDto } from '@/api/user/type';
import { useUserInfoStore } from '@/stores/userInfo'
import { validateEmail, validateCode, validatePs, validateNickName } from '@/utils/validation'
import { serverError } from '@/utils/request'
import type { UserInfo } from '@/api/common/type';
import router from '@/router';

let svgBasePath = "/src/assets/svg/"

//用于在登录和注册之间切换，0表示登录，1表示注册,2表示重置密码
let status = ref<number>(0)

let loginTitle = '用户登录'
let registerTitle = '用户注册'
let resetTitle = '重置密码'
let defaultCodeText = '发送验证码'
let title = ref<string>('')
let nickName = ref<string>('')
let email = ref<string>('')
let ps = ref<string>('')
let codeKey = ref<string>('')
let code = ref<string>('')
let termAgreed = ref<boolean>(false)
let codeText = ref<string>()

let codeRes = ref<CheckCode>()
let getCheckCode = async () => {
    let res = await getIconCode()
    codeRes.value = res
    //当内容为undfined时，我返回空字符
    codeKey.value = codeRes.value?.key || ''
}
let getUserEmailCode = async (email: string) => {
    if (codeText.value == defaultCodeText) {
        let res: string = await getEmailCode(email)

        //当内容为undfined时，返回空字符
        codeKey.value = res || ''
        let waitTime = 60
        let intervalId = setInterval(() => {
            codeText.value = String(waitTime)
            --waitTime
            if (waitTime == 0) {
                clearInterval(intervalId)
                codeText.value = defaultCodeText
            }
        }, 1000)
    }
}

let checkEmail = (): boolean => {
    if (!validateEmail(email.value)) {
        ElMessage({
            type: 'error',
            message: '请输入合法的邮箱地址'
        })
        return false
    }
    return true
}

let checkPs = (): boolean => {
    if (!validatePs(ps.value)) {
        ElMessage({
            type: 'error',
            message: '密码长度应为8到16位'
        })
        return false
    }
    return true
}

let checkInputCode = (): boolean => {
    if (!validateCode(code.value)) {
        ElMessage({
            type: 'error',
            message: '验证码长度应为4到6位'
        })
        return false
    }
    return true
}

let checkNickName = (): boolean => {
    if (!validateNickName(nickName.value)) {
        ElMessage({
            type: 'error',
            message: '昵称长度应大于1小于16'
        })
        return false
    }
    return true
}
let checkTerms = (): boolean => {
    if (!termAgreed.value) {
        ElMessage({
            type: 'error',
            message: '请先同意用户协议'
        })
        return false
    }
    return true
}

let userStore = useUserInfoStore()

let login = async () => {
    if (checkEmail() && checkPs() && checkInputCode()) {
        let userData: LoginData = {
            'email': email.value,
            'password': ps.value,
            'code': code.value,
            'codeKey': codeKey.value,
        }
        let res = await userLogin(userData)
        if (res == serverError) {
            ElMessage({
                type: 'error',
                message: '登陆失败'
            })
            return
        }
        ElMessage({
            type: 'success',
            message: '登陆成功'
        })
        userStore.data = res as UserInfo
        localStorage.setItem('userInfo', JSON.stringify(res))
        //跳转至主界面
        router.push('/main')
    }
}

let userRegister = async () => {
    if (checkEmail() && checkPs() && checkNickName() && checkInputCode() && checkTerms()) {
        let data: UserRegisterDto = {
            nickName: nickName.value,
            email: email.value,
            password: ps.value,
            codeKey: codeKey.value,
            code: code.value
        }
        let res = await register(data)
        console.log('res: ' + res);

        if (res == serverError) {
            return
        }
        ElMessage({
            type: 'success',
            message: '注册成功'
        })
        //切换至登陆页面
        status.value = 0
        //清空验证码
        code.value = ''
    }
}

let resetUserPs = async () => {
    if (checkEmail() && checkPs() && checkInputCode()) {
        let data: UserResetPsDto = {
            email: email.value,
            password: ps.value,
            code: code.value,
            codeKey: codeKey.value
        }
        let res = await resetPs(data)
        if (res == serverError) {
            return
        }
        ElMessage({
            type: 'success',
            message: '重置密码成功'
        })
        //切换至登陆页面
        status.value = 0
        //清空验证码
        code.value = ''
    }
}

codeText.value = defaultCodeText
watch(status, (newValue) => {
    if (newValue == 0) {
        title.value = loginTitle
        getCheckCode()
    } else if (newValue == 1) {
        title.value = registerTitle
    } else if (newValue == 2) {
        title.value = resetTitle
    }
}, {
    immediate: true
})
</script>

<template>
    <div class="root">
        <img class="background" src="@/assets/img/光云登录页.jpg" />
        <div class="login-component">
            <div class="header-box">
                <div class="return-box" @click="status = 0" v-if="status == 1 || status == 2">
                    <img :src="svgBasePath + 'common/return.svg'" />
                </div>
            </div>

            <form class="form" @submit.prevent="login">
                <div class="title-box">
                    <h1 class="title">{{ title }}</h1>
                </div>
                <div class="email-box input-box">
                    <label class="label-text" for="email-input">
                        <img :src="svgBasePath + 'common/email.svg'" class="input-icon" />
                    </label>
                    <input type="email" autocomplete="current-email" class="text-input" id="email-input" v-model="email"
                        placeholder="请输入邮箱" />
                </div>
                <div class="nick-name-box input-box" v-if="status == 1">
                    <label class="label-text" for="nick-name-input">
                        <img :src="svgBasePath + 'common/user.svg'" class="input-icon" />
                    </label>
                    <input type="text" autocomplete="current-nickName" class="text-input" id="nick-name-input"
                        v-model="nickName" placeholder="请输入昵称" />
                </div>
                <div class="ps-box input-box">
                    <label class="label-text" for="ps-input">
                        <img :src="svgBasePath + 'common/password.svg'" class="input-icon" />
                    </label>
                    <input type="password" autocomplete="current-password" class="text-input" id="ps-input" v-model="ps"
                        placeholder="请输入密码" />
                </div>
                <div class="input-box" id="code-box">
                    <label class="label-text" for="code-input">
                        <img :src="svgBasePath + 'common/checkCode.svg'" class="input-icon" />
                    </label>
                    <input type="text" class="text-input" id="code-input" v-model="code" placeholder="请输入验证码" />
                    <div class="check-icon" v-if="codeRes && status == 0" @click="getCheckCode">
                        <img :src="'data:image/jpeg;base64,' + codeRes.value">
                    </div>
                    <i class="send-check-code" v-if="status == 1 || status == 2" @click="getUserEmailCode(email)">
                        {{ codeText }}
                    </i>
                </div>
                <div class="submit-box login-box" v-if="status == 0">
                    <button type="submit" class="form-button">登录</button>
                </div>
                <div class="contract-check-box" v-if="status == 1">
                    <input type="checkbox" class="contract-box" v-model="termAgreed" />
                    <div class="contract-name">
                        《光云用户使用条款》
                    </div>
                </div>
                <div class="register-box submit-box" v-if="status == 0">
                    <i class="form-button" @click="status = 1">用户注册</i>
                </div>
                <div class="register-box submit-box" v-if="status == 1">
                    <i class="form-button" @click="userRegister">注册</i>
                </div>
                <div class="submit-box reset-box" v-if="status == 2">
                    <i @click="resetUserPs" class="form-button">重置密码</i>
                </div>
            </form>

            <div class="retrieve-box" v-if="status == 0" @click="status = 2">
                <span class="retrieve-text">忘记密码？点我</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.background {
    z-index: -1;
    position: absolute;
}

.login-component {
    position: absolute;
    left: 60vw;
    top: 200px;
    background-color: #E6855C;
    width: 500px;
    height: 560px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 15px;
    border: 6px solid #fff;
    box-shadow: 2px 2px 12px #535353;
    padding: 50px 20px;

    .header-box {
        height: 30px;
        width: 100%;
        display: flex;
        justify-content: left;

        .return-box {
            height: 26px;
            width: 26px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            background-color: #f3f3f3;
            border: 2px solid #f3f3f3;

            img {
                width: 21px;
                cursor: pointer;
                position: relative;
                left: -80px;
                filter: drop-shadow(#524641 80px 0);
            }
        }

        .return-box:hover {
            background-color: #524641;

            img {
                filter: drop-shadow(#f3f3f3 80px 0);
            }
        }
    }

    .title-box {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;

        .title {
            font-size: 1.6rem;
            font-weight: 650;
            color: #333333;
            cursor: default;
        }
    }


    .input-box {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        border-radius: 15px;
        border: 3px solid #535353;
        height: 50px;
        width: 320px;
        padding: 0px 30px;
        background-color: #f3f3f3;
        color: #524641;
        transition: all 0.3s ease;

        .label-text {
            margin-right: 20px;
            overflow: hidden;
            min-width: 30px;

            .input-icon {
                width: 20px;
            }
        }

        .text-input {
            height: 30px;
            flex-grow: 1;
            font-size: 15px;
            font-weight: 620;
            background-color: transparent !important;
            border: none;
            color: inherit;
        }

        #code-input {
            width: 100px;
        }

        .check-icon {
            width: 100px;
            height: 50px;

            img {
                width: 100px;
            }
        }

        .send-check-code {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            width: 100px;
            height: 40px;
            border: 3px solid #524641;
            border-radius: 5px;
            background-color: #f3f3f3;
            color: #333333;
            cursor: pointer;
        }
    }

    #code-box {
        margin-bottom: 10px;
    }

    .contract-check-box {
        display: flex;
        align-items: center;

        .contract-box {
            width: 20px;
            height: 20px;
            border: 4px solid #524641;
            border-radius: 4px;
        }

        .contract-name {
            color: #1C84FF;
        }
    }

    .input-box:hover {
        border: 3px solid #f3f3f3;
        background-color: #333333;
        color: #f3f3f3;

        .input-icon {
            position: relative;
            left: -80px;
            filter: drop-shadow(#00A2E8 80px 0);
        }

        .text-input {
            color: #f3f3f3;
        }

        .send-check-code {
            border: 3px solid #f3f3f3;
            background-color: #524641;
            color: #f3f3f3;
        }
    }

    .login-box {
        margin-top: 40px;
    }

    .reset-box {
        margin-top: 40px;
    }

    i{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .submit-box {
        display: flex;
        justify-content: center;
        width: 100%;

        .form-button {
            font-weight: 620;
            cursor: pointer;
            width: 100%;
            border: 3px solid #535353;
            border-radius: 10px;
            height: 52px;
            background-color: #f3f3f3;
            transition: all 0.3s ease;
        }

        .form-button:hover {
            border: 3px solid #f3f3f3;
            background-color: #333333;
            color: #f3f3f3;
        }
    }

    .register-box {
        margin-top: 35px;
    }

    .retrieve-box {
        margin-top: 30px;
        color: #524641;
        cursor: pointer;
        font-weight: 620;
    }

    .retrieve-box:hover {
        text-decoration: underline;
        color: #f3f3f3;
    }
}
</style>
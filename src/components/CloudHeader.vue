<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCommonStore } from '@/stores/common';
import { useUserInfoStore } from '@/stores/userInfo';
import { rename } from '@/api/user';
import menus from '@/components/userDropDown'
import router from '@/router';

let userInfoStore = useUserInfoStore()
let commonStore = useCommonStore()
let imgBasePath = '/src/assets/img/'
let svgBasePath = "/src/assets/svg/"

let logined = ref<boolean>(false)
if (userInfoStore.data?.token) {
    logined.value = true
}

let nickName = ref<string>('请先登录')
let updateNickName = () => {
    nickName.value = useUserInfoStore().data?.nickName || '请登录'
}
updateNickName()


//控制下拉菜单
let handleEnter = () => {
    if (logined.value == true) {
        commonStore.dropdownShow = true
    }
}
let handleLeave = () => {
    commonStore.dropdownShow = false
}

let userNewName = ref<string>()
let handleRenameUser = () => {
    commonStore.updateNameShow = false
    rename({ name: userNewName.value || '', token: userInfoStore.data?.token || '' })
    userNewName.value = ''
    ElMessage({
        type: 'success',
        message: '修改昵称成功'
    })
    setTimeout(async () => {
        await userInfoStore.reloadUserInfo()
        updateNickName()
    }, 1000)
}

//当用户未登录时，提示用户登录
let handleLogin = () => {
    if (userInfoStore.data?.token) {
        return
    }
    router.push('/login')
}

let userAvatar = computed(() => userInfoStore.avatarURL || '')
</script>

<template>
    <div class="nav">
        <div class="logo-box">
            <img :src="imgBasePath + 'logo-simplified.png'" />
            <div class="title-box">
                <h1 class="main-title">光云</h1>
                <h3 class="small-title">Light Cloud</h3>
            </div>
        </div>
        <div class="info-box" @mouseenter="handleEnter" @mouseleave="handleLeave" @click="handleLogin">
            <div class="avatar-box">
                <img :src="userAvatar" />
            </div>
            <div class="nickname-box">
                {{ nickName }}
            </div>
            <div class="dropdown-box" v-show="commonStore.dropdownShow">
                <div id="inner">
                    <DropDown :menus="menus"></DropDown>
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <Notification v-show="commonStore.updateNameShow">
            <template #header>
                <div class="noti-header">
                    <img :src="svgBasePath + '/dropdown/rename.svg'" />
                    <h2>重置昵称</h2>
                </div>
            </template>

            <template #content>
                <div class="noti-content">
                    <div class="input-box">
                        <input type="text" v-model="userNewName" placeholder="请输入新昵称" />
                    </div>
                    <div class="button-bar">
                        <button @click="handleRenameUser">确认</button>
                        <button @click="commonStore.updateNameShow = false; userNewName = ''">取消</button>
                    </div>
                </div>
            </template>
        </Notification>
    </Teleport>
</template>

<style scoped lang="scss">
.nav {
    display: flex;
    justify-content: space-between;
    box-shadow: 2px 4px 12px #e3e3e3;
    width: 100%;
    padding: 5px 0px;
    // margin-bottom: -30px;

    .logo-box {
        display: flex;
        align-items: center;
        margin-left: 80px;

        img {
            height: 75px;
        }

        .title-box {
            padding: 15px 15px;

            .main-title {
                font-weight: 650;
                font-size: 30px;
                margin-bottom: 12px;
                letter-spacing: 12px;
            }

            .small-title {
                font-size: 14px;
            }
        }
    }

    .info-box {
        margin-right: 80px;
        display: flex;
        align-items: center;
        cursor: pointer;

        .avatar-box {
            border-radius: 50%;
            // border: 2px solid #524152;
            height: 65px;
            width: 65px;
            overflow: hidden;
            display: flex;
            justify-content: center;

            img {
                width: auto;
                max-height: 100%;
            }
        }

        .nickname-box {
            margin-left: 25px;
        }
    }

    .dropdown-box {
        position: relative;

        #inner {
            position: absolute;
            z-index: 1;
            right: 0px;
            top: 30px;
        }
    }
}

.noti-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 50px;
    width: 100%;

    img {
        width: 21px;
        margin-right: 20px;
    }

    h2 {
        font-weight: 550;
    }
}

.noti-content {
    display: flex;
    flex-direction: column;
    padding: 30px 50px;
    width: 320px;

    .input-box {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;

        input {
            width: 100%;
            height: 25px;
            border-radius: 6px;
            border: 1px solid #524137;
            padding: 0px 15px;
        }
    }

    .button-bar {
        display: flex;
        align-items: center;
        justify-content: space-around;

        button {
            width: 100px;
        }
    }
}
</style>
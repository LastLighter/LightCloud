<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import MenuBar from '@/components/MenuBar.vue';
import menuList from './mainPageMenu';
import router from '@/router';
import FileBox from '@/components/FileBox.vue';
import type { FileEntity } from '@/api/component/type';
import BreadCrumb from '@/components/BreadCrumb.vue';
import NavBox from '@/components/NavBox.vue';
import request from '@/utils/request';
import { batchUploadByChunk } from '@/utils/upload';
import { useCurPathStore } from '@/stores/curPath';
import { useUserInfoStore } from '@/stores/userInfo';
import { newFodler, reqChildrenSize, reqFileList, reqListCategory } from '@/api/file';
import FileSystem from '@/components/FileSystem.vue';
import Notification from '@/components/Notification.vue'
import PageSelector from '@/components/PageSelector.vue';
import ProgressBar from '@/components/ProgressBar.vue';

let svgBasePath = "/src/assets/svg/"
let curPathStore = useCurPathStore()
let userInfoStore = useUserInfoStore()
let menuarr = menuList
//当前菜单
let curMenu = ref<number>(0)
//右侧展示的文件
let fileList = ref<FileEntity[]>([])

let curPage = ref<number>(1)
//页管理
let total = ref<number>(0)
let pageSize = ref<number>(10)

let selectHandler = async (index: number) => {
    curMenu.value = index
    if (index > 0) {
        fileList.value = await reqListCategory({ fileCategory: menuList[index].category || 0, userId: userInfoStore.data?.uid || 0, page: curPage.value, pageSize: pageSize.value })
        loadFileSize(menuList[index].category || 0)
    } else {
        freshAfter()
    }
}
let navHandler = (index: number) => {
    if (index == 0) {
        curPathStore.back();
    } else if (index == 1) {
        loadFile()
    }
}

let uploadHandler = async(event: Event) => {
    //首先将其断言为input元素，不然ts会警告我们通用的元素可能没有files属性
    const target = event?.target as HTMLInputElement
    let files = target?.files
    if (files == null || files.length == 0) {
        return
    }
    let msg = files[0].size > 50 * 1024 * 1024 ? '正在上传文件，请耐心等候' : '正在上传文件'
    ElMessage({
        type: 'success',
        message: msg
    })
    //上传到后台服务器
    await batchUploadByChunk(files, curPathStore.getFid(), userInfoStore.data?.token as string)
    userInfoStore.reloadUserInfo()
}
//获取文件总数
let loadFileSize = async (category: number) => {
    let token = userInfoStore.data?.token
    let size = await reqChildrenSize(token||'', curPathStore.getFid(), category)
    total.value = size
}

//请求当前目录的文件
let loadFile = async () => {
    loadFileSize(0)
    let res = await reqFileList({
        userId: userInfoStore.data?.uid,
        fileParent: curPathStore.getFid(),
        page: curPage.value,
        pageSize: pageSize.value
    })
    fileList.value = res
}
loadFile()

let freshAfter = () => {
    setTimeout(() => {
        loadFile()
    }, 500)
}
let folderName = ref<string>('')
let handleNewFolder = () => {
    newFolderShow.value = false
    newFodler({ fid: curPathStore.getFid(), folderName: folderName.value, token: userInfoStore.data?.token || '' })
    folderName.value = ''
    freshAfter()
}
let newFolderShow = ref<boolean>(false)

//监听路径变化，及时更新文件
watch(curPathStore.data, () => {
    loadFile()
})

let handlePageUpdate = (page: number) => {
    curPage.value = page
    loadFile()
}

let spacePercent = ref<number>(Number(userInfoStore.data?.userSpace||0) / Number(userInfoStore.data?.totalSpace||1) * 100)
userInfoStore.$subscribe((mutation, state) => {
    spacePercent.value = Number(userInfoStore.data?.userSpace||0) / Number(userInfoStore.data?.totalSpace||1) * 100
})
let MB = 1024n * 1024n
</script>

<template>
    <div class="content">
        <div class="left-entry">
            <MenuBar :menuList="menuarr" @select="selectHandler" class="menu-box"></MenuBar>
            <div class="user-space-box">
                <ProgressBar :cur="spacePercent"></ProgressBar>
                <div class="space-text">
                    <h2>已使用：</h2>
                    <h3>{{ BigInt(userInfoStore.data?.userSpace||0) / MB }}MB / {{ BigInt(userInfoStore.data?.totalSpace||0) / MB }}MB</h3>
                </div>
            </div>
        </div>
        <div class="file-system-box">
            <div class="header-box" v-show="curMenu == 0">
                <div class="nav-bar">
                    <NavBox @operation="navHandler"></NavBox>
                    <div class="bread-crumb-box">
                        <BreadCrumb></BreadCrumb>
                    </div>
                </div>
                <div class="tool-bar">
                    <div class="tool-button" @click="newFolderShow = true">
                        <div class="img-wrapper">
                            <img :src="svgBasePath + 'common/newFolder.svg'" />
                        </div>
                        <h4>新建文件夹</h4>
                    </div>
                    <Notification v-show="newFolderShow">
                        <template #header>
                            <div class="header-box">
                                <div class="title">新建文件夹</div>
                                <div class="close" @click="newFolderShow = false">
                                    <img :src="svgBasePath + '/common/close.svg'" />
                                </div>
                            </div>
                        </template>

                        <template #content>
                            <div class="content-box">
                                <div class="input-box">
                                    <div class="input-text">文件夹名</div>
                                    <input type="text" v-model="folderName" />
                                </div>
                                <div class="submit" @click="handleNewFolder">
                                    <button>确认</button>
                                </div>
                            </div>
                        </template>
                    </Notification>
                    <label class="tool-button">
                        <input type="file" @change="uploadHandler" v-show="false" />
                        <div class="img-wrapper">
                            <img :src="svgBasePath + 'common/upload.svg'" />
                        </div>
                        <h4>上传</h4>
                    </label>
                </div>
            </div>
            <div class="files-box">
                <FileSystem :fileList="fileList" @fresh="freshAfter"></FileSystem>
            </div>
            <div class="page-selector">
                <PageSelector :page="curPage" :total="total" :page-size="pageSize" @page-update="handlePageUpdate">
                </PageSelector>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content {
    display: flex;

    .left-entry {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .menu-box {
            min-width: max-content;
        }
        .user-space-box{
            margin-bottom: 40px;
            padding: 10px 20px;
            .space-text{
                display: flex;
                line-height: 24px;
                h2{
                    font-size: 12px;
                }
                h3{
                    margin-left: 4px;
                    font-size: 13px;
                }
            }
        }
    }

    .file-system-box {
        flex-grow: 1;

        .header-box {
            display: flex;
            align-items: center;
            height: 80px;
            border-bottom: 1px solid #e3e3e3;
            justify-content: space-between;

            .nav-bar {
                padding-left: 25px;
                display: flex;
                align-items: center;
            }

            .tool-bar {
                margin-right: 80px;
                display: flex;

                .tool-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    // flex-direction: column;
                    border: none;
                    background-color: #eaeaea;
                    color: #524137;
                    height: 40px;
                    width: 130px;
                    border-radius: 18px;
                    margin-left: 40px;
                    cursor: pointer;

                    .img-wrapper {
                        overflow: hidden;
                        width: 24px;
                        margin-right: 10px;

                        img {
                            width: 100%;
                            position: relative;
                            left: -80px;
                            filter: drop-shadow(#524137 80px 0);
                        }
                    }

                    h4 {
                        font-size: 13px;
                    }
                }

                .tool-button:hover {
                    background-color: #524137;
                    color: #e3e3e3;

                    .img-wrapper {
                        img {
                            filter: drop-shadow(#e3e3e3 80px 0);
                        }
                    }
                }

                .header-box {
                    display: flex;
                    width: 400px;
                    height: 50px;
                    position: relative;

                    .title {
                        position: absolute;
                        width: 120px;
                        display: flex;
                        justify-content: center;
                        left: calc(50% - 60px);
                        font-weight: 550;
                        line-height: normal;
                    }

                    .close {
                        position: absolute;
                        right: 42px;
                        overflow: hidden;
                        width: 24px;
                        cursor: pointer;

                        img {
                            width: 100%;
                            position: relative;
                            left: -80px;
                            filter: drop-shadow(#524137 80px 0);
                        }
                    }

                    .close:hover {
                        img {
                            filter: drop-shadow(#00A2E8 80px 0);
                        }
                    }
                }

                .content-box {
                    height: 160px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .input-box {
                        margin-top: 20px;
                        display: flex;
                        align-items: center;
                        margin-bottom: 45px;

                        .input-text {
                            // height: fit-content;
                            line-height: normal;
                            margin-right: 25px;
                        }

                        input {
                            height: 25px;
                            border-radius: 6px;
                            border: 1px solid #524137;
                            padding: 0px 15px;
                        }
                    }

                    .submit {
                        button {
                            // background-color: #524137;
                            width: 120px;
                            height: 24px;
                            border: 1px solid #524137;
                            border-radius: 5px;
                            cursor: pointer;
                            color: #524137;
                        }

                        button:hover {
                            background-color: #52413730;
                        }
                    }
                }
            }
        }

        .files-box {
            display: flex;
            flex-direction: column;
            height: 75dvh;
        }
    }
}
</style>./mainPageMenu
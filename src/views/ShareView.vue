<script setup lang="ts">
import { getShare, getShareInfo, saveShare } from '@/api/share';
import CloudHeader from '@/components/CloudHeader.vue';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue'
import Notification from '@/components/Notification.vue';
import { AvatarURL } from '@/api/user';
import { transferLocalDate } from '@/utils/date';
import { serverError } from '@/utils/request';
import FileTable from '@/components/FileTable.vue';
import type { FileEntity } from '@/api/component/type';
import { reqFileList } from '@/api/file';
import { useUserInfoStore } from '@/stores/userInfo';
import type { ShareResDto } from '@/api/share/type';
import { useCurPathStore } from '@/stores/curPath';
import NavBox from '@/components/NavBox.vue';
import { useFileStore } from '@/stores/file';
import { sliceDownloadFile } from '@/utils/download';
import FileTree from '@/components/FileTree.vue';
import { useCommonStore } from '@/stores/common';

let svgBasePath = "/src/assets/svg/"
let route = useRoute()
let shareId = route.params.shareId as string
let code = ref<string>()
let notiCodeInputShow = ref<boolean>(true)
let avatarURL = ref<string>('')
let nickName = ref<string>('')
let createTime = ref<string>('')
let fileList = ref<FileEntity[]>([])
let curPage = ref<number>(1)
let PageSize = 10
let fileTableShow = ref<boolean>(false)
let load = async () => {
    let res = await getShareInfo(shareId)
    avatarURL.value = AvatarURL + '/' + res.uid
    nickName.value = res.userName
    createTime.value = transferLocalDate(res.createTime)
}
load()

//返回的数据
let dto: ShareResDto
let handleGetShare = async () => {
    let res = await getShare(shareId, code.value?.trim() || '')
    if (res == serverError) {
        return
    }
    fileTableShow.value = true

    dto = res as ShareResDto
    let file: FileEntity = { name: dto.name, fid: dto.fid || '', fileSize: String(dto.fileSize), createTime: dto.createTime || '', folderType: dto.folderType } as FileEntity
    fileList.value.push(file)
    notiCodeInputShow.value = false
}
let handleSelect = async (fid: string, uid: string) => {
    let fileRes = await reqFileList({ page: curPage.value, pageSize: PageSize, userId: Number(uid), fileParent: fid })
    fileList.value = fileRes
}
let curPathStore = useCurPathStore()
//初始化路径
curPathStore.data = [{ name: '我的分享', fid: '0' }]
curPathStore.$subscribe((mutation, state) => {
    if (curPathStore.getFid() == '0') {
        fileList.value = []
        let file: FileEntity = { name: dto.name, fid: dto.fid || '', fileSize: String(dto.fileSize), createTime: dto.createTime || '', folderType: dto.folderType } as FileEntity
        fileList.value.push(file)
        return
    }
    handleSelect(curPathStore.getFid(), dto.uid || '')
})

//nav
let handleOperation = (index: number) => {
    if (index == 0) {
        curPathStore.back()
    } else if (index == 1) {
        //什么事都不用做
    }
}

let fileStore = useFileStore()
let userInfoStore = useUserInfoStore()
let commonStore = useCommonStore()
let handleDownload = () => {
    let list = fileStore.checkedFidArr
    list.forEach((item) => {
        let isDir = false
        //查找文件，确保其不是个文件夹
        fileList.value.forEach((file) => {
            if (item == file.fid && file.folderType == 1) {
                ElMessage({
                    type: 'error',
                    message: '请勿选择文件夹'
                })
                isDir = true
            }
        })

        if (isDir) {
            return
        }
        sliceDownloadFile(item, BigInt(dto.uid || 0))
    })
}

let notiSaveShow = ref<boolean>(false)
let handleSaveClick = () => {
    //是否登录
    if (userInfoStore.data?.token) {
        notiSaveShow = true
    } else {
        ElMessage({
            type: 'error',
            message: '请先登录'
        })
    }
}
let handleSave = async () => {
    let token = userInfoStore.data?.token || ''
    let fidList = fileStore.checkedFidArr.join(',')
    let target = commonStore.curSelectedDir?.fid
    let res = await saveShare(token, dto.shareId || '', fidList, target || '')
    if (res != serverError) {
        ElMessage({
            type: 'success',
            message: '保存成功'
        })
    }
    notiSaveShow.value = false
}
</script>

<template>
    <CloudHeader></CloudHeader>
    <div class="content">
        <div v-if="notiCodeInputShow" class="code-box">
            <div class="noti-header">
                <img :src="svgBasePath + '/dropdown/rename.svg'" />
                <h2>请输入提取码</h2>
            </div>

            <form @submit.prevent="handleGetShare" class="noti-content">
                <div class="info-box">
                    <div class="user-info">
                        <div class="avatar-box">
                            <img :src="avatarURL || ''" />
                        </div>
                        <div class="nickname-box">
                            {{ nickName }}
                        </div>
                    </div>
                    <div class="create-time">
                        <h3>{{ createTime }}</h3>
                    </div>
                </div>
                <div class="input-box">
                    <input type="text" v-model="code" placeholder="请输入提取码" />
                </div>
                <div class="button-bar">
                    <button type="submit">确认</button>
                </div>
            </form>
        </div>
        <div class="file-table-box" v-if="fileTableShow">
            <div class="file-operate-box">
                <div class="nav-box">
                    <NavBox @operation="handleOperation"></NavBox>
                </div>
                <div class="tool-bar">
                    <button id="download" @click="handleDownload">
                        <div class="img-wrapper">
                            <img :src="svgBasePath + '/dropdown/download.svg'" />
                        </div>
                        <h2>下载文件</h2>
                    </button>
                    <button id="save" @click="handleSaveClick">
                        <div class="img-wrapper">
                            <img :src="svgBasePath + '/common/save.svg'" />
                        </div>
                        <h2>保存到我的网盘</h2>
                    </button>
                </div>
            </div>
            <FileTable :files="fileList"></FileTable>
        </div>
    </div>
    <Teleport to="body">
        <Notification v-if="notiSaveShow">
            <template #header>
                <div id="noti-header">
                    <img :src="svgBasePath + '/dropdown/move.svg'" />
                    <h2>保存文件</h2>
                </div>
            </template>
            <template #content>
                <div class="tree-content" id="move">
                    <div class="file-tree-box">
                        <FileTree :fid="'-1'"></FileTree>
                    </div>
                    <div class="button-bar">
                        <button @click="handleSave">确认</button>
                        <button @click="notiSaveShow = false">取消</button>
                    </div>
                </div>
            </template>
        </Notification>
    </Teleport>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    justify-content: center;
    padding: 40px 120px;

    .code-box {
        margin-top: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 32px 99px;
        background-color: #52413720;
        border-radius: 8px;

        .noti-header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
            // width: fit-content;

            img {
                width: 27px;
                margin-right: 20px;
            }

            h2 {
                font-weight: 550;
                font-size: 18px;
            }
        }

        .noti-content {
            display: flex;
            flex-direction: column;
            // width: 360px;

            .info-box {
                display: flex;
                align-items: center;
                margin-bottom: 36px;
                background-color: #E8996Db0;
                padding: 16px 32px;
                border-radius: 6px;

                .user-info {
                    display: flex;
                    align-items: center;

                    .avatar-box {
                        border-radius: 50%;
                        // border: 2px solid #524152;
                        height: 50px;
                        min-width: 50px;
                        max-width: 50px;
                        // width: 50px;
                        overflow: hidden;
                        display: flex;
                        justify-content: center;

                        img {
                            width: auto;
                            max-height: 100%;
                        }
                    }

                    .nickname-box {
                        margin-left: 20px;
                        color: #524137;
                    }
                }

                .create-time {
                    margin-left: 120px;

                    h3 {
                        font-size: 13px;
                        color: #524137;
                    }
                }
            }

            .input-box {
                display: flex;
                justify-content: center;
                margin-bottom: 42px;

                input {
                    width: 100%;
                    height: 32px;
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
    }

    .file-table-box {
        width: 80%;

        .file-operate-box {
            border-bottom: 1px solid #e3e3e3;
            margin-bottom: 30px;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;

            .nav-box {
                width: max-content
            }

            .tool-bar {
                display: flex;

                button {
                    border: none;
                    display: flex;
                    align-items: center;
                    border-radius: 12px;
                    padding: 5px 12px;
                }

                #download {
                    background-color: #B97A57;
                    margin-right: 27px;
                    color: #e3e3e3;

                    .img-wrapper {
                        overflow: hidden;
                        width: 24px;
                        margin-right: 10px;

                        img {
                            width: 100%;
                            position: relative;
                            left: -80px;
                            filter: drop-shadow(#e3e3e3 80px 0);
                        }
                    }

                }

                #download:hover {
                    color: #e3e3e3;
                    background-color: #524137;

                    .img-wrapper {
                        img {
                            filter: drop-shadow(#e3e3e3 80px 0);
                        }
                    }
                }

                #save {
                    color: #524137;
                    background-color: #B97A5740;

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

                }

                #save:hover {
                    color: #e3e3e3;
                    background-color: #524137;

                    .img-wrapper {
                        img {
                            filter: drop-shadow(#e3e3e3 80px 0);
                        }
                    }
                }
            }
        }
    }
}

#noti-header {
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

.tree-content {
    display: flex;
    flex-direction: column;
    padding: 30px 50px;
    width: 320px;

    .button-bar {
        display: flex;
        align-items: center;
        justify-content: space-around;

        button {
            width: 100px;
        }
    }
}

#move {
    width: 420px;

    .file-tree-box {
        background: #52413716;
        border-radius: 12px;
        margin-bottom: 30px;
        padding: 15px;
        height: 270px;
        overflow: auto;
    }
}
</style>
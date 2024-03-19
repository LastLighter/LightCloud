<script setup lang="ts">
import type { FileEntity } from '@/api/component/type'
import FileBox from './FileBox.vue';
import { deleteFile, move, recycle, rename } from '@/api/file';
import { useUserInfoStore } from '@/stores/userInfo';
import { onMounted, ref } from 'vue'
import { useCommonStore } from '@/stores/common'
import type { ContextData } from '@/api/component/type'
import FileTree from './FileTree.vue';
import { addShare } from '@/api/share';
import ShareDetails from './ShareDetails.vue';
import type { ShareEntity } from '@/api/share/type';
import { getShareLink } from '@/utils/urlRewrite';
import Notification from './Notification.vue';
import FilePreviewer from './FilePreviewer.vue';
import { getFileSuffix } from '@/utils/calc';

const emit = defineEmits<{ fresh: [] }>()
const props = defineProps<{ fileList: FileEntity[] }>()
let svgBasePath = "/src/assets/svg/"
let userInfoStore = useUserInfoStore()
let commonStore = useCommonStore()

let menuLeftPoi = ref<number>(0)
let menuTopPoi = ref<number>(0)
let handleContext = (data: ContextData) => {
    commonStore.contextMenuShow = true

    commonStore.curContextFile = data.file
    menuLeftPoi.value = data.x
    menuTopPoi.value = data.y
}

//监听是否点击了组件之外的地方（以便消除右键菜单）
onMounted(() => {
    document.addEventListener('click', handleGlobalClick)
})
let contextMenu = ref<HTMLDivElement | null>(null)
let handleGlobalClick = (event: MouseEvent) => {
    if (contextMenu.value != null && !contextMenu.value.contains(event.target as Node)) {
        commonStore.contextMenuShow = false
    }
}

let notiDeleteShow = ref<boolean>(false)
let notiRenameShow = ref<boolean>(false)
let notiMoveShow = ref<boolean>(false)
let notiShareShow = ref<boolean>(false)
let handleDelete = () => {
    recycle(userInfoStore.data?.token||'', commonStore.curContextFile?.fid || '')
    notiDeleteShow.value = false
    emit('fresh')
}
let fileNewName = ref<string>()
let handleRename = () => {
    notiRenameShow.value = false
    rename({ fid: commonStore.curContextFile?.fid || '', token: userInfoStore.data?.token || '', fileName: fileNewName.value || '' })
}
let moveFid = ref<FileEntity>()
let handleMove = () => {
    notiMoveShow.value = false
    let target = commonStore.getSelectedDirFid()
    let token = userInfoStore.data?.token || ''
    let fid = commonStore.curContextFile?.fid || ''
    move({ fids: fid, targetFid: target, token: token })
}
//默认的分享时间
let shareDefaultArr = [3, 7, 30]
let curShareDay = shareDefaultArr[0]
let updateShareDay = (day: number) => {
    curShareDay = day
}
let shareDetailsShow = ref<boolean>(false)
let shareDetails = ref<ShareEntity>()
let handleShare = async () => {
    let token = userInfoStore.data?.token || ''
    let fid = commonStore.curContextFile?.fid || ''
    let res = await addShare({ token: token, validity: curShareDay, fid: fid })
    shareDetails.value = res
    ElMessage({
        type: 'success',
        message: '分享成功，现在就复制链接吧~'
    })
    shareTitle.value = '分享成功'
    shareDetailsShow.value = true
}
let shareTitle = ref<string>('分享时长')
let handleCopyLink = () => {
    if (ShareDetails.value != undefined) {
        let res = getShareLink(shareDetails.value)
        navigator.clipboard.writeText(res);
    }
}
let previewerShow = ref<boolean>(false)
let handlePreview = () => {
    previewerShow.value = true
}
</script>

<template>
    <div class="container">
        <div class="file-box" v-for="item in props.fileList">
            <FileBox :item="item" @preview="handlePreview" @context="handleContext"></FileBox>
        </div>
    </div>

    <div class="context" ref="contextMenu" :style="{ top: `${menuTopPoi}px`, left: `${menuLeftPoi}px` }">
        <ContextMenu v-if="commonStore.contextMenuShow" :item="commonStore.curContextFile"
            @delete="notiDeleteShow = true"
            @rename="notiRenameShow = true; fileNewName = commonStore.curContextFile?.name || ''"
            @move="notiMoveShow = true" @share="notiShareShow = true">
        </ContextMenu>
    </div>

    <Teleport to="body">
        <Notification v-if="notiDeleteShow">
            <template #header>
                <div class="noti-header">
                    <img :src="svgBasePath + '/common/alert.svg'" />
                    <h2>回收文件</h2>
                </div>
            </template>
            <template #content>
                <div class="noti-content">
                    <div class="button-bar">
                        <button @click="handleDelete">确认</button>
                        <button @click="notiDeleteShow = false">取消</button>
                    </div>
                </div>
            </template>
        </Notification>
    </Teleport>

    <Teleport to="body">
        <Notification v-if="notiRenameShow">
            <template #header>
                <div class="noti-header">
                    <img :src="svgBasePath + '/dropdown/rename.svg'" />
                    <h2>重命名</h2>
                </div>
            </template>
            <template #content>
                <div class="noti-content">
                    <div class="input-box">
                        <input type="text" v-model="fileNewName" placeholder="请输入文件名" />
                    </div>
                    <div class="button-bar">
                        <button @click="handleRename">确认</button>
                        <button @click="notiRenameShow = false">取消</button>
                    </div>
                </div>
            </template>
        </Notification>
    </Teleport>

    <Teleport to="body">
        <Notification v-if="notiMoveShow">
            <template #header>
                <div class="noti-header">
                    <img :src="svgBasePath + '/dropdown/move.svg'" />
                    <h2>移动文件</h2>
                </div>
            </template>
            <template #content>
                <div class="noti-content" id="move">
                    <div class="file-tree-box">
                        <FileTree :fid="'-1'"></FileTree>
                    </div>
                    <div class="button-bar">
                        <button @click="handleMove">确认</button>
                        <button @click="notiMoveShow = false">取消</button>
                    </div>
                </div>
            </template>
        </Notification>
    </Teleport>

    <Teleport to="body">
        <Notification v-if="notiShareShow">
            <template #header>
                <div class="noti-header">
                    <img :src="svgBasePath + '/firstMenu/share.svg'" />
                    <h2>{{ shareTitle }}</h2>
                </div>
            </template>
            <template #content>
                <div class="noti-content">
                    <div class="default-box" v-if="!shareDetailsShow">
                        <div class="share-day-box">
                            <form>
                                <label class="share-day-radio" v-for="(item,index) in shareDefaultArr"
                                    @click="updateShareDay(item)">
                                    <input type="radio" name="option" :value="item" v-model="curShareDay">
                                    <span>{{ item }}天</span>
                                </label>
                            </form>
                        </div>
                        <div class="button-bar">
                            <button @click="handleShare">确认</button>
                            <button @click="notiShareShow = false">取消</button>
                        </div>
                    </div>
                    <div class="share-box" v-if="shareDetailsShow">
                        <ShareDetails :data="shareDetails" id="share-detail"></ShareDetails>
                        <div class="button-bar">
                            <button @click="handleCopyLink">复制链接</button>
                            <button @click="shareDetailsShow = false; notiShareShow = false">确认</button>
                        </div>
                    </div>
                </div>
            </template>
        </Notification>
    </Teleport>
    <FilePreviewer v-if="previewerShow" :name="commonStore.curContextFile?.name||''" @close="previewerShow = false"></FilePreviewer>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: 100%;

    .file-box {
        width: 180px;
        height: 200px;
        margin: 40px;
    }
}

.context {
    position: absolute;
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

    #share-detail {
        margin-bottom: 20px;
    }

    .button-bar {
        display: flex;
        align-items: center;
        justify-content: space-around;

        button {
            width: 100px;
        }
    }

    .share-day-box {
        width: 100%;
        margin-bottom: 20px;

        form {
            height: 40px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;

            .share-day-radio {}
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
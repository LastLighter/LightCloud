<script setup lang="ts">
import { ref } from 'vue';
import type { FileEntity } from '@/api/component/type'
import { useUserInfoStore } from '@/stores/userInfo';
import { useCommonStore } from '@/stores/common';
import { sliceDownloadFile } from '@/utils/download'


const props = defineProps<{ item: FileEntity }>()
let emit = defineEmits<{ delete: [], rename: [], share: [], move: [] }>()
let svgBasePath = "/src/assets/svg/"
let commonStore = useCommonStore()
let userInfoStore = useUserInfoStore()
let handleShare = () => {
    commonStore.contextMenuShow = false
    emit('share')
}

let handleDelete = () => {
    commonStore.contextMenuShow = false
    emit('delete')
}
let handleRename = () => {
    commonStore.contextMenuShow = false
    emit('rename')
}
let handleDownload = async () => {
    let fid = props.item.fid
    let uid = userInfoStore.data?.uid
    commonStore.contextMenuShow = false
    // window.open(`/api/file/download/${fid}?uid=${uid}`)
    sliceDownloadFile(fid, BigInt(uid || 0n))
}

let handleMove = () => {
    commonStore.contextMenuShow = false
    emit('move')
}
</script>

<template>
    <div class="menu-container">
        <div class="move-box">
            <div class="download-box item-box" v-if="props.item.folderType == 0" @click="handleDownload">
                <div class="img-wrapper">
                    <img :src="svgBasePath + '/dropdown/download.svg'" />
                </div>
                <h2>下载</h2>
            </div>
            <div class="move-box item-box" @click="handleMove">
                <div class="img-wrapper">
                    <img :src="svgBasePath + '/dropdown/move.svg'" />
                </div>
                <h2>移动</h2>
            </div>
            <div class="rename-box item-box" @click="handleRename">
                <div class="img-wrapper">
                    <img :src="svgBasePath + '/dropdown/rename.svg'" />
                </div>
                <h2>重命名</h2>
            </div>
            <div class="share-box item-box" @click="handleShare">
                <div class="img-wrapper">
                    <img :src="svgBasePath + '/firstMenu/share.svg'" />
                </div>
                <h2>分享</h2>
            </div>
            <div class="delete-box item-box" @click="handleDelete">
                <div class="img-wrapper">
                    <img :src="svgBasePath + '/dropdown/delete.svg'" />
                </div>
                <h2>回收</h2>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.menu-container {
    width: 120px;
    border: 1px solid #e3e3e3;
    box-shadow: 2px 4px 6px 2px #52413780;
    border-radius: 6px;
    background-color: #f3f3f3;
    cursor: default;

    .item-box {
        display: flex;
        align-items: center;
        padding: 10px 20px;

        .img-wrapper {
            margin-right: 18px;
            width: 16px;

            img {
                width: 100%;
            }
        }

        h2 {
            font-size: 13px;
        }
    }

    .item-box:hover {
        background-color: #e3e3e3;
    }
}
</style>
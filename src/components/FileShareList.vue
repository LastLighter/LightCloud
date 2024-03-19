<script setup lang="ts">
import { ref, watch } from 'vue'
import FileRecord from './FileRecord.vue';
import type { TransportedFile } from '@/api/local/type';
import type { shareResDto } from '@/api/share/type';
import ShareDetails from './ShareDetails.vue';
import { getShareLink } from '@/utils/urlRewrite';
import { cancleShare } from '@/api/share';
import { useUserInfoStore } from '@/stores/userInfo';
import { serverError } from '@/utils/request';
let svgBasePath = "/src/assets/svg/"

let userInfoStore = useUserInfoStore()
let props = defineProps<{ files:shareResDto[] }>()
let emits = defineEmits<{reload:[]}>()
let curShareIndex = ref<number>(0)
    let notiShareShow = ref<boolean>(false)
let handleCancle = async(index:number) => {
    curShareIndex.value = index
    let res = await cancleShare(props.files[curShareIndex.value].shareId||'', userInfoStore.data?.token||'')
    if (res != serverError) {
            ElMessage({
                type: 'success',
                message: '取消分享成功'
            })
        }
    emits('reload')
}
let handleView = (index:number) => {
    curShareIndex.value = index
    notiShareShow.value = true
}
let handleCopyLink = () => {
    if (props.files[curShareIndex.value] != undefined) {
        let res = getShareLink(props.files[curShareIndex.value])
        navigator.clipboard.writeText(res);
    }
}
let transportedFiles = ref<TransportedFile[]>([])
let transfer = (list:shareResDto[]) => {
    list.forEach(item => {
        let temp:TransportedFile = {name:item.name, type:item.fileCategory, folderType:item.folderType, size:item.fileSize, createTime:item.createTime||'', shareId:item.shareId}
        transportedFiles.value.push(temp)
    });
}
transfer(props.files)
watch(() => props.files,() => {
    transportedFiles.value = []
    transfer(props.files)
})
</script>

<template>
    <div class="file-list-box">
        <FileRecord class="file-record" v-for="(item,index) in transportedFiles" :file="item">
            <template #tool-bar>
                <div class="button-bar">
                    <button @click="handleView(index)">
                        <div class="img-wrapper">
                            <img :src="svgBasePath + '/common/detail.svg'" />
                        </div>
                        <h2>查看详情</h2>
                    </button>
    
                    <button @click="handleCancle(index)">
                        <div class="img-wrapper">
                            <img :src="svgBasePath + '/dropdown/delete.svg'" />
                        </div>
                        <h2>取消分享</h2>
                    </button>
                </div>
            </template>
        </FileRecord>
    </div>
    <Teleport to="body">
        <Notification v-if="notiShareShow">
            <template #header>
                <div class="noti-header">
                    <img :src="svgBasePath + '/firstMenu/share.svg'" />
                    <h2>分享详情</h2>
                </div>
            </template>
            <template #content>
                <div class="noti-content">
                    <div class="share-box">
                        <ShareDetails :data="props.files[curShareIndex]" id="share-detail"></ShareDetails>
                        <div class="button-bar">
                            <button @click="handleCopyLink">复制链接</button>
                            <button @click="notiShareShow = false">确认</button>
                        </div>
                    </div>
                </div>
            </template>
        </Notification>
    </Teleport>
</template>

<style scoped lang="scss">
.file-list-box {
    width: 100%;
    .button-bar{
        display: flex;
        button {
            display: flex;
            align-items: center;
            border-radius: 8px;
            border: none;
            background-color: #52413722;
            color: #524137;
            padding: 6px 12px;
            margin-right: 42px;
    
            .img-wrapper {
                overflow: hidden;
                width: 21px;
                margin-right: 16px;
    
                img {
                    width: 100%;
                    position: relative;
                    left: -80px;
                    filter: drop-shadow(#524137 80px 0);
                }
            }
        }
    
        button:hover {
            background-color: #52413750;
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

.noti-content{
    display: flex;
    flex-direction: column;
    padding: 30px 50px;
    width: 320px;
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
}
</style>
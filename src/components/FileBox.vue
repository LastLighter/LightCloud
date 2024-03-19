<script setup lang="ts">
import type { ContextData, FileEntity } from '@/api/component/type'
import { onMounted, ref } from 'vue'
import ContextMenu from './ContextMenu.vue';
import { useCommonStore } from '@/stores/common'
import { useCurPathStore } from '@/stores/curPath';
import { deleteFile, getFileURL } from '@/api/file';
import { useUserInfoStore } from '@/stores/userInfo';
import { previewSuffix } from './preview/previewFileSuffix';
import { getFileSuffix } from '@/utils/calc';

const props = defineProps<{ item: FileEntity }>()
const emit = defineEmits<{ context: [data: ContextData], preview: [] }>()
let imgBasePath = '/src/assets/img/'
let svgBasePath = "/src/assets/svg/"
let curPathStore = useCurPathStore()

let isFolder = ref<boolean>(true)
let getFileIcon = (file: FileEntity) => {
    if (file.folderType == 1) {
        isFolder.value = true;
        return imgBasePath + 'folder.png'
    } else {
        isFolder.value = false;
        switch (file.fileCategory) {
            case 1:
                return svgBasePath + 'secondMenu/video.svg'
                break
            case 2:
                return svgBasePath + 'secondMenu/image.svg'
                break
            case 3:
                return svgBasePath + 'secondMenu/music.svg'
                break
            case 4:
                return svgBasePath + 'secondMenu/document.svg'
                break
            case 5:
                return svgBasePath + 'secondMenu/compress.svg'
                break
            case 6:
                return svgBasePath + 'secondMenu/another.svg'
                break
        }
    }
}
let tipShow = ref<boolean>(false)

let edgeOffsetX = 180
let edgeOffsetY = 120
let mouseoverHandler = (event: MouseEvent) => {
    tipShow.value = true

    if (event.clientX < window.innerWidth - edgeOffsetX) {
        leftPoi.value = event.clientX
    } else {
        leftPoi.value = event.clientX - edgeOffsetX
    }
    if (event.clientY < window.innerHeight - edgeOffsetY) {
        topPoi.value = event.clientY
    } else {
        topPoi.value = event.clientY - edgeOffsetY
    }
}
let mouseoutHandler = () => {
    tipShow.value = false
}
let leftPoi = ref<number>(0)
let topPoi = ref<number>(0)
let calcSizeExpression = (s: string) => {
    let size = Number(s)
    if (size < 1024n) {
        return `${size}B`
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)}KB`
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / 1024 / 1024).toFixed(2)}MB`
    }
}
let calcTypeExpression = (type: number) => {
    switch (type) {
        case 1:
            return '视频文件'
            break
        case 2:
            return '图片文件'
            break
        case 3:
            return '音频文件'
            break
        case 4:
            return '文档文件'
            break
        case 5:
            return '压缩文件'
            break
        case 6:
            return '未知类型'
            break
    }
}
let clacUpdateExpression = (updateTime: string) => {
    return updateTime.substring(0, updateTime.indexOf('T'))
}

let commonStore = useCommonStore()

let handleClick = () => {
    if (props.item.folderType == 1) {
        curPathStore.forward({ name: props.item.name, fid: props.item.fid })
    } else {
        let fid = props.item.fid
        let token = useUserInfoStore().data?.token || ''
        commonStore.curContextFile = props.item

        if (previewSuffix.includes(getFileSuffix(props.item.name))) {
            commonStore.curPreviewFile = getFileURL(token, fid, 'other')
            emit('preview')
        } else {
            ElMessage({
                type: 'error',
                message: '文件类型不支持预览,请下载后查看'
            })
        }
    }
}
let contextClick = (event: MouseEvent) => {
    emit('context', { file: props.item, x: event.clientX, y: event.clientY })
}

</script>

<template>
    <div class="container" @mouseover="mouseoverHandler" @mouseout="mouseoutHandler" @contextmenu.prevent="contextClick"
        @click="handleClick">
        <div class="file-icon-wrapper">
            <img :src="getFileIcon(item)" :class="{ smaller: !isFolder }" />
        </div>
        <h4>{{ props.item.name }}</h4>
        <div class="tool-tip" v-show="tipShow" :style="{ top: `${topPoi}px`, left: `${leftPoi}px` }">
            <div class="tip-text" v-if="props.item.folderType == 0">文件大小：{{ calcSizeExpression(props.item.fileSize) }}
            </div>
            <div class="tip-text" v-if="props.item.folderType == 0">文件类型：{{ calcTypeExpression(props.item.fileCategory)
                }}
            </div>
            <div class="tip-text">上次更新: {{ clacUpdateExpression(props.item.lastUpdateTime) }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    padding: 10px;
    width: 100%;
    height: 100%;

    .file-icon-wrapper {
        width: 120px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        // margin: 20px;
        img {
            width: 120px;
        }

        .smaller {
            width: 50px;
            // margin-bottom: 35px;
        }
    }

    h4 {
        color: #524137;
        max-width: 175px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .tool-tip {
        position: absolute;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        width: 160px;
        background-color: #f3f3f3;
        border: 1px solid #524137;

        .tip-text {
            display: flex;
            font-size: 13px;
            align-items: center;
            height: 18px;
        }
    }
}

.container:hover {
    background-color: #e3e3e3;
}
</style>
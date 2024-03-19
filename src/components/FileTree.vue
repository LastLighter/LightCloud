<script setup lang="ts">
import { ref } from 'vue'
import type { FileEntity, ToggleFileEntity } from '@/api/component/type';
import { reqListDir } from '@/api/file';
import { useUserInfoStore } from '@/stores/userInfo';
import { useCommonStore } from '@/stores/common'

let props = defineProps<{ fid: string }>()
let fileList = ref<ToggleFileEntity[]>([])
let svgBasePath = "/src/assets/svg/"
let imgBasePath = '/src/assets/img/'
let commonStore = useCommonStore()

let load = async () => {
    let uid = useUserInfoStore().data?.uid
    let files = await reqListDir({ userId: uid, fileParent: props.fid, page: 1, pageSize: 50 })
    files.forEach((item) => {
        let toggleFile: ToggleFileEntity = { file: item, expand: false }
        fileList.value.push(toggleFile)
    })
}
if(props.fid != '-1'){
    load()
}else{
    fileList.value = [{
        file:{fid:'0', name:'我的网盘',folderType:1} as FileEntity,
        expand: false
    }]
}
</script>

<template>
    <div class="tree-container">
        <div class="file-line-wrapper" v-for="item in fileList">
            <div class="file-line-box" :class="{ 'line-active': commonStore.getSelectedDirFid() == item.file.fid }"
                @click="commonStore.curSelectedDir = item.file">
                <div class="img-wrapper" @click="item.expand = !item.expand" :class="{ 'arrow-Active': item.expand }">
                    <img :src="svgBasePath + '/common/arrow.svg'" />
                </div>
                <div class="file-item-box">
                    <img :src="imgBasePath + '/folder.png'" />
                    <h2>{{ item.file.name }}</h2>
                </div>
            </div>
            <div class="child-tree-box" v-if="item.expand">
                <FileTree :fid="item.file.fid"></FileTree>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.tree-container {
    .file-line-wrapper {
        .file-line-box {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-left: 15px;

            .img-wrapper {
                overflow: hidden;
                width: 12px;
                margin-right: 15px;
                transition: all 0.3s ease;

                img {
                    width: 100%;
                    position: relative;
                    left: -80px;
                    filter: drop-shadow(#524137 80px 0);
                }
            }

            .arrow-Active {
                transform: rotate(90deg);
            }

            .img-wrapper:hover {
                img {
                    filter: drop-shadow(#00A2E8 80px 0);
                }
            }

            .file-item-box {
                cursor: default;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px 10px;
                box-sizing: border-box;
                border: 1px solid transparent;

                img {
                    width: 21px;
                    margin-right: 8px;
                }

                h2 {
                    color: #424137;
                }
            }

            .file-item-box:hover {
                border-radius: 4px;
                border: 1px solid #524137;
                background-color: #00A2E820;
            }
        }

        .line-active {
            background-color: #00A2E850;
            border-radius: 8px
        }

        .child-tree-box {
            margin-left: 20px;
        }
    }
}</style>
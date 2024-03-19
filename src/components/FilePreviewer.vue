<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { calcIcon, getFileSuffix } from '@/utils/calc';
import { computed } from 'vue'
import DefaultPreviewer from './preview/DefaultPreviewer.vue';

const TEXTSUFFIX = ['txt', 'md', 'json']
const PDFSUFFIX = 'pdf'

let commonStore = useCommonStore()
let props = defineProps<{ name: string }>()
let emits = defineEmits<{close:[]}>()
let suffix = computed(() => getFileSuffix(commonStore.curContextFile?.name || ''))
let svgBasePath = "/src/assets/svg/"

let handleClose = () => {
    emits('close')
}
</script>

<template>

    <Teleport to="body">
        <Notification>
            <template #header>
                <div class="noti-header">
                    <div class="img-wrapper">
                        <img :src="svgBasePath + calcIcon(commonStore.curContextFile?.fileCategory||0)" />
                    </div>
                    <h2>{{ props.name }}</h2>
                    <div class="close-box" @click="handleClose">
                        <div class="img-wrapper">
                            <img :src="svgBasePath + '/common/close.svg'" />
                        </div>
                    </div>
                </div>
            </template>

            <template #content>
                <div class="noti-content">
                    <DefaultPreviewer></DefaultPreviewer>
                </div>
            </template>
        </Notification>
    </Teleport>
</template>

<style scoped lang="scss">
.noti-header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .img-wrapper {
        overflow: hidden;
        width: 24px;
        margin-right: 20px;

        img {
            width: 100%;
            position: relative;
            left: -80px;
            filter: drop-shadow(#524137 80px 0);
        }
    }

    h2 {}
    .close-box{
        position: absolute;
        right: 40px;

        .img-wrapper:hover {
            img{
                filter: drop-shadow(#00A2E8 80px 0);
            }
        }
    }
}

.noti-content {
    width: 1310px;
    height: 740px;
    padding: 10px 15px;
}
</style>./preview/DefaultPreview.vue
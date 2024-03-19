<script setup lang="ts">
import { setUploadRecord } from '@/api/local';
import FileRecord from './FileRecord.vue';
import type { TransportedFile } from '@/api/local/type';
let svgBasePath = "/src/assets/svg/"


let props = defineProps<{ files:TransportedFile[] }>()
let emits = defineEmits<{delete:[index:number]}>()
let handleDelete = (index:number) => {
    emits('delete', index)
}
</script>

<template>
    <div class="file-list-box">
        <FileRecord class="file-record" v-for="(item,index) in props.files" :file="item">
            <template #tool-bar>
                <button @click="handleDelete(index)">
                    <div class="img-wrapper">
                        <img :src="svgBasePath + '/dropdown/delete.svg'" />
                    </div>
                    <h2>删除记录</h2>
                </button>
            </template>
        </FileRecord>
    </div>
</template>

<style scoped lang="scss">
.file-list-box {
    width: 100%;

    button {
        display: flex;
        align-items: center;
        border-radius: 8px;
        border: none;
        background-color: #52413722;
        color: #524137;
        padding: 4px 12px;

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
    }

    button:hover {
        background-color: #52413750;
    }
}
</style>
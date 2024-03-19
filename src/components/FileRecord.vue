<script setup lang="ts">
import type { TransportedFile } from '@/api/local/type';
import { transferLocalDate } from '@/utils/date';
import { calcIcon, calcSize } from '@/utils/calc';

let svgBasePath = "/src/assets/svg/"
let imgBasePath = '/src/assets/img/'
let props = defineProps<{ file: TransportedFile }>()


let createTime = props.file.createTime.includes('T')?transferLocalDate(props.file.createTime):props.file.createTime
</script>

<template>
    <div class="record-container">
        <div class="left-entry">
            <div class="img-wrapper">
                <img :src="svgBasePath + calcIcon(props.file.type)" class="svg" v-if="props.file.folderType == 0"/>
                <img :src="imgBasePath + 'folder.png'" class="img" v-if="props.file.folderType == 1"/>
            </div>
            <div class="file-info">
                <h2>{{ props.file.name }}</h2>
                <h3>{{ calcSize(props.file.size)||'' }} </h3>
            </div>
        </div>
        <div class="create-time">
            <h3>{{ createTime }}</h3>
        </div>
        <div class="right-entry">
            <slot name="tool-bar"></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.record-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #B97A5720;
    margin-bottom: 15px;
    border-radius: 12px;
    padding: 10px 30px;
    position: relative;
    box-shadow: 4px 4px 6px #52413710;
    color: #524137;
    border: 1px solid transparent;
    .left-entry {
        display: flex;
        align-items: center;
        margin-right: 280px;
        .img-wrapper {
            overflow: hidden;
            width: 32px;
            margin-right: 20px;

            .img {
                width: 140%;
                position: relative;
                left: -20%;
                // left: -80px;
                // filter: drop-shadow(#524137 80px 0);
            }

            .svg {
                width: 100%;
                position: relative;
                left: -80px;
                filter: drop-shadow(#524137 80px 0);
            }
        }
        .file-info{
            display: flex;
            flex-direction: column;
            line-height: 16px;
            h2{
                cursor: default;
                font-size: 15px;
                font-weight: 520;
                margin-bottom: 15px;
            }
            h3{
                cursor: default;
                font-size: 13px;
            }
        }
    }
    .create-time{
        font-size: 13px;
        cursor: default;
        position: absolute;
        left: 500px;
    }
}
.record-container:hover{
    border: 1px solid #C8BFE7;
    background-color: #B97A5740;
}
</style>
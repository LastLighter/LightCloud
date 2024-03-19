<script setup lang="ts">
import type { FilePath } from '@/api/component/type';
import { useCurPathStore } from '@/stores/curPath'

let svgBasePath = "/src/assets/svg/"
let curPathStore = useCurPathStore()
let handleItemClick = (index:number) => {
    curPathStore.back(index)
}
</script>

<template>
    <div class="bread-container">
        <div class="base" v-for="(item, index) in curPathStore.data" @click="handleItemClick(index)">
            <div class="base-text">{{ item.name }}</div>
            <div class="img-wrapper">
                <img :src="svgBasePath + '/common/arrow.svg'" v-if="index < curPathStore.data.length - 1" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.bread-container {
    display: flex;
    justify-content: center;
    min-width: max-content;
    .base {
        display: flex;
        align-items: center;

        .base-text {
            margin: 0px 20px;
            cursor: pointer;
        }
        .base-text:hover{
            color: #00A2E8;
        }

        .img-wrapper {
            overflow: hidden;
            width: 12px;

            img {
                width: 100%;
                position: relative;
                left: -80px;
                filter: drop-shadow(#524137 80px 0);
            }
        }
    }
}
</style>
<script setup lang="ts">
import type { DropDownItem } from '@/api/component/type';
import { useCommonStore } from '@/stores/common';

let props = defineProps<{ menus: DropDownItem[] }>()
let svgBasePath = "/src/assets/svg"
let commonStore = useCommonStore()

let handleClick = (item:DropDownItem) => {
    commonStore.dropdownShow = false
    item.handler()
}
</script>

<template>
    <div class="dropdowns-container">
        <a class="menu-item-box" v-for="item in props.menus" @click="handleClick(item)">
            <div class="img-wrapper">
                <img :src="svgBasePath + item.iconPath" />
            </div>
            <h2>{{ item.name }}</h2>
        </a>
    </div>
</template>

<style scoped lang="scss">
.dropdowns-container {
    display: flex;
    flex-direction: column;
    background-color: #f3f3f3;
    padding: 15px 18px;
    border-radius: 6px;
    box-shadow: 2px 2px 12px#52413780;
    .menu-item-box {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 27px;
        margin:6px 0px;
        width: 120px;
        border-radius: 6px;
        .img-wrapper {
            overflow: hidden;
            width: 16px;
            margin-right: 15px;

            img {
                width: 100%;
                position: relative;
                left: -80px;
                filter: drop-shadow(#524137 80px 0);
            }
        }
        h2{
            font-size: 14px;
            letter-spacing: 2px;
        }
    }
    .menu-item-box:hover{
        background-color: #52413730;
    }
}
</style>
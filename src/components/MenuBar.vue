<script setup lang="ts">
import type { Menu } from '@/api/component/type'
import { ref } from 'vue';

const props = defineProps<{ menuList: Menu[] }>()
const emit = defineEmits<{
    select: [index: number]
}>()
let curFocus = ref<number>(0)
let clickHandler = (num: number) => {
    curFocus.value = num
    emit('select',num)
}
</script>

<template>
    <div class="menu-bar">
        <div class="menu-box" v-for="(item, index) in props.menuList" @click="clickHandler(index)"
            :class="{ 'menu-active': curFocus == index }">
            <div class="img-wrapper">
                <img :src="item.menuIcon" />
            </div>
            <h4>{{ item.menuName }}</h4>
        </div>
    </div>
</template>

<style scoped lang="scss">
.menu-bar {
    padding: 40px 25px;
    border-right: 1px solid #e3e3e3;

    .menu-box {
        display: flex;
        align-items: center;
        padding: 14px 25px;
        cursor: pointer;
        border-radius: 7px;
        margin-bottom: 15px;

        // background-color: #e3e3e3;
        .img-wrapper {
            overflow: hidden;
            width: 21px;
            margin-right: 25px;

            img {
                width: 100%;
                position: relative;
                left: -80px;
                filter: drop-shadow(#524137 80px 0);
            }
        }

        h4 {
            font-size: 13px;
        }
    }

    .menu-box:hover {
        background-color: #52413718;
    }

    .menu-active {
        background-color: #52413712;
        h4 {
            color: #00A2E8;
        }

        .img-wrapper {
            img {
                filter: drop-shadow(#00A2E8 80px 0);
            }
        }
    }
}
</style>
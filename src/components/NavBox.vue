<script setup lang="ts">
let svgBasePath = "/src/assets/svg/"

const emits = defineEmits<{
    operation: [index: number]
}>()
let clickhandler = (num:number) => {
    emits('operation',num)
}
</script>

<template>
    <div class="nav-box">
        <div class="img-wrapper reversal" @click="clickhandler(0)">
            <img class="left-arrow" :src="svgBasePath + '/common/arrow.svg'" />
        </div>
        <!-- <div class="img-wrapper" @click="clickhandler(1)">
            <img class="right-arrow" :src="svgBasePath + '/common/arrow.svg'" />
        </div> -->
        <div class="img-wrapper" @click="clickhandler(1)">
            <img class="refresh" :src="svgBasePath + '/common/refresh.svg'" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.nav-box {
    display: flex;
    border-right: 1px solid #e3e3e3;
    height: 42px;

    .img-wrapper {
        display: flex;
        justify-content: center;
        overflow: hidden;
        width: 50px;
        cursor: pointer;

        img {
            width: 21px;
            position: relative;
            left: -80px;
            filter: drop-shadow(#524137 80px 0);
        }
    }

    .img-wrapper:hover {
        img {
            filter: drop-shadow(#00A2E8 80px 0);
        }
    }

    .reversal {
        transform: rotate(180deg);
    }
}
</style>
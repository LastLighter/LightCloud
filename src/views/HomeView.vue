<script setup lang="ts">
import DropDown from '@/components/DropDown.vue';
import router from '@/router';
import { ref, watch } from 'vue';
import { useCommonStore } from '@/stores/common';
import Notification from '@/components/Notification.vue';
import CloudHeader from '@/components/CloudHeader.vue';

let imgBasePath = '/src/assets/img/'
let svgBasePath = "/src/assets/svg/"

//当前选中的菜单
let curFocus = ref<number>(0)
let clickMenu = (num: number) => {
    curFocus.value = num
    if (num == 0) {
        router.push('/main')
    } else if (num == 1) {
        router.push('/transport')
    } else if (num == 2) {
        router.push('/share')
    } else if (num == 3) {
        router.push('/recycle')
    }
}

let commonStore = useCommonStore()



</script>

<template>
    <div id="container">
        <CloudHeader></CloudHeader>
        <div class="content">
            <div class="left-entry">
                <div class="home-page-box base-first-menu" :class="{ 'base-menu-active': curFocus == 0 }"
                    @click="clickMenu(0)">
                    <div class="img-wrapper">
                        <img :src="svgBasePath + 'firstMenu/mainPage.svg'" />
                    </div>
                    <h2>首页</h2>
                </div>
                <div class="download-box base-first-menu" :class="{ 'base-menu-active': curFocus == 1 }"
                    @click="clickMenu(1)">
                    <div class="img-wrapper">
                        <img :src="imgBasePath + 'transport.png'" />
                    </div>
                    <h2>传输</h2>
                </div>
                <div class="share-box base-first-menu" :class="{ 'base-menu-active': curFocus == 2 }"
                    @click="clickMenu(2)">
                    <div class="img-wrapper">
                        <img :src="svgBasePath + 'firstMenu/share.svg'" />
                    </div>
                    <h2>分享</h2>
                </div>
                <div class="recycle-bin--box base-first-menu" :class="{ 'base-menu-active': curFocus == 3 }"
                    @click="clickMenu(3)">
                    <div class="img-wrapper">
                        <img :src="svgBasePath + 'firstMenu/recycleBin.svg'" />
                    </div>
                    <h2>回收站</h2>
                </div>
            </div>
            <div class="right-entry">
                <RouterView></RouterView>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
#container {
    .content {
        // margin-top: 60px;
        overflow: auto;
        line-height: 0;
        height: calc(100vh - 96px);
        display: flex;

        // height: 460px;
        .left-entry {
            height: calc(100% - 10px);
            width: 120px;
            box-shadow: 4px 2px 12px #e3e3e3;
            padding-top: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .base-first-menu {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 30px;
                padding: 12px 10px;
                width: 70px;
                border-radius: 10px;
                cursor: pointer;

                h2 {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #524137;
                }

                .img-wrapper {
                    overflow: hidden;

                    img {
                        position: relative;
                        height: 36px;
                        left: -80px;
                        filter: drop-shadow(#524137 80px 0);
                    }
                }
            }

            .base-first-menu:hover {
                background-color: #52413718;
            }

            .base-menu-active {
                background-color: #52413712;

                h2 {
                    color: #00A2E8;
                }

                .img-wrapper {
                    img {
                        filter: drop-shadow(#00A2E8 80px 0);
                    }
                }
            }
        }

        .right-entry {
            width: 100%;
            overflow: scroll;
        }
    }
}

</style>
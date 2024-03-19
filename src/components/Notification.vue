<script setup lang="ts">

</script>

<template>
    <div class="bg">
        <div class="noti-window">
            <div class="header">
                <slot name="header"></slot>
            </div>
            <div class="content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: #52413750;
    display: flex;
    justify-content: center;
    align-items: center;

    .noti-window {
        // width: 400px;
        // height: 400px;
        border-radius: 12px;
        background-color: #f3f3f3;
        box-shadow: 4px 6px 9px #52413750;

        .header {
            border-bottom: 1px solid #e3e3e3;
            display: flex;
            align-items: center;
            min-height: 50px;
        }
    }
}
</style>
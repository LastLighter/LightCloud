<script setup lang="ts">
import { watch, ref, computed } from 'vue';

let props = defineProps<{cur:number}>()
let curPercent = computed(() => props.cur)
</script>

<template>
<div class="progress-container">
    <div class="cur-progress progress-bar" :style="{width:curPercent + '%'}"></div>
    <div class="total-progress progress-bar" :style="{width:(100 - curPercent) + '%'}"></div>
</div>
</template>

<style scoped lang="scss">
.progress-container{
    width: 100%;
    display: flex;
    .progress-bar{
        height: 16px;
    }
    .cur-progress{
        background-color: #00A2E8;
        border-radius: 7px 0px 0px 7px;
    }
    .total-progress{
        background-color: #e3e3e3;
        border-radius: 0 7px 7px 0;
    }
}
</style>
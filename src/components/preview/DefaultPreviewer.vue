<script setup lang="ts">
import { useCommonStore } from '@/stores/common';

let commonStore = useCommonStore()
</script>

<template>
    <iframe :src="commonStore.curPreviewFile">
    </iframe>
</template>

<style scoped lang="scss">
iframe {
    width: 100%;
    height: 100%;
}
// body{
//     display: flex;
//     align-items: center;
//     justify-content: center;
// }
</style>
<script setup lang="ts">
import type { TransportedFile } from '@/api/local/type';
import { listShare } from '@/api/share';
import type { shareResDto } from '@/api/share/type';
import FileShareList from '@/components/FileShareList.vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { ref } from 'vue'

let userInfoStore = useUserInfoStore()
let curPage = ref<number>(1)
const pageSize = 10
let shareFiles = ref<shareResDto[]>([])
let load = async() => {
    let res = await listShare({token:userInfoStore.data?.token||'', page:curPage.value||0, pageSize:pageSize})
    shareFiles.value = res
}
load()
</script>

<template>
<div class="share-list-container">
    <FileShareList :files="shareFiles" @reload="load()"></FileShareList>
</div>
</template>

<style scoped lang="scss">
.share-list-container{
    padding: 21px 32px;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import MenuBar from '@/components/MenuBar.vue';
import transportMenu from './transportMenu';
import FileRecordList from '@/components/FileRecordList.vue';
import { getDownloadRecord, getUploadRecord, setUDownloadRecord, setUploadRecord } from '@/api/local';
import type { TransportedFile } from '@/api/local/type';

let curList = ref<TransportedFile[]>()
curList.value = getUploadRecord()

let curMenu = ref<number>(0)
let handleSelect = (index:number) => {
    curMenu.value = index
    if(curMenu.value == 0){
        curList.value = getUploadRecord()
    }else if(curMenu.value == 1){
        curList.value = getDownloadRecord()
    }
}
let handleListDelete = (index:number) => {
    let temp = curList.value as TransportedFile[]
    temp.splice(index,1)
    if(curMenu.value == 0){
        setUploadRecord(temp)
    }else if(curMenu.value == 1){
        setUDownloadRecord(temp)
    }
}
</script>

<template>
    <div class="transport-container">
        <div class="left-entry">
            <MenuBar :menuList="transportMenu" class="menus" @select="handleSelect"></MenuBar>
        </div>
        <div class="right-entry">
            <FileRecordList :files="curList" @delete="handleListDelete"></FileRecordList>
        </div>
    </div>
</template>

<style scoped lang="scss">
.transport-container{
    display: flex;
    .left-entry{
        padding: 15px 20px;
        .menus{
            width: fit-content;
        }
    }
    .right-entry{
        padding:20px 60px;
        flex-grow: 1;
    }
}
</style>
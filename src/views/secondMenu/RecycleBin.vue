<script setup lang="ts">
import type { FileEntity } from '@/api/component/type';
import { deleteFile, listRecycle, restore } from '@/api/file';
import FileTable from '@/components/FileTable.vue';
import { useCommonStore } from '@/stores/common';
import { useFileStore } from '@/stores/file';
import { useUserInfoStore } from '@/stores/userInfo';
import { serverError } from '@/utils/request';
import { ref } from 'vue';

let svgBasePath = "/src/assets/svg/"
let userInfoStore = useUserInfoStore()
let commonStore = useCommonStore()
let fileStore = useFileStore()
let files = ref<FileEntity[]>([])
let load = async () => {
    let res = await listRecycle(userInfoStore.data?.token || '')
    if ((res as string) == serverError) {
        ElMessage({
            type: 'error',
            message: '加载回收站数据失败'
        })
        return
    }
    files.value = (res as FileEntity[])
}
load()

let handleDelete = () => {
    let successed = true
    if (fileStore.checkedFidArr.length == 0) {
        ElMessage({
            type: 'error',
            message: '没有任何文件被选中'
        })
        return
    }
    fileStore.checkedFidArr.forEach(async (item) => {
        let res = await deleteFile({ fid: item, token: userInfoStore.data?.token || '' })
        if (res == serverError) {
            ElMessage({
                type: 'error',
                message: '删除文件失败'
            })
            successed = false
        }
    })
    if (successed) {
        ElMessage({
            type: 'success',
            message: '删除文件成功'
        })
    }
    setTimeout(() => {
        load()
        useUserInfoStore().reloadUserInfo()
    }, 1200)
}

let handleRestore = () => {
    let successed = true
    if (fileStore.checkedFidArr.length == 0) {
        ElMessage({
            type: 'error',
            message: '没有任何文件被选中'
        })
        return
    }
    fileStore.checkedFidArr.forEach(async (item) => {
        let res = await restore(userInfoStore.data?.token || '', item)
        if (res == serverError) {
            ElMessage({
                type: 'error',
                message: '还原文件失败'
            })
            successed = false
        }
    })
    if (successed) {
        ElMessage({
            type: 'success',
            message: '还原文件成功'
        })
    }
    setTimeout(() => {
        load()
    }, 1200)
}
</script>

<template>
    <div id="content">
        <div class="header">
            <button id="restore" @click="handleRestore">
                <div class="img-wrapper">
                    <img :src="svgBasePath + 'common/return.svg'" />
                </div>
                <h2>还原文件</h2>
            </button>
            <button id="delete" @click="handleDelete">
                <div class="img-wrapper">
                    <img :src="svgBasePath + 'dropdown/delete.svg'" />
                </div>
                <h2>删除文件</h2>
            </button>
        </div>
        <div class="file-table-box">
            <FileTable :files="files"></FileTable>
        </div>
    </div>
</template>

<style scoped lang="scss">
#content {
    display: flex;
    flex-direction: column;
    padding: 20px 68px;

    .header {
        margin-bottom: 20px;
        padding: 12px 24px;
        display: flex;

        button {
            padding: 13px 27px;
            border-radius: 18px;
            display: flex;
            align-items: center;

            .img-wrapper {
                overflow: hidden;
                width: 24px;
                margin-right: 10px;

                img {
                    width: 100%;
                    position: relative;
                    left: -80px;
                    filter: drop-shadow(#524137 80px 0);
                }
            }
        }

        #restore {
            border: none;
            background-color: #FFC90E;
            color: #524137;
            margin-right: 64px;
        }

        #restore:hover {
            background-color: #FFC90E80;
        }

        #delete {
            border: none;
            background-color: #B97A57;
            color: #524137;
        }

        #delete:hover {
            background-color: #B97A5780;
        }
    }

    .file-table-box {}
}
</style>
<script setup lang="ts">
import type { FileEntity } from '@/api/component/type';
import FileLine from './FileLine.vue';
import { ref, watch } from 'vue'
import { useFileStore } from '@/stores/file';


let props = defineProps<{ files: FileEntity[] }>()
let isChecked = ref<boolean>(false)
let fileStore = useFileStore()
let checkedArr = ref<boolean[]>([])
for (let i = 0; i < props.files.length; ++i) {
    checkedArr.value.push(false)
}
let handleCheckChange = (event: Event) => {
    checkedArr.value.forEach((item, index) => {
        checkedArr.value[index] = isChecked.value
    })
    let list = getSelectedFidList()
    fileStore.checkedFidArr = list
}

let getSelectedFidList = () => {
    let res: string[] = []
    for (let i = 0; i < checkedArr.value.length; ++i) {
        if (checkedArr.value[i] == true) {
            res.push(props.files[i].fid)
        }
    }
    return res
}

let handleUpdate = (index: number) => {
    checkedArr.value[index] = !checkedArr.value[index]
    let list = getSelectedFidList()
    fileStore.checkedFidArr = list
}
watch(() => props.files, () => {
    checkedArr.value = []
    for (let i = 0; i < props.files.length; ++i) {
        checkedArr.value.push(false)
    }
    let list = getSelectedFidList()
    fileStore.checkedFidArr = list
})
</script>

<template>
    <div class="file-table">
        <div class="header">
            <input type="checkbox" v-model="isChecked" @change="handleCheckChange">
            <h2 id="file-name">文件名</h2>
            <h2 id="file-time">创建时间</h2>
            <h2 id="file-size">文件大小</h2>
        </div>
        <div class="content">
            <FileLine v-for="(item, index) in props.files" :file="item" :checked="checkedArr[index]"
                @update-check="handleUpdate(index)"></FileLine>
        </div>
    </div>
</template>

<style scoped lang="scss">
.file-table {
    width: 100%;

    .header {
        display: flex;
        padding: 12px 30px;
        align-items: center;

        input[type="checkbox"] {
            margin: 0px;
            margin-right: 100px;
            transform: scale(1.5);
        }

        h2 {
            color: #524137;
            // font-weight: 550;
        }

        #file-name {
            margin-right: 340px;
        }

        #file-time {
            margin-right: 210px;
        }
    }
}
</style>
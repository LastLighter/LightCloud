<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type{PageItem} from '@/api/component/type'

let props = defineProps<{ page: number, total: number, pageSize: number }>()
let emits = defineEmits<{ pageUpdate: [page: number] }>()
let pageLength = 5
let svgBasePath = "/src/assets/svg/"
let totalPage = 0

let pages = ref<PageItem[]>([])
let updatePage = (page: number) => {
    buildPages()
    emits('pageUpdate', page)
}
let getPageNum = (curPage:number, offset:number, pageLength:number) => {
    let offCenter = curPage - Math.floor(pageLength/2) - 1
    if(offCenter >= 0){
        return offset + offCenter
    }else {
        return offset
    }
}
let buildPages = () => {
    totalPage = Math.ceil(props.total/props.pageSize)
    if(totalPage == 0){
        totalPage += 1
    }
    pages.value = []
    for(let i=1; i<= pageLength; ++i){
        let num = getPageNum(props.page, i, pageLength)
        if(num <= totalPage){
            pages.value.push({name:String(num), page:num})
        }else {
            break
        }
    } 
}  
onMounted(() => {
    buildPages()
})
watch(props, () => {
    buildPages()
})

</script>

<template>
    <div class="page-selector-container">
        <div class="img-wrapper left-arrow" @click="updatePage(props.page - 1)">
            <img :src="svgBasePath + '/common/arrow.svg'" />
        </div>
        <div class="page-box" :class="{'page-active':props.page == item.page}" v-for="item in pages" @click="updatePage(item.page)">
            <h2>{{ item.name }}</h2>
        </div>
        <div class="img-wrapper right-arrow" @click="updatePage(props.page + 1)">
            <img :src="svgBasePath + '/common/arrow.svg'" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.page-selector-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 40px;

    .page-box{
        width: 27px;
        height: 27px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #52413730;
        margin-right: 20px;
        cursor: default;
        h2{
            color: #524137;
        }
    }
    .page-box:hover{
        background-color: #00A2E860;
    }
    .page-active{
        h2{
            color: #e3e3e3;
        }
        background-color: #00A2E8;
    }

    .img-wrapper {
        overflow: hidden;
        width: 21px;

        img {
            width: 100%;
            position: relative;
            left: -80px;
            filter: drop-shadow(#524137 80px 0);
        }
    }
    .img-wrapper:hover{
        img{
            filter: drop-shadow(#00A2E8 80px 0);
        }
    }

    .left-arrow{
        transform: rotate(180deg);
        margin-right: 20px;
    }
    .right-arrow{

    }

}
</style>
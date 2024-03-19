<script setup lang="ts">
import type { ShareEntity, shareResDto } from '@/api/share/type';
import { transferLocalDate } from '@/utils/date';
import { getShareURL } from '@/utils/urlRewrite';

let props = defineProps<{data:shareResDto}>()
let url = getShareURL(props.data.shareId||'')
</script>

<template>
<div class="share-details-box">
    <div class="url-box line-box">
        <h3>链接：</h3>
        <div class="url-info text-info">
            {{ url }}
        </div>
    </div>
    <div class="code-box line-box">
        <h3>分享码：</h3>
        <div class="url-info text-info">
            {{ props.data.code }}
        </div>
    </div>
    <div class="name-box line-box">
        <h3>文件名：</h3>
        <div class="name-info text-info">
            {{ props.data.name }}
        </div>
    </div>
    <div class="view-box line-box">
        <h3>文件夹类型：</h3>
        <div class="view-info text-info">
            {{ props.data.folderType == 0?'文件':'文件夹' }}
        </div>
    </div>
    <div class="view-box line-box">
        <h3>创建时间：</h3>
        <div class="view-info text-info">
            {{ transferLocalDate(props.data.createTime||'') }}
        </div>
    </div>
    <div class="view-box line-box">
        <h3>访问次数：</h3>
        <div class="view-info text-info">
            {{ props.data.view }}
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">
.share-details-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #524137;
    .line-box{
        display: flex;
        align-items: center;
        height: 24px;
        h3{
            font-size: 14px;
            font-weight: 550;
        }
        .text-info{
            font-size: 14px;
            max-width: 240px;
        }
    }
}
</style>
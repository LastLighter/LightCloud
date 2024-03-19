import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FilePath } from '@/api/component/type'

export const useCurPathStore = defineStore('curPath', () => {
  let data = ref<FilePath[]>([{ name: '我的网盘', fid: '0' }])

  let getFid = () => {
    let arr = data.value
    return arr[arr.length - 1].fid
  }

  let back = (index?: number) => {
    if (index != undefined) {
        data.value.splice(index + 1)
    }
    else {
      if (data.value?.length > 1)
        data.value.pop()
      else {
        ElMessage({
          type: 'error',
          message: '无法从根目录回退'
        })
      }
    }
  }

  let forward = (item:FilePath) => {
    data.value.push(item)
  }

  return { data, getFid, back, forward }
})

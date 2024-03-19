import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FileEntity } from '@/api/component/type'
import type { ShareEntity } from '@/api/share/type'

export const useCommonStore = defineStore('common', () => {
    let curContextFile = ref<FileEntity|null>()
    let curPreviewFile = ref<string>('')
    let contextMenuShow = ref<boolean>(false)
    let curSelectedDir = ref<FileEntity|null>()
    let updateNameShow = ref<boolean>(false)
    let dropdownShow = ref<boolean>(false)
    let curContextShareInfo:ShareEntity|null = null;
    let getSelectedDirFid = () => {
      if(curSelectedDir.value != null){
        return curSelectedDir.value.fid
      }else {
        return 'undefined'
      }
    }

  return { curContextFile,contextMenuShow,curSelectedDir,getSelectedDirFid,updateNameShow,dropdownShow,curContextShareInfo,curPreviewFile }
})

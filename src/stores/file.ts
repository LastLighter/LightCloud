import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFileStore = defineStore('file', () => {
  let checkedFidArr = ref<string[]>([])


  return { checkedFidArr }
})

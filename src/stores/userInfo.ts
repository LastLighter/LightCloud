import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfo } from '@/api/common/type'
import { AvatarURL, getByToken } from '@/api/user';

export const useUserInfoStore = defineStore('userInfo', () => {
  let info;
  let data = ref<UserInfo>()
  let defaultAvatar = '/src/assets/img/logo.png'
  let avatarURL = ref<string | null>(null)
  let loadIcon = () => {
    if (data.value?.avatarName != null) {
      avatarURL.value = AvatarURL + '/' + data.value?.uid
    } else {
      avatarURL.value = defaultAvatar
    }
  }
  loadIcon()
  let reloadUserInfo = async () => {
    let temp = data.value?.token || ''
    let res = await getByToken(temp)
    data.value = res
    data.value.token = temp
    localStorage.setItem('userInfo', JSON.stringify(res))
  }
  try {
    info = JSON.parse(localStorage.getItem('userInfo') || '{}') as UserInfo
  } catch (err) {
    info = ''
  }
  data.value = info
  loadIcon()

  return { data, reloadUserInfo, avatarURL }
})

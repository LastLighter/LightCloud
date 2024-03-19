import type{ DropDownItem } from "@/api/component/type"
import { logout, uploadAvatar } from "@/api/user"
import { useCommonStore } from "@/stores/common"
import { useUserInfoStore } from "@/stores/userInfo"
import router from '@/router';
import { serverError } from "@/utils/request";

export default [{
    name:'修改昵称',
    iconPath:'/dropDown/rename.svg',
    handler:() => {
        let commonStore = useCommonStore()
        commonStore.updateNameShow = true
    }
},{
    name:'修改头像',
    iconPath:'/common/updateAvatar.svg',
    handler:() => {
        // 创建一个 input 元素
    const inputElement = document.createElement('input');
    
    // 设置 input 类型为文件选择
    inputElement.type = 'file';
    
    // 设置该 input 元素为不可见
    inputElement.style.display = 'none';
    
    // 监听 input 元素的 change 事件
    inputElement.addEventListener('change', async(event:Event) => {
        const selectedFile = (event.target as HTMLInputElement).files[0] as File;
        // 在这里可以对用户选择的文件进行处理
        let res = await uploadAvatar(selectedFile, useUserInfoStore().data?.token||'')
        if((res as string) == serverError){
            return
        }
        ElMessage({
            type: 'success',
            message: '修改头像成功'
        })
        setTimeout(() => {
            useUserInfoStore().reloadUserInfo()
            let temp = useUserInfoStore().avatarURL
            useUserInfoStore().avatarURL = temp + '?' + String(new Date().getTime())
        },1800)
    });
    
    // 将 input 元素添加到页面中
    document.body.appendChild(inputElement);
    
    // 模拟用户点击 input 元素来选择文件
    inputElement.click();
    }
},{
    name:'退出登录',
    iconPath:'/common/logout.svg',
    handler:() => {
        let userInfoStore = useUserInfoStore()
        logout(userInfoStore.data?.token||'')
        //清除本地缓存
        userInfoStore.data = undefined
        localStorage.removeItem('userInfo')
        router.push('login')
    }
}] as DropDownItem[]
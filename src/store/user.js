// 关于用户信息的存储
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            uid: '',
            userInfo: {}
        }
    },
    actions: {
        changeUid(val) {
            this.uid = val
        },
        changeUserInfo(val) {
            this.userInfo = val
        },
    },
})
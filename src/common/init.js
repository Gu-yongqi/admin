import axios from '@/axios/index.js';
import { useUserStore } from '@/store/user.js';
import { usePublicStore } from '@/store/public.js';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from '@/router';
import { ElMessage } from 'element-plus';

export default function init() {
    return new Promise(function(reslove) {
        let { token, tokenExpired } = localStorage;
        tokenExpired = +tokenExpired;
        if (!token || !tokenExpired) {
            ElMessage({
                type: "error",
                message: "登录已过期"
            })
            return reslove();
        }

        let now = Date.now();

        if (now >= tokenExpired) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpired');
            return reslove();
        } else {
            //  token存在  token没过期
            NProgress.start();
            axios({
                    url: '/admin/checkToken',
                    method: 'GET'
                }).then(async res => {
                    console.log(res);
                    if (res.code == 0) {
                        const userStore = useUserStore();
                        const publicStore = usePublicStore();

                        userStore.changeUid(res.uid);
                        userStore.changeUserInfo(res.userInfo);
                        await publicStore.getMenu(router);
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('tokenExpired');
                    }
                })
                .finally(async() => {
                    reslove();
                    NProgress.done();
                });
        }
    })
}
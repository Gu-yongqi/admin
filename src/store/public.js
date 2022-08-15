// 关于用户信息的存储 
import { defineStore } from 'pinia';
import axios from 'axios';
import addRoute from '@/common/addRoute.js';

export const usePublicStore = defineStore('public', {
    state: () => {
        return {
            menu: []
        }
    },
    actions: {
        getMenu(router) {
            return axios({
                url: '/admin/getMenu',
                method: 'GET'
            }).then(res => {
                console.log(res);
                if (res.code == 0) {
                    this.menu = res.data;
                    addRoute(router, res.data);
                }
            })
        }
    },
})
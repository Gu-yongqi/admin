<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <img src="../assets/vue.svg" alt="">
    <div class="headLogo">头条管理系统</div>
    <div class="flex-grow" />
    <el-sub-menu index="1">
      <template #title>
        <img :src="userStore.userInfo.avatar" alt="" style="width:38px;height:38px;border-radius:50%;margin-right:10px;">
        <span>{{userStore.userInfo.nickname}}</span>
      </template>
      <el-menu-item index="1-1" @click="router.push('/info')">修改资料</el-menu-item>
      <el-menu-item index="1-2" @click="router.push('/passworld')">修改密码</el-menu-item>
      <el-menu-item index="1-3" @click="open">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { useUserStore } from '@/store/user.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { ref } from "vue";
import axios from '@/axios/index.js';
import { usePublicStore } from '@/store/public.js';

const userStore = useUserStore();
const publicStore = usePublicStore();
const activeIndex = ref("1");

const router = useRouter();

const open = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '退出成功',
      })
      axios({
        url: '/admin/logout',
        method: 'GET'
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          // 清除本地存储
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpired');
          // 清除路由  
          router.getRoutes().forEach(v => {
            if (v.meta.isDynamic) {
              router.removeRoute(v.name)
            }
          });
          // 清除store
          userStore.$reset()
          publicStore.$reset()
          router.replace('/login')
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'success',
        message: '取消退出',
      })
    })
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
.headLogo {
  line-height: 60px;
}
</style>

<template>
  <div class="login">
    <particles></particles>
    <div class="loginPage">
      <h2>头条管理系统</h2>
      <div class="banner">
        <h3>欢迎登录</h3>
        <el-form :model="form" class="loginForm" :rules="rules" ref="ruleFormRef">
          <el-form-item prop="username" style="margin-bottom:30px;">
            <el-input v-model="form.username" placeholder="请输入您的账号" clearable :prefix-icon="Avatar" />
          </el-form-item>
          <el-form-item prop="password" style="margin-bottom:30px;">
            <el-input v-model="form.password" placeholder="请输入您的密码" clearable :prefix-icon="Lock" />
          </el-form-item>
          <el-form-item>
            <el-button class="loginBtn" type="primary" @click="onSubmit(ruleFormRef)">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import particles from '@/components/particlesJS/particles.vue';
import axios from '@/axios/index.js';
import { Lock, Avatar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user.js';
import { usePublicStore } from '@/store/public.js';

const userStore = useUserStore();
const publicStore = usePublicStore();

const ruleFormRef = ref();//  获取dom    名字和dom里ref的名字重复  会当成获取dom的操作 

const router = useRouter(); //路由跳转

const form = reactive({
  username: "15225930470_s",
  password: "123456"
});
const rules = reactive({
  username: [
    { required: true, message: '请填写账号', trigger: 'blur' },
    { validator: validateUsername, message: '账号格式错误', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    { validator: validatePass, message: '密码格式错误', trigger: 'blur' },
  ],
});

function validateUsername(...arg) {
  let [rule, value] = arg;
  return /^\w{6,18}$/.test(value);
}
function validatePass(...arg) {
  let [rule, value] = arg;
  return /^\w{6,18}$/.test(value);
}

function onSubmit(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let { username, password } = form
      axios({
        url: '/admin/login',
        method: 'POST',
        data: {
          username,
          password
        }
      }).then(res => {
        console.log(res);
        let { code } = res;
        if (code !== 0) {
          ElMessage({
            type: "error",
            message: "登录失败"
          })
        } else {
          ElMessage({
            type: "success",
            message: "登录成功"
          })
          localStorage.setItem('token', res.token);
          localStorage.setItem('tokenExpired', res.tokenExpired);
          //保存用户信息
          userStore.changeUid(res.uid);
          userStore.changeUserInfo(res.userInfo);
          //保存菜单信息
          publicStore.getMenu(router);
          setTimeout(() => {
            router.push('/');
          }, 1000)
        }
      })
    } else {
      return false;
    }
  })
}
</script>

<style>
.loginPage {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  padding-top: 100px;
}

.loginPage h2 {
  text-align: center;
  color: #fff;
}
.loginPage .banner {
  width: 400px;
  height: 300px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.2);
}
.loginPage .banner h3 {
  text-align: center;
  padding: 20px 0 10px;
  color: #fff;
}
.loginPage .banner .loginBtn {
  width: 80%;
  margin-left: 10%;
}
</style>
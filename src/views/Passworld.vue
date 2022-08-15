<template>
  <div class="passworld">
    <particles></particles>
    <div class="loginPage">
      <h2>头条管理系统</h2>
      <div class="banner">
        <h3>修改密码</h3>
        <el-form :model="form" class="loginForm" :rules="rules" ref="ruleFormRef">
          <el-form-item prop="oldPassword" style="margin-bottom:30px;">
            <el-input v-model="form.oldPassword" placeholder="请输入您的旧密码" clearable :prefix-icon="Lock" />
          </el-form-item>
          <el-form-item prop="newPassword" style="margin-bottom:30px;">
            <el-input v-model="form.newPassword" placeholder="请输入您的新密码" clearable :prefix-icon="Lock" />
          </el-form-item>
          <el-form-item>
            <el-button class="loginBtn" type="primary" @click="onSubmit(ruleFormRef)">修改密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import particles from '@/components/particlesJS/particles.vue';
import axios from '@/axios/index.js';
import { Lock, Avatar } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const ruleFormRef = ref();//  获取dom    名字和dom里ref的名字重复  会当成获取dom的操作 

const router = useRouter(); //路由跳转

const form = reactive({
  oldPassword: "",
  newPassword: "",
});

const rules = reactive({
  oldPassword: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    { validator: validatePass, message: '密码格式错误', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    { validator: validatePass, message: '密码格式错误', trigger: 'blur' },
  ],
});

function validatePass(...arg) {
  let [rule, value] = arg;
  return /^\w{6,18}$/.test(value);
}

function onSubmit(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let { oldPassword, newPassword } = form;
      let uid = localStorage.getItem('uid');
      console.log(uid);
      axios({
        url: '/admin/updatePwd',
        method: 'POST',
        data: {
          uid,
          oldPassword,
          newPassword
        }
      }).then(res => {
        console.log(res);
        let { code } = res;
        if (code !== 0) {
          ElMessage({
            type: "error",
            message: "修改失败"
          })
        } else {
          ElMessage({
            type: "success",
            message: "修改成功"
          })
          setTimeout(() => {
            router.push('/login');
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
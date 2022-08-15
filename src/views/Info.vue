<template>
  <div class="info">
    <el-header>
      <headers></headers>
    </el-header>
    <div class="common-layout">
      <el-container>
        <el-header class="head">
          <span @click="router.back()" class="span">
            <el-icon class="icon">
              <ArrowLeftBold />
            </el-icon>
            <span class="hover">返回</span>
          </span>
        </el-header>
        <el-main class="main">
          <div class="infoLeft">
            <h2>个人资料</h2>
            <el-divider />
            <el-form :model="form" label-width="500px" label-position="left" :rules="rules" ref="ruleFormRef">
              <el-form-item label="用户名" prop="nickname">
                <el-input v-model="form.nickname" maxlength="20" placeholder="请填写您的用户名" show-word-limit type="text" />
              </el-form-item>
              <el-divider />
              <el-form-item label="生日" prop="birthday">
                <el-date-picker v-model="form.birthday" type="date" placeholder="请填写您的生日" @blur="blur" />
              </el-form-item>
            </el-form>
            <el-divider />
            <div style="text-align:center;">
              <el-button type="primary" @click="submit(ruleFormRef)">保存修改</el-button>
            </div>
          </div>
          <div class="infoRight">
            <div class="tx">
              <input type="file" @change="ipt">
              <img :src="form.avatar" alt="">
              <div>我的头像</div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import axios from '@/axios/index.js';
import headers from '@/components/header.vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useUserStore } from '@/store/user.js';

const userStore = useUserStore();
const ruleFormRef = ref();
const router = useRouter();

const rules = reactive({
  nickname: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
  ],
  birthday: [
    {
      required: true,
      message: '生日不能为空',
      trigger: 'blur',
    },
  ]
})

let form = reactive({
  uid: userStore.uid,
  nickname: userStore.userInfo.nickname,
  avatar: userStore.userInfo.avatar,
  birthday: userStore.userInfo.birthday
})

function blur() {
  form.birthday = new Date(form.birthday);
  form.birthday = form.birthday.getFullYear() + '-' + ((form.birthday.getMonth() + 1 < 10) ? '0' + (form.birthday.getMonth() + 1) : (form.birthday.getMonth() + 1)) + '-' + (form.birthday.getDate() < 10 ? '0' + form.birthday.getDate() : form.birthday.getDate());
}

async function ipt(e) {
  let file = e.target.files[0]
  let { token } = await info()
  console.log(file, token);
  let name = file.name.slice(file.name.lastIndexOf('.'))
  let key = `${new Date().getTime()}${Math.random().toString(36).slice(2)}${name}`

  let formDate = new FormData()
  formDate.append('file', file)
  formDate.append('token', token)
  formDate.append('key', key)
  axios({
    url: 'https://upload-z1.qiniup.com',
    method: 'POST',
    data: formDate
  }).then(res => {
    console.log(res);
    let avatar = `http://toutiao.longxiaokj.com/${res.key}`
    form.avatar = avatar
  })
}
function info() {
  return axios({
    url: 'https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http/upload/token',
    method: 'POST'
  })
}

function submit(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let { uid, nickname, avatar, birthday } = form;
      axios({
        url: '/admin/updateUser',
        method: 'POST',
        data: {
          uid,
          nickname,
          avatar,
          birthday,
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
          userStore.changeUserInfo({ nickname, avatar, birthday });
        }
      })
    } else {
      return false;
    }
  })
}
</script>

<style scoped>
.common-layout {
  background-color: #f4f5f5;
  height: calc(100vh - 60px);
}
.head {
  width: 1230px;
  margin: 0 auto;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  margin-top: 20px;
  cursor: pointer;
  border-bottom: 1px solid #ebecec;
}
.icon {
  color: #9f9f9f;
  vertical-align: -2px;
}
.hover {
  color: #9f9f9f;
}
.span:hover .icon,
.span:hover .hover {
  color: #007fff;
}
.main {
  width: 1230px;
  margin: 0 auto;
  height: 380px;
  background-color: #fff;
  margin-top: 20px;
  cursor: pointer;
  display: flex;
}
.infoLeft {
  width: 60%;
  height: 100%;
}
.infoRight {
  width: 40%;
  height: 100%;
}
.tx {
  text-align: center;
  position: relative;
}
.tx input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
.tx img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  margin-top: 70px;
}
.tx div {
  font-size: 14px;
}
</style>
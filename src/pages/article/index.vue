<template>
  <div class="article">
    <div v-if="flag">
      <div class="articleHead">
        <div>
          <span class="span" @click="router.back()">
            <el-icon class="icon">
              <ArrowLeftBold />
            </el-icon>
            <span class="hover">返回</span>
          </span>
          <span class="cen">|</span>
          <span style="color:#9f9f9f;">{{route.meta.title}}</span>
        </div>
        <el-button @click="centerDialogVisible = true" type="primary">新增文章</el-button>
      </div>
      <el-divider />
      <el-form :model="form" label-width="100px" class="form">
        <el-form-item label="分类名称">
          <el-select v-model="_id" clearable placeholder="请选择分类名称" @clear="clear">
            <el-option v-for="(item,index) in form.options" :key="index" :label="item.name" :value="item._id" @click="option(item._id)" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <div class="block">
            <el-date-picker v-model="form.date1" type="date" placeholder="起始时间" />
            <span style="margin:0 20px;">--</span>
            <el-date-picker v-model="form.date2" type="date" placeholder="截止时间" />
          </div>
        </el-form-item>
        <el-form-item label="用户ID" style="width:318px;">
          <el-input v-model="form.userId" type="text" placeholder="请填写查找的用户ID" clearable />
        </el-form-item>
        <el-form-item label="关键字" style="width:318px;">
          <el-input v-model="form.text" type="text" placeholder="请填写查找的关键字" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="article">查询文章</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-table :data="tableData" style="width: 100%;overflow-y:scroll;height:calc(100vh - 400px);">
        <el-table-column prop="cate_name" label="分类名称" />
        <el-table-column prop="title" label="文章名称" />
        <el-table-column prop="author" label="用户名称" />
        <el-table-column prop="imageSrc" label="图片地址" />
        <el-table-column label="分类操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="example-pagination-block">
        <el-pagination layout="prev, pager, next, jumper" :key="key" :total="total" @current-change="currentChange" />
      </div>
      <!-- 新增的弹出层 -->
      <el-dialog v-model="centerDialogVisible" title="新增文章" width="50%" center>
        <el-form :model="createForm" :rules="rules" ref="createFormRef">
          <el-form-item prop="title">
            <el-input v-model="createForm.title" placeholder="请填写文章名称" clearable />
          </el-form-item>
          <el-form-item prop="content">
            <el-input v-model="createForm.content" :autosize="{ minRows: 2 }" placeholder="请填写文章内容" style="margin-top:20px;" type="textarea" />
          </el-form-item>
          <el-form-item prop="author">
            <el-input v-model="createForm.author" placeholder="请填写用户名称" style="margin-top:20px;" clearable />
          </el-form-item>
          <el-form-item prop="option">
            <el-select v-model="createForm.options.name" placeholder="请选择分类名称" style="width:100%;margin-top:20px;">
              <el-option v-for="(item,index) in createForm.options" :key="index" :label="item.name" :value="item._id" @click="createOption(item.name,item._id,createFormRef)" />
            </el-select>
          </el-form-item>
          <div class="articleTx">
            <label for="upload">
              <input type="file" @change="ipt" id="upload">
            </label>
            <span v-for="(item,index) in createForm.imageSrc" :key="index">
              <img :src="item" alt="">
            </span>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createConfirm(createFormRef)">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="active" v-else>加载中...</div>
  </div>
</template>

<script setup>
import axios from '@/axios/index.js';
import { useUserStore } from '@/store/user.js';
import { ArrowLeftBold, Plus } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const tableData = ref([]);
const total = ref(0);
const key = ref(0);
const id = ref('');
const cate_name = ref('');
const cate_id = ref('');
const centerDialogVisible = ref(false);
const createFormRef = ref();
const flag = ref(false);

//若是从cate页面跳转给的初始_id
const _id = ref('');
_id.value = route.query._id;

let createForm = reactive({
  title: '',
  content: '',
  author: '',
  author_id: userStore.userInfo._id,
  option: '',
  options: [],
  imageSrc: []
})

const rules = reactive({
  title: [
    {
      required: true,
      message: '文章名称不能为空',
      trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      message: '文章内容不能为空',
      trigger: 'blur',
    },
  ],
  author: [
    {
      required: true,
      message: '用户名称不能为空',
      trigger: 'blur',
    },
  ],
  option: [
    {
      required: true,
      message: '文章分类不能为空',
      trigger: 'blur',
    },
  ]
})

const form = reactive({
  options: [],
  pageNum: 1,
  date1: '',
  date2: '',
  userId: '',
  text: ''
})

//获取查询分类id
function option(i) {
  id.value = i;
  route.query._id = '';
}

//获取分类名称和id
function createOption(name, i, formEl) {
  createForm.option = name;
  cate_name.value = name;
  cate_id.value = i;
  if (!formEl) return false;
  formEl.validate((valid) => {
    if (!valid) {
      return false;
    }
  })
}

//通过分页查询文章
function currentChange(e) {
  form.pageNum = e;
  getArticle();
}

//通过查询文章重置分页
function article() {
  form.pageNum = 1;
  key.value++;
  getArticle();
}

//查询文章
function getArticle() {
  let { pageNum, date1, date2, userId, text } = form;
  axios({
    url: '/admin/getArticle',
    method: 'POST',
    data: {
      cateId: route.query._id || id.value,
      pageNum,
      pageSize: 10,
      userId,
      startTime: date1,
      endTime: date2,
      keyWord: text,
      sort: 'desc'
    }
  }).then(res => {
    console.log(res);
    tableData.value = res.data;
    total.value = res.count;

    if (tableData.value.length != 0 || route.query._id) {
      flag.value = true;
    }
  })
}

//新增文章
function createConfirm(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let { title, content, author, author_id, imageSrc } = createForm;
      axios({
        url: '/admin/createArticle',
        method: 'POST',
        data: {
          title,
          content,
          author,
          author_id,
          cate_name: cate_name.value,
          cate_id: cate_id.value,
          imageSrc
        }
      }).then(res => {
        console.log(res);
        let { code } = res;
        if (code !== 0) {
          ElMessage({
            type: "error",
            message: "新增失败"
          })
        } else {
          ElMessage({
            type: "success",
            message: "新增成功"
          })
          createForm = reactive({
            title: '',
            content: '',
            author: '',
            author_id: userStore.userInfo._id,
            options: [],
            imageSrc: []
          })
          centerDialogVisible.value = false;
          getArticle();
        }
      })
    } else {
      return false;
    }
  })
}

//修改分类
const handleUpdate = (row) => {
  // updateDialogVisible.value = true;
  // let { _id, name, sort, status } = row;
  // updateForm._id = _id;
  // updateForm.name = name;
  // updateForm.sort = sort;
  // updateForm.status = !status;
}

//删除分类
const handleDelete = (row) => {
  //   deleteDialogVisible.value = true;
  //   let { _id } = row;
  //   cate_id.value = _id;
}

//清除选中分类查询文章id置为空
function clear() {
  id.value = '';
  route.query._id = '';
}

//获取分类名称
function getCate() {
  axios({
    url: '/admin/getCate',
    method: 'GET'
  }).then(res => {
    console.log(res);
    form.options = res.data;
    //深拷贝
    function clone(target, origin) {
      target = target || [];
      for (let key in origin) {
        if (origin[key] !== null && typeof (origin[key]) === 'object') {
          if (Object.prototype.toString.call(origin[key]) === '[object Array]') {
            target[key] = [];
          } else {
            target[key] = {};
          }
          clone(target[key], origin[key]);
        } else {
          target[key] = origin[key];
        }
      }
      return target;
    }
    clone(createForm.options, form.options);
    getArticle();
  })
}

onMounted(() => {
  getCate();
})

async function ipt(e) {
  let file = e.target.files[0];
  let { token } = await info();
  console.log(file, token);
  let name = file.name.slice(file.name.lastIndexOf('.'));
  let key = `${new Date().getTime()}${Math.random().toString(36).slice(2)}${name}`;

  let formDate = new FormData();
  formDate.append('file', file);
  formDate.append('token', token);
  formDate.append('key', key);
  axios({
    url: 'https://upload-z1.qiniup.com',
    method: 'POST',
    data: formDate
  }).then(res => {
    console.log(res);
    let avatar = `http://toutiao.longxiaokj.com/${res.key}`
    if (createForm.imageSrc.length < 3) {
      createForm.imageSrc.push(avatar);
    } else {
      ElMessage({
        type: "error",
        message: "最多添加三张图"
      })
    }
  })
}
function info() {
  return axios({
    url: 'https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http/upload/token',
    method: 'POST'
  })
}
</script>

<style>
.active {
  width: 100%;
  height: calc(100vh - 140px);
  color: #409eff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.articleTx {
  text-align: center;
  border: 1px dotted lightblue;
  position: relative;
  display: flex;
  height: 148px;
}
.articleTx label {
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  cursor: pointer;
}
.articleTx img {
  width: 148px;
  height: 148px;
  margin-left: 20px;
}
.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  overflow: hidden;
}
.example-pagination-block {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}
.article {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}
.articleHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon {
  vertical-align: -2px;
}
.span {
  color: #9f9f9f;
}
.span:hover .icon,
.span:hover .hover {
  cursor: pointer;
  color: #007fff;
}
.cen {
  margin: 0 20px;
  color: #dcdfe6;
}
</style>
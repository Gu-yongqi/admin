<template>
  <div class="cate">
    <div v-if="flag">
      <div class="cateHead">
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
        <el-button @click="centerDialogVisible=true" type="primary">新增分类</el-button>
      </div>
      <el-divider />
      <el-table :data="tableData" style="width: 100%;overflow-y:scroll;height:calc(100vh - 230px);">
        <el-table-column prop="_id" label="ID" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="status" label="状态(0开启,1关闭)" />
        <el-table-column prop="sort" label="排序(越小越靠前)" />
        <el-table-column label="分类操作">
          <template #default="scope">
            <el-button size="small" type="warning" @click="getArticle(scope.row)">查询</el-button>
            <el-button size="small" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增的弹出层 -->
      <el-dialog v-model="centerDialogVisible" title="新增分类" width="50%" center>
        <el-form :model="createForm" :rules="rules" ref="createFormRef">
          <el-form-item prop="name">
            <el-input v-model="createForm.name" placeholder="请填写分类名称" clearable />
          </el-form-item>
          <el-form-item prop="sort">
            <el-input v-model="createForm.sort" placeholder="请填写排序数量" style="margin-top:20px;" clearable />
          </el-form-item>
          <el-switch v-model="createForm.status" size="large" active-text="开启" inactive-text="关闭" style="margin-top:20px;" />
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createConfirm(createFormRef)">确定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 修改的弹出层 -->
      <el-dialog v-model="updateDialogVisible" title="修改分类" width="50%" center>
        <el-form :model="updateForm" :rules="rules" ref="updateFormRef">
          <el-form-item prop="name">
            <el-input v-model="updateForm.name" placeholder="请填写分类名称" clearable />
          </el-form-item>
          <el-form-item prop="sort">
            <el-input v-model="updateForm.sort" placeholder="请填写排序数量" style="margin-top:20px;" clearable />
          </el-form-item>
          <el-switch v-model="updateForm.status" size="large" active-text="开启" inactive-text="关闭" style="margin-top:20px;" />
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateConfirm(updateFormRef)">确定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 删除的弹出层 -->
      <el-dialog v-model="deleteDialogVisible" title="删除分类" width="50%" center>
        <div>删除的分类将无法恢复,谨慎操作</div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="deleteConfirm">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="active" v-else>加载中...</div>
  </div>
</template>

<script setup>
import axios from '@/axios/index.js';
import { onMounted, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router';

const tableData = ref([]);
const router = useRouter();
const route = useRoute();
const centerDialogVisible = ref(false);
const updateDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const createFormRef = ref();
const updateFormRef = ref();
const flag = ref(false);

const createForm = reactive({
  name: '',
  sort: 24,
  status: !0
})

const updateForm = reactive({
  _id: '',
  name: '',
  sort: undefined,
  status: !0
})

const cate_id = ref('');

const rules = reactive({
  name: [
    {
      required: true,
      message: '分类名字不能为空',
      trigger: 'blur',
    },
  ],
  sort: [
    {
      required: true,
      message: '排序数量不能为空',
      trigger: 'blur',
    },
  ]
})

//查询文章
function getArticle(row) {
  axios({
    url: '/admin/getArticle',
    method: 'POST',
    data: {
      cateId: row._id,
      pageNum: 1,
      pageSize: 10,
      userId: '',
      startTime: '',
      endTime: '',
      keyWord: '',
      sort: 'desc'
    }
  }).then(res => {
    console.log(res);
    let { code } = res;
    if (code !== 0) {
      ElMessage({
        type: "error",
        message: "查询失败"
      })
    } else {
      ElMessage({
        type: "success",
        message: "查询成功"
      })
      setTimeout(() => {
        router.push({ path: '/article', query: { _id: row._id } });
      }, 1000)
    }
  })
}

//新增分类
function createConfirm(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let { name, sort, status } = createForm;
      status = !status;
      axios({
        url: '/admin/createCate',
        method: 'POST',
        data: {
          name,
          sort,
          status,
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
          createForm.name = '';
          centerDialogVisible.value = false;
          cate();
        }
      })
    } else {
      return false;
    }
  })
}
//修改分类
const handleUpdate = (row) => {
  updateDialogVisible.value = true;
  let { _id, name, sort, status } = row;
  updateForm._id = _id;
  updateForm.name = name;
  updateForm.sort = sort;
  updateForm.status = !status;
}
function updateConfirm(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let { _id, name, sort, status } = updateForm;
      status = !status;
      axios({
        url: '/admin/updateCate',
        method: 'POST',
        data: {
          cate_id: _id,
          name,
          sort,
          status
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
          updateDialogVisible.value = false;
          cate();
        }
      })
    } else {
      return false;
    }
  })
}
//删除分类
const handleDelete = (row) => {
  deleteDialogVisible.value = true;
  let { _id } = row;
  cate_id.value = _id;
}
function deleteConfirm() {
  axios({
    url: '/admin/deleteCate',
    method: 'POST',
    data: {
      cate_id: cate_id.value
    }
  }).then(res => {
    console.log(res);
    let { code } = res;
    if (code !== 0) {
      ElMessage({
        type: "error",
        message: "删除失败"
      })
    } else {
      ElMessage({
        type: "success",
        message: "删除成功"
      })
      deleteDialogVisible.value = false;
      cate();
    }
  })
}

onMounted(() => {
  cate();
})

function cate() {
  axios({
    url: '/admin/getCate',
    method: 'GET'
  }).then(res => {
    console.log(res);
    tableData.value = res.data;
    if (tableData.value.length != 0) {
      flag.value = true;
    }
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
.cate {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}
.cateHead {
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
<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu router active-text-color="blue" background-color="rgba(117, 185, 255, 0.8)" class="el-menu-vertical-demo" :default-active="defaultActive" text-color="#fff">
        <el-menu-item index="/dashboard">
          <el-icon>
            <Place />
          </el-icon>
          <span>控制台</span>
        </el-menu-item>
        <div v-for="(item,index) in publicStore.menu" :key="index">
          <el-sub-menu index="1" v-if="item.children&&item.children.length">
            <template #title>
              <el-icon>
                <Management />
              </el-icon>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,index2) in item.children" :key="index2">
              <icon :icon="item2.icon"></icon>
              <span>{{item2.title}}</span>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item :index="item.path" v-else>
            <icon :icon="item.icon"></icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </div>
        <el-menu-item index="/setting">
          <el-icon>
            <Setting />
          </el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Management,
  Place,
  Setting
} from "@element-plus/icons-vue";
import { ref, watchEffect } from 'vue';
import { usePublicStore } from '@/store/public.js';
let defaultActive = ref();

import { useRouter } from 'vue-router';

let publicStore = usePublicStore();
let router = useRouter();

watchEffect(() => {
  setInterval(() => {
    defaultActive.value = router.currentRoute._rawValue.path || '/dashboard';
  }, 1);
})
</script>

<style>
.tac {
  height: calc(100vh - 60px);
  background-color: rgba(117, 185, 255, 0.8);
}
</style>

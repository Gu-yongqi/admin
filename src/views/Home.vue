<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <headers></headers>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <left></left>
        </el-aside>
        <el-main style="background-color:#f4f5f5;">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import headers from '@/components/header.vue';
import left from '@/components/left.vue';
</script>

<style>
.common-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
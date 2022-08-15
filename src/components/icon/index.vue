<template>
  <el-icon>
    <component :is="icon"></component>
  </el-icon>
</template>

<script>
export default {
  props: ['icon']
}
</script>

<style>
</style>
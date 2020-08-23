<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in breadcrumbItem" :key="item">{{item}}</el-breadcrumb-item>  
    </el-breadcrumb>
</template>

<script>
export default {
  props:{
    breadcrumbItem:{
      type:Array,
      default:null
    }
  }
}
</script>
<style lang="less" scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
    font-size: 18px;
  }
</style>
<template>
  <div>
     <breadcrumb :breadcrumb-item="['权限管理','权限列表']"></breadcrumb>
      <el-card>
          <el-table :data="rightsList" style="width: 100%" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="authName" label="角色名称"></el-table-column>
              <el-table-column prop="path" label="路径"></el-table-column>
              <el-table-column prop="level" label="等级">
                  <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.level ==='0'">等级一</el-tag>
                      <el-tag v-else-if="scope.row.level ==='1'">标签二</el-tag>
                      <el-tag type="danger" v-else="scope.row.level ==='2'">等级三</el-tag>
                  </template>
              </el-table-column>
          </el-table>
      </el-card>
  </div>
</template>

<script>
  import  Breadcrumb from '../common/Breadcrumb'
export default {
  components:{
    Breadcrumb
  },
  data(){
    return {
        rightsList:[],
    }
  },
  created(){
    this.getRightsList()
  },
  methods:{
      async getRightsList(){
        let {data:res} = await this.$http.get('rights/list')

        if(res.meta.status !== 200){ return this.$message.error('获取列表失败！')}
        this.rightsList = res.data
      }
  }
}
</script>

<style lang="less" scoped>

</style>
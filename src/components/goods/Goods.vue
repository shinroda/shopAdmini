<template>
  <div>
    <breadcrumb :breadcrumb-item="['商品管理','商品列表']"></breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入要查找的商品" v-model="queryInfo.query" clearable
           @clear="getGoodsList" @keyup.enter.native="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表 -->
      <el-table
      :data="goodsList"
      style="width: 100%"
      border stripe>
      <el-table-column type = "index"></el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        >
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="110">
      </el-table-column>
      <el-table-column
        prop="goods_number"
        label="商品数量" 
        width="70" >
      </el-table-column>
      <el-table-column    
        label="创建时间"
        width="180">
        <template slot-scope="scope">{{scope.row.add_time |dateFormat}}</template>
      </el-table-column>
        <el-table-column
        label="操作"
        width="130">
        <template>
          <el-button  type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 分页  -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  export default {
    components: {
      Breadcrumb
    },
    data() {
      return {
        queryInfo: {
          query:'',
          pagenum:1,
          pagesize:5
        },
        goodsList:[],
        total:0

      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      async getGoodsList() {
        let {data:res } = await this.$http.get('goods',{params:this.queryInfo})
        if(res.meta.status !==200){return this.$message('获取商品信息失败')}

        this. goodsList = res.data.goods 
        this.total = res.data.total
      },
      handleSizeChange(val){
        this.queryInfo.pagesize = val
       this.getGoodsList()

      },
      handleCurrentChange(val){
        this.queryInfo. pagenum = val
       this.getGoodsList()
      },
      goAddGoods(){
        this.$router.push('/goods/addgoods')
      }

    },

  }
</script>

<style lang="less" scope>
  .el-table{
    margin-top: 20px;
  }
</style>
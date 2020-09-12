<template>
  <div>
    <breadcrumb :breadcrumb-item="['订单管理','订单列表']"></breadcrumb>
    <el-card>
      <el-input placeholder="请输入订单内容(没做)" v-model="queryInfo.query" style="width:30%">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>

  <!-- 订单比表格 -->
   <el-table
      :data="ordersList"
      style="width: 100%; margin-top: 10px;"
      border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号" width="400"></el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"></el-table-column>
      <el-table-column
        prop="order_pay"
        label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay ==1">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
        </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"></el-table-column>
      <el-table-column
        label="下单时间"
        width="180">
        <template slot-scope="scope">
          <P>{{scope.row.create_time | dateFormat }}</P>
        </template>
        </el-table-column>   
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">
            <i class="el-icon-edit"></i>
          </el-button>
            <el-button type="success" size="mini" @click="showDialogVisible">
            <i class="el-icon-location-outline"></i>
          </el-button>
        </template>
        </el-table-column>                 
   </el-table> 
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> 
    </el-card>

    <!-- 物流信息 -->
    <el-dialog
  title="物流信息(后端提供的物流信息是随机生成的)"
  :visible.sync="dialogVisible"
  width="50%">
    <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in expressage"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>

</el-dialog>
  </div>
</template>

<script>
  import  Breadcrumb from '../common/Breadcrumb'
export default {
  components:{
    Breadcrumb
  },
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      total:0,
      ordersList:[],
      // 快递
      expressage:'',
      dialogVisible:false
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList(){
      let {data:res } = await this.$http.get('orders',{params:this.queryInfo})
      if(res.meta.status !==200){return this.$message.error('获取订单列表失败')}
      this.total = res.data.total
      this.ordersList = res.data.goods
    //  console.log(res);
    },
     handleSizeChange(val){
       this.queryInfo.pagesize = val
       this.getOrdersList()
     },
     handleCurrentChange(val){
        this.queryInfo.pagenum = val
       this.getOrdersList()
     },
     async showDialogVisible(){
       let {data:res} = await this.$http.get(`kuaidi/${1106975712662}`)
       if(res.meta.status !==200){return this.$message.error('获取物流信息失败')}

       this.expressage = res.data
       this.dialogVisible = true
      //  console.log(res);
     }
  },
  computed: {
    
  },
}
</script>

<style lang="less" scoped>

</style>
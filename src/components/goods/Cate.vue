<template>
  <div>
    <breadcrumb :breadcrumb-item="['商品管理','商品分类']"></breadcrumb>
    <el-card>
      <el-row >
        <el-button style="margin-bottom: 10px" type="success" @click="showAddCateDialog"> 添加分类</el-button>
      </el-row>
      <tree-table :data="cateList" :columns="columns" show-index border :selection-type="false" :expand-type="false">
        <!-- 是否可用 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if='!scope.row.cat_deleted' style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!--排序  -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level=== 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level=== 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" style="background:#409EFF;color:#fff">
            <i class="el-icon-edit"></i>
            编辑
          </el-button>
          <el-button type="denger" size="mini" style="background:#F56C6C;color:#fff">
            <i class="el-icon-delete"></i>
            删除
            <i class="el-icon-"></i>
          </el-button>
        </template>
      </tree-table>

      <el-pagination 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10,20]" 
        :page-size="queryInfo.pagesize" 
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
    <!--添加分类弹框-->
    <el-dialog
            title="添加新分类"
            :visible.sync="addCateDialog"
            width="50%"
            @close="addCateClose">
      <el-form ref="addCateFormRef" :model="addCateFrom" label-width="80px" :rules="addCateRules">
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
         <el-cascader
                  v-model="cateKeys"
                  :options="cateCascader"
                  :props="parentCateProps"
                  clearable
                  @change="pidChange"
                  style="width: 100%"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialog = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
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
        cateList: [],
        queryInfo: {
          type: '3',
          pagenum: 1,
          pagesize: 5

        },
        total: 0,
        columns: [
            {
            label: '分类名称',
            prop: 'cat_name'

          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }
        ],
        addCateDialog : false,
        addCateFrom:{
            cat_pid:0,
            cat_name:'',
            cat_level:0
        },
        addCateRules:{
            cat_name: [
                { required: true, message: '请输入分类名', trigger: 'blur' }
            ]
          },
          //父级列表
          cateCascader:[],
          parentCateProps:{
            expandTrigger: 'hover',
              checkStrictly: true,
              label:'cat_name',
              value:'cat_id',
          },
          //选中的父级的key
          cateKeys:[]

      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        let {
          data: res
        } = await this.$http.get('categories', {
          params: this.queryInfo
        })
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.cateList = res.data.result
        this.total = res.data.total
      },
        handleSizeChange(val) {
      this.queryInfo.pagesize = val
        this.getCateList()
    },
        handleCurrentChange(val) {
     this.queryInfo.pagenum = val
     this.getCateList()
    },
        async showAddCateDialog(){
          let {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !==200){
                return this.$message.error('获取父分类信息失败！')
                this.addCateDialog = false
                return
            }
           this.cateCascader = res.data
            this.addCateDialog = true
        },
        pidChange(){
          if (!this.cateKeys) {
              this.addCateFrom.cat_pid=0
              this.addCateFrom.cat_level=0
              return
          }
          if(this.cateKeys.length == 1){
              this.addCateFrom.cat_pid= this.cateKeys[0]
              this.addCateFrom.cat_level=1
          }
          else {
              this.addCateFrom.cat_pid= this.cateKeys[1]
              this.addCateFrom.cat_level=2
          }
        },
        addCateClose(){

            this.cateKeys = []
            this.$refs.addCateFormRef.resetFields()
            this.addCateFrom.cat_pid= 0
            this.addCateFrom.cat_level=0
        },
        addCate(){
          this.$refs.addCateFormRef.validate(async  valid =>{
             if(valid){
                 let {data:res} = await this.$http.post('categories',this.addCateFrom)
                 // console.log(res);
                 if (res.meta.status !==201) {return this.$message.error('添加失败')}
                this.getCateList()
                 this.$message.success('添加成功')
                 this.addCateDialog = false

             }
             else {
                 return
             }
          })
            console.log(this.addCateFrom);
        }


    }
   
    
  }
</script>

<style lang="less" scoped>

</style>
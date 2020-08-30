<template>
    <div>
        <breadcrumb :breadcrumb-item="['商品管理','分类参数']"></breadcrumb>
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
            </el-alert>
            <el-row>
                <el-col :span="6" style="margin-top: 10px">请选择分类:
                    <el-cascader v-model="cateId"
                     :options="cateList" 
                     :props="cateProps" 
                     clearable style="width: 100%"
                    @change="handelChange"
                    ></el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="success" size="small" 
                    :disabled="isBtnDisabl"
                    @click="showAddParamDialog=true">添加参数</el-button>

                    <!-- 表格 -->
                    <el-table :data="paramsDateList" style="width: 100%">
                        <el-table-column type="expand" >
                          <template slot-scope="scope">
                            <el-tag v-for="(item,i) in scope.row.attr_vals"
                             :key="i" closable
                             @close="deltag(scope.row,i)">{{item}}</el-tag>

                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.attr_id=== currentInput"
                            v-model="inputVal"
                            ref="saveTagInput"
                            size="small"
                            style="width:120px"
                            @keyup.enter.native="handleTagInputConfirm(scope.row)"
                            @blur="handleTagInputConfirm(scope.row)"
                          >
                          </el-input>
                          <el-button  
                          v-else
                          class="button-new-tag"
                           size="small"
                           width="120px"
                            @click="showInput(scope.row)"
                            >+ New Tag</el-button>
                          </template>
                          
                        </el-table-column>
                         <el-table-column type="index" ></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
                        <el-table-column label="操作" >
                          <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini">编辑 </el-button>
                           
                           
                           <el-popconfirm 
                              title="确定删除吗？"
                              @onConfirm="delParam(scope.row.attr_id)"
                            >
                              <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>       
                            </el-popconfirm>
                          </template>
                           
                        </el-table-column>
                    </el-table>
                        

                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button type="success" size="small" 
                    :disabled="isBtnDisabl"
                    @click="showAddParamDialog=true">添加属性</el-button>

                      <!-- 表格 -->
                    <el-table :data="paramsDateList" style="width: 100%">
                        <el-table-column type="expand" >
                          <template slot-scope="scope">
                            <el-tag v-for="(item,i) in scope.row.attr_vals"
                             :key="i" closable
                             @close="deltag(scope.row,i)">{{item}}</el-tag>

                            <el-input
                            class="input-new-tag"
                            v-if="scope.row.attr_id=== currentInput"
                            v-model="inputVal"
                            ref="saveTagInput"
                            size="small"
                            style="width:120px"
                            @keyup.enter.native="handleTagInputConfirm(scope.row)"
                            @blur="handleTagInputConfirm(scope.row)"
                          >
                          </el-input>
                          <el-button  
                          v-else
                          class="button-new-tag"
                           size="small"
                           width="120px"
                            @click="showInput(scope.row)"
                            >+ New Tag</el-button>
                          </template>
                          
                        </el-table-column>
                         <el-table-column type="index" ></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
                        <el-table-column label="操作" >
                          <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini">编辑 </el-button>
                           
                           
                           <el-popconfirm 
                              title="确定删除吗？"
                              @onConfirm="delParam(scope.row.attr_id)"
                            >
                              <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>       
                            </el-popconfirm>
                          </template>
                           
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>


        <!-- 添加参数弹框 -->
        <el-dialog
          :title="getActiveName"
          :visible.sync="showAddParamDialog"
          width="50%"
          @closed="dialogClose">
          <el-form ref="addParamForm" :model="addParamForm" :rules="addParamRules"  label-width="100px" >
            <el-form-item :label="getActiveName" prop="param">
              <el-input v-model="addParamForm.param"></el-input>
            </el-form-item>
          </el-form> 
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddParamDialog = false">取 消</el-button>
            <el-button type="primary" @click="addParam">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 删除参数 -->
        
    </div>
</template>

<script>
    import Breadcrumb from '../common/Breadcrumb'
    export default {
        name: "Params",
        components: {
            Breadcrumb
        },
        data() {
            return {
                cateList: [],
                cateId: [],
                cateProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                },
                //    tabs活动页
                activeName: 'many',
                paramsDateList:[],
                currentInput:'',
                inputVal:'',

                // 添加参数弹框
                showAddParamDialog:false,
                addParamForm:{
                  param:''
                },
                addParamRules:{
                  param:[{ required: true, message: '输入不能为空', trigger: 'blur' }]
                }

               
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                let {
                    data: res
                } = await this.$http.get('categories')
                // console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败')
                }
                this.cateList = res.data
            },
            handelChange() {
                if (this.cateId.length !== 3) {
                    this.cateId = []
                    this.paramsDateList =[]
                    return
                }
                // console.log(this.cateId);
                this.getParamsDate()
            },        
            //活动页改变
            handleTabsClick() {
              this.getParamsDate()
            },         
            // 获取参数信息
            async getParamsDate(){
             
             let {data :res} = await this.$http.get(`categories/${this.getCateId}/attributes`,
             {params:{sel:this.activeName }})
              // console.log(res);
              if(res.meta.status !==200){return this.$message.error('获取参数失败')}

              this.paramsDateList = res.data
        
              this.paramsDateList.forEach((data,i) =>{
                if(data.attr_vals !==""){  
                data.attr_vals = data.attr_vals.split(' ')
                }else{
                  data.attr_vals= []
                }
              })
              
             

           },
          //  添加新的参数（tag）
           async handleTagInputConfirm(row){
             if(this.inputVal){
               row.attr_vals.push(this.inputVal)
              //  console.log(row.attr_vals);
             let {data: res }= await this.$http.put(`categories/${this.getCateId}/attributes/${this.currentInput}`,
              {
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')

              })
              if(res.meta.status!==200){return this.$message.error('添加失败')}
               this.$message.success('添加参数项成功')
              //  console.log(res);
            
             }
              
              this.currentInput=''
              this.inputVal=''
           },
           showInput(row){           
             this.currentInput = row.attr_id
              this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
              });
           },
           async deltag(row,i){ 
            //  console.log(row.attr_id);
            row.attr_vals.splice(i)
              let {data: res }= await this.$http.put(`categories/${this.getCateId}/attributes/${row.attr_id}`,
              {
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')

              })
              if(res.meta.status!==200){return this.$message.error('删除失败')}

           },

          //  添加新的参数
           async addParam(){
            this.$refs.addParamForm.validate(async vali=>{
               if(vali){
                 let {data:res} = await this.$http.post(`categories/${this.getCateId}/attributes`,
                 {
                attr_name:this.addParamForm.param,
                attr_sel:this.activeName    
                });
                console.log(res);
                 if(res.meta.status !== 201){return this.$message.error('添加失败')}
                 this.showAddParamDialog = false
                 this.getParamsDate()
                 this.$message.success('添加成功')
               }
             })
             
           },  
           dialogClose(){
            this.$refs.addParamForm.resetFields()
           },
              //删除参数
            
           async delParam(id){
             let {data:res} = await this.$http.delete(`categories/${this.getCateId}/attributes/${id}`)
              // console.log(res );
              if(res.meta.status !==200){return this.$message.error('删除失败')}
              this.getParamsDate()
              this.$message.success('删除成功')
            }    
        },
        computed: {
            isBtnDisabl() {
              if(this.cateId.length ===3){
                return false
              }
              return true
            },
            getCateId(){
              return this.cateId[2]
            },
            getActiveName(){
              if(this.activeName === 'many'){
                return '动态参数'
              }else{
                return '静态属性'
              }

            }
        }
    }
</script>

<style scoped>
  .el-tag{
    margin: 5px;
    
  }

 
</style>
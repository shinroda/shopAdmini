<template>
  <div id="users">
    <breadcrumb :breadcrumb-item="['用户管理','用户列表']"></breadcrumb>
    <el-card class="box-card">
      <!-- 搜索行 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
            @clear="getUserList" @keyup.enter.native="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="statusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="findUserById(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"
                @click="showSetRoleDialog(scope.row)"></el-button>
              </el-tooltip>

            </div>
          </template>
        </el-table-column>

      </el-table>
      <!-- 底部分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5,10,20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50" @close="addDialogClose">

      <el-form :model="addUserForm" :rules="addUserrRules" ref="addUserFrom" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50" @close="editDialogClose">

      <el-form :model="editUserForm" :rules="editUserrRules" ref="editUserFrom" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialog">
      <p>用户名：{{userInfo.username}}</p>
      <p>当前角色:{{userInfo.role_name}}</p>
       <el-select v-model="roleValue" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
    </el-option>
  </el-select>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialog = false">取 消</el-button>
    <el-button type="primary" @click="updateRole">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
    import  Breadcrumb from '../common/Breadcrumb'
  export default {

    data() {
      let checkEmail = (rules, vaule, cb) => {
        let regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (regEmail.test(vaule)) {
          return cb()
        } else {
          cb(new Error('请输入正确格式的游邮箱'))
        }
      }
      let checkMobile = (rules, vaule, cb) => {
        let regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if (regMobile.test(vaule)) {
          return cb()
        } else {
          cb(new Error('请输入正确格式的手机号'))
        }
      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        addDialogVisible: false,
        addUserForm: {
          username: '123',
          password: '',
          email: '',
          mobile: ''

        },
        addUserrRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              max: 10,
              min: 3,
              message: '输入长度为 3-10',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              max: 15,
              min: 6,
              message: '输入长度为 6-15',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        editDialogVisible: false,
        editUserForm:{
          username:'',
          email:'',
          mobile:''
        },
        editUserrRules:{
         email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        setRoleDialog:false,
        roleList:[],
        userInfo:{},
        roleValue:''

      }
    },
    components: {
      Breadcrumb,
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('users', {
          params: this.queryInfo
        })
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message('请求用户列表失败')
        }
        this.userList = res.data.users
        this.total = res.data.total
      },
      //改每页几条
      handleSizeChange(val) {
        this.queryInfo.pagesize = val
        this.getUserList()
      },
      //第几页
      handleCurrentChange(val) {
        this.queryInfo.pagenum = val
        this.getUserList()

      },
      //修改状态
      async statusChange(userinfo) {
        const {
          data: res
        } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        // console.log(res);
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          this.$message.error('修改状态失败')
          return
        }
        this.$message.success('修改状态成功')
      },

      //关闭添加用户，重置表单
      addDialogClose() {
        this.$refs.addUserFrom.resetFields()
      },
      addUser() {
        this.$refs.addUserFrom.validate(async valid => {
          if (!valid) {
            return
          }
          let {
            data: res
          } = await this.$http.post('users', this.addUserForm)

          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          this.getUserList()
        })
      },
       editDialogClose() {
        this.$refs.editUserFrom.resetFields()
      },
      async findUserById(id){
        let {data :res} = await this.$http.get('users/'+id)
        if(res.meta.status !==200){ return this.$message.error('获取用户数据失败')}
        this.editUserForm = res.data
        this.editDialogVisible =true
      },
      editUser(){
        //提交预判断
        this.$refs.editUserFrom.validate( async valid =>{
         
         if (!valid){return}
          let {data :res} = await this.$http.put('users/'+this.editUserForm.id,
          {email:this.editUserForm.email,mobile:this.editUserForm.mobile})

          if(res.meta.status !==200){
            return this.$message.error('修改失败')
          }
          this.$message.success('修改成功')
          this.getUserList()
          this.editDialogVisible = false
          this.editDialogClose()
          
        })
        
      },
       delUser(id){
       
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
          let  {data: res} = await this.$http.delete('users/'+id) 
          if(res.meta.status !==200) { return this.$message.error('删除失败')}

          this.$message.success('删除成成功')
          this.getUserList()

        }).catch(() =>{
          this.$message.info('已经取消删除用户')
        })
      },
      // 分配用户角色弹窗
      async showSetRoleDialog(user){
        this.setRoleDialog = true
        this.userInfo = user

        let {data:res} = await this.$http.get('roles')
        if(res.meta.status !==200){
          this.$message.error('获取角色列表失败')
           this.setRoleDialog = false
          return }
        this.roleList = res.data
      },
      async updateRole(){
        let {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.roleValue})
        if(res.meta.status !==200){return this.$message.error('角色分配失败')}

        this.userInfo ={},
        this.roleValue=""
        this.getUserList()
        this.setRoleDialog = false
        this.$message.success('分配角色成功')
      }
    },
  }
</script>

<style lang="less" scope>
  .el-table {
    margin: 10px 0;
  }
</style>
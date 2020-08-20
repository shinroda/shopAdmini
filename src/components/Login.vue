<template>
  <div class="login_contanier">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/avatar.jpg">
      </div>
      <!-- 表单 -->
      <el-form ref="loginFromRef"
        label-width="0px" class="login_from"
       :model="loginFrom"  :rules="loginFromRules">
         <!-- 用户名 -->
        <el-form-item  prop="username">
          <el-input 
          prefix-icon="el-icon-user-solid"
          v-model="loginFrom.username"></el-input>
        </el-form-item>
         <!-- 密码 --> 
        <el-form-item prop="password" >
          <el-input
           prefix-icon="el-icon-lock"
           v-model="loginFrom.password"
           type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="buttons">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>  
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loginFrom:{
          username:'admin',
          password:'123456'
        },
        loginFromRules:{
          username:[{ required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
          password:[{ required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 10 个字符', trigger: 'blur' }]          
        }
      }
    },
    methods: {
      resetFrom(){
        this.$refs.loginFromRef.resetFields()
      },
      login(){
        this.$refs.loginFromRef.validate(async (valid)=>{
          if(!valid) {return false}
          //解构
          //相当于 const res = await this.$http.post('login',this.loginFrom).data
          const {data: res } = await this.$http.post('login',this.loginFrom)

          if(res.meta.status !== 200){
           this.$message({
            message: '账号或密码错误，登录失败！',
            type: 'warning'
            })
            return
          }
          this.$message({
            message: '登录成功',
            type: 'success'
          });
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        })
      }
    },
  }
</script>

<style scoped lang="less">
  .login_contanier {
    background: pink;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 100px;
      width: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #aaa;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #ddd;

      img {
        width: 100%;
        height: 100%;
      }

    }

    .login_from{
      width: 100%;
      padding: 0 20px;
      position: absolute;
      bottom: 0;

      .buttons{
        display: flex;
        justify-content: center;
      }

      
    }
  }
  
</style>
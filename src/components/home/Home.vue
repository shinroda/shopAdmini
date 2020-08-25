<template>
  <!-- <div> -->
  <!-- <el-button type="info" @click="loginout">退出</el-button> -->
  <!-- </div> -->
  <el-container class="home-container">
    <el-header>
      <div class="logo-box">
        <span>logo</span>
        <h2>后台管理</h2>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse? '200px':'64px'">
        <div class="toggle-btn" @click="isCollapse = !isCollapse">
          | | |
        </div>
        <el-menu :default-openeds="['']" 
                  background-color="#6f7765"
                  text-color="#fff"
                  unique-opened
                  :collapse="!isCollapse"
                  :collapse-transition="false"
                  router
                  :default-active="getPath">
                  <!-- active-text-color="" -->
          <!-- 一级 -->
          <el-submenu :index="item.id+''" v-for="item in  MenuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
              </template> 
              <!-- 二级 -->
             <el-menu-item :index="menuitem.path" v-for="menuitem in item.children" :key="menuitem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{menuitem.authName}}</span>
                </template>
             </el-menu-item>
          </el-submenu>

     
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>


</template>

<script>
  export default {
    data() {
      return {
        MenuList:[],
        iconList:{
          '125':'el-icon-s-custom',
          '103':'el-icon-key',
          '101':'el-icon-s-goods',
          '102':'el-icon-s-order',
          '145':'el-icon-s-marketing',
        },
        isCollapse:true,
        nowpath:''
      }
    },
    created() {
     this.getMenuList()
    },
    methods: {
      loginout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
       async getMenuList(){
        const {data: res} = await this.$http.get('menus')
        if(res.meta.status !==200) {
          this.$message({
            message: res.meta.msg,
            type: 'warning'
            
          })
          return
        }
        this.MenuList = res.data
        // console.log(res);
      },

    },

    computed: {
      getPath(){
        let a = this.$route.path.slice(1)
        // a == 'welcome' ? a= 'users' : a = a
        return a
      }
    },
  }
</script>

<style lang="less" scoped>
  .home-container {
    /* background: ; */
    height: 100%;
  }

  .el-header {
    background: #5a5d52;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo-box {
      display: flex;
      justify-items: center;

      span {
        background: cornflowerblue;
        height: 45px;
        width: 45px;
        margin-right: 20px;
      }

      h2 {
        color: #fff;
        font-size: 30px;
      }
    }

  }

  .el-aside {
    background: #6f7765;
    .el-menu{
      border-right:none ;
    }
    .toggle-btn{
      background: #9cbba7;
      text-align: center;
      color: #fff;
      padding: 3px 0;
      cursor: pointer;
    }
  }

  .el-main {
    background: #dcdedd;
  }
</style>
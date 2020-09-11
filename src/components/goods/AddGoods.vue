<template>
  <div>
    <breadcrumb :breadcrumb-item="['商品管理','商品列表','添加新商品']"></breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary"  size="medium" @click="$router.push('/goods')">取消</el-button>
        </el-col>
        <el-col :span="22"> 
          <el-alert
          title="添加新商品信息"
          type="info"
          show-icon :closable="false" center>
          </el-alert>
          </el-col>
      </el-row>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="goodsInfo" :rules="goodsRules" ref="goodsFormRef" >
        <el-tabs v-model="activeIndex" tab-position="left"
         :before-leave="tabLeava" @tab-click="tabClick">
          
          <el-tab-pane label="基本信息" name='0'>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsInfo.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsInfo.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_name">
              <el-input v-model="goodsInfo.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                    v-model="goodsInfo.goods_cat"
                    :options="cateList"
                    :props="cateProps"
                    @change="cateChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name='1'>
            <el-form-item v-for="item in manyTabData" 
                          :key="item.attr_vals"
                          :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cd" 
                v-for="(cd,i) in item.attr_vals"
                :key="i" border></el-checkbox>
              </el-checkbox-group>            
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name='2'>
            <el-form-item v-for="item in onlyTabData" 
                          :key="item.attr_vals"
                          :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name='3'>
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="headerSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">选择商品图片上传</div>
            </el-upload>

          </el-tab-pane>
          <el-tab-pane label="商品内容" name='4'>
            <quill-editor v-model="goodsInfo.goods_introduce"></quill-editor>
            <el-button type="success" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
<!-- 图片预览弹窗 -->
      <el-dialog
        title="图片预览"
        :visible.sync="picDialogVisible"
        width="50%"
        >
        <img :src="previewPath" alt="" style="width:100%">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
 import Breadcrumb from '../common/Breadcrumb'
export default {
  components:{Breadcrumb},
  data() {
    return {
      activeIndex:0,
      goodsInfo:{
        goods_name:'名称',
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_cat:'',
        pics:[],
        goods_introduce:'123',
        attrs:[]
      },
      goodsRules:{
        goods_name:[{required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price:[{required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number:[{required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight:[{required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_cat:[{required: true, message: '请输选择商品分类', trigger: 'blur' }]
      },
      cateList:[],
      cateKey:'',
      cateProps:{ expandTrigger: 'hover' ,
                  label:'cat_name',
                  value:'cat_id',
                  children:'children'
                 },
      manyTabData:[],
      onlyTabData:[],
      uploadURL:'https://www.liulongbin.top:8888/api/private/v1/upload',
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      previewPath:'',
      picDialogVisible:false
      
    }
  },
   created() {
      this.getCateList()
    },
    methods: {
     async getCateList(){
        let {data:res} = await  this.$http.get('categories')
        if(res.meta.status !==200){
          return this.$message.error('获取商品分类失败')
        }
        this.cateList = res.data
      },
      cateChange(){
        if(this.goodsInfo.goods_cat.length !== 3){
          this.goodsInfo.goods_cat=[]
        }
      },
      // 标签页改变时，判断商品分类是否选择
      tabLeava(newTab,oldTab){
        if(oldTab==='0'){
            if(this.goodsInfo.goods_cat.length!==3){
              this.$message.error('请选择商品分类')
              return false
            }
        }
        
      },
      async tabClick(){
        if(this.activeIndex === '1'){
          // 访问动态
          let {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
          {params:{sel:'many'}})

        res.data.forEach(item =>{
          item.attr_vals = 
          item.attr_vals.length ===0? [] : item.attr_vals.split(' ')
        })
          this.manyTabData = res.data
        }else if(this.activeIndex === '2'){
          let {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
          {params:{sel:'only'}})
            this.onlyTabData = res.data
        }
      },
      // 图片预览
      handlePreview(file){
        this.previewPath =file.response.data.url
        this.picDialogVisible = true
      },
      // 图片移除
      handleRemove(response){
        let delpic = response.response.data.tmp_path
        this.goodsInfo.pics = this.goodsInfo.pics.filter(obj=>{
          return obj.pic !==delpic
        })
        console.log(delpic);

      },
      // 处理图片上传成功
      headerSuccess(response, file, fileList){
        let pic = {pic:response.data.tmp_path}
        this.goodsInfo.pics.push(pic) 
      },
      // 添加商品
     addGoods(){
      this.$refs.goodsFormRef.validate(async vali =>{
        // console.log(vali);
        if(!vali){return this.$message.error('请完善商品信息')}

        // let goods = this.goodsInfo
        // 深拷贝
        let goods = _.cloneDeep(this.goodsInfo)
        goods.goods_cat = goods.goods_cat.join(',')
        this.manyTabData.forEach(item =>{
          let attrItem = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.goodsInfo.attrs.push(attrItem)
        })
        this.onlyTabData.forEach(item =>{
          let attrItem = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals
            
          }
           this.goodsInfo.attrs.push(attrItem)
        })
        goods.attrs = this.goodsInfo.attrs
       console.log(goods);
       let {data:res} = await this.$http.post('goods',goods)
       console.log(res);
       if(res.meta.status !==201){return this.$message.error('添加失败')}
      
          this.$router.push('/goods')
      this.$message.success('添加成功')
      })
      
    }
    },
    computed: {
      cateId(){
        if(this.goodsInfo.goods_cat.length ===3){
          return this.goodsInfo.goods_cat[2]
        }
      }
    },
    
}
</script>

<style lang="less" scoped>
.el-steps{
  margin: 20px 0;

}
.addBtn{
  margin-top: 15px;
}


</style>
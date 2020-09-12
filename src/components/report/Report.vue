<template>
  <div>
   <breadcrumb :breadcrumb-item="['数据统计','数据报表']"></breadcrumb>
    <div id="main" style="width: 800px;height:400px;"></div>
  </div>
</template>

<script>
 import  Breadcrumb from '../common/Breadcrumb'

import echarts from 'echarts'
export default {
  components:{
    Breadcrumb
  } ,
  data(){
    return {

    }
  },
  async mounted() {
     let {data:res} = await this.$http.get('reports/type/1')
    if(res.meta.status !==200){ return res.$meaasge.error('获取报表失败')}
    var myChart = echarts.init(document.getElementById('main'));
      // console.log(echarts);
        // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(res.data);
  },
  methods: {
    
  },

}
</script>

<style lang="less" scoped>

</style>
<template>
  <div>
    <div class="dashboard">
      <div>客户总注册人数 : {{info. user_count}}</div>
      <div>文章总发布数量 : {{info. article_count}}</div>
    </div>
    <div id="dashboard" style="height:80vh;width:100%"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { reactive, onMounted } from 'vue';
import axios from '@/axios/index.js';

let weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
let today = new Date().getDate();
today > 6 ? 0 : today + 1;
weekArr = [...weekArr.splice(today), ...weekArr];

// 基于准备好的dom，初始化echarts实例
let info = reactive({
  article_count: 0,
  user_count: 0,
  week_article: []
})
onMounted(() => {
  axios({
    url: '/admin/getPlatformInfo',
    method: 'GET'
  }).then(res => {
    console.log(res);
    let { article_count, user_count, week_article } = res.data;
    info.article_count = article_count;
    info.user_count = user_count;
    info.week_article = week_article;
    onEcharts();
  });

  function onEcharts() {
    let myChart = echarts.init(document.getElementById('dashboard'));
    // 绘制图表
    let option = {
      legend: {
        top: 'bottom'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '帖子发布量',
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 7
          },
          data: [
            { value: info.week_article[0], name: weekArr[0] },
            { value: info.week_article[1], name: weekArr[1] },
            { value: info.week_article[2], name: weekArr[2] },
            { value: info.week_article[3], name: weekArr[3] },
            { value: info.week_article[4], name: weekArr[4] },
            { value: info.week_article[5], name: weekArr[5] },
            { value: info.week_article[6], name: weekArr[6] }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
  }

})
</script>

<style>
.dashboard {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 13px;
  color: #666666;
  margin-bottom: 20px;
}
</style>
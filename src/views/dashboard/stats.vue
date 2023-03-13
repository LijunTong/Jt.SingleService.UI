<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>总访问量：{{ totalCnt }}</span>
      </div>
      <div class="stats-card">
        <div class="chart-con" ref="chartWeekTotal"></div>
      </div>
    </el-card>
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日IP访问量</span>
          </div>
          <div class="stats-card">
            <div class="chart-con" ref="chartIpToday"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>历史IP访问量</span>
          </div>
          <div class="stats-card">
            <div class="chart-con" ref="chartIpTotal"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>今日接口访问量</span>
          </div>
          <div class="stats-card">
            <div class="chart-con" ref="chartActionToday"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>历史接口访问量</span>
          </div>
          <div class="stats-card">
            <div class="chart-con" ref="chartActionTotal"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

import * as logApi from '@/api/sys_log'

export default {
  name: 'stats',
  mounted() {
    this.init()
  },
  data() {
    return {
      totalCnt: 0,
      weekTotal: [],
      ipToday: [],
      ipTotal: [],
      actionToday: [],
      actionTotal: []
    }
  },
  methods: {
    init() {
      this.chartWeekTotal = echarts.init(this.$refs.chartWeekTotal);
      this.chartIpTotal = echarts.init(this.$refs.chartIpTotal);
      this.chartIpToday = echarts.init(this.$refs.chartIpToday);
      this.chartActionTotal = echarts.init(this.$refs.chartActionTotal);
      this.chartActionToday = echarts.init(this.$refs.chartActionToday);
      this.getTotal()
      this.getWeekTotal()
      this.getIpToday()
      this.getIpTotal()
      this.getActionToday()
      this.getActionTotal()
    },
    getTotal() {
      logApi.getTotalStats().then(res => {
        if (res.code === 1) {
          this.totalCnt = res.data
        }
      })
    },
    getWeekTotal() {
      this.chartWeekTotal.showLoading();
      logApi.getWeekTotalStats().then(res => {
        if (res.code === 1) {
          this.weekTotal = res.data
          this.initChart(this.chartWeekTotal, '访问量', 'line', res.data)
        }
      }).finally(() => {
        this.chartWeekTotal.hideLoading();
      })
    },
    getIpTotal() {
      this.chartIpTotal.showLoading();
      logApi.getIpStats().then(res => {
        if (res.code === 1) {
          this.ipTotal = res.data
          this.initChart(this.chartIpTotal, '访问量', 'bar', res.data)
        }
      }).finally(() => {
        this.chartIpTotal.hideLoading();
      })
    },
    getIpToday() {
      this.chartIpToday.showLoading();
      logApi.getTodayIpStats().then(res => {
        if (res.code === 1) {
          this.ipToday = res.data
          this.initChart(this.chartIpToday, '访问量', 'bar', res.data)
        }
      }).finally(() => {
        this.chartIpToday.hideLoading();
      })
    },
    getActionTotal() {
      this.chartActionTotal.showLoading();
      logApi.getActionStats().then(res => {
        if (res.code === 1) {
          this.actionTotal = res.data
          this.initChart(this.chartActionTotal, '访问量', 'bar', res.data)
        }
      }).finally(() => {
        this.chartActionTotal.hideLoading();
      })
    },
    getActionToday() {
      this.chartActionToday.showLoading();
      logApi.getTodayActionStats().then(res => {
        if (res.code === 1) {
          this.actionToday = res.data
          this.initChart(this.chartActionToday, '访问量', 'bar', res.data)
        }
      }).finally(() => {
        this.chartActionToday.hideLoading();
      })
    },
    initChart(chart, name, type, data) {
      //配置数据
      let option = {
        grid: { top: "30px", left: "50px", right: "30px", bottom: "30px" },
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            let dataStr = `<div><p style="font-weight:bold;margin:0 8px 15px;">${params[0].data.key}</p></div>`
            dataStr += `<div>
                          <div style="margin: 0 8px;">
                            <span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${params[0].color};border-radius:50%;"></span>
                            <span>访问量</span>
                            <span style="float:right;color:#fff;margin-left:20px;">${params[0].data.value}</span>
                          </div>
                        </div>`
            return dataStr
          }
        },
        dataset: {
          // 用 dimensions 指定了维度的顺序。直角坐标系中，如果 X 轴 type 为 category，
          // 默认把第一个维度映射到 X 轴上，后面维度映射到 Y 轴上。
          // 如果不指定 dimensions，也可以通过指定 series.encode
          dimensions: ['key', 'value'],
          source: data
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{
          type: type, smooth: true, name: name
        }]
      };
      // 4.传入数据
      chart.setOption(option);

      window.onresize = () => {
        chart.resize()
      };

    },
    handleClick(tab, event) {
      switch (tab.name) {
        case 'ipToday':
          this.initChart(this.chartIpToday, '访问量', 'bar', this.ipToday)
          break;
        case 'ipHistory':
          this.initChart(this.chartIpTotal, '访问量', 'bar', this.ipTotal)
          break;
        case 'aToday':
          this.initChart(this.chartActionToday, '访问量', 'bar', this.actionToday)
          break;
        case 'aHistory':
          this.initChart(this.chartActionTotal, '访问量', 'bar', this.actionTotal)
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.stats-card {
  height: auto;
}
.chart-con {
  width: 100%;
  height: 230px;
}
.el-tabs__content {
  width: 100%;
  height: 100%;
}
</style>

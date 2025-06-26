<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:250px;">
                    <div slot="header" class="clearfix">
                        <span>各设备占比</span>
                    </div>
                    <div style="position: relative;top: -80px;">
                        <div id="devicePie" class="schartCard"></div>
                    </div>
                </el-card>
                <el-card shadow="hover" class="mgb20" style="height:250px;">
                    <div slot="header" class="clearfix">
                        <span>活跃用户占比</span>
                    </div>
                    <div class="block" style="display: flex;justify-content: center;flex-direction: column">
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex;align-items: center;margin-bottom: 5px">
                                <div>活跃用户:</div>
                                <div style="color: #67c23a;font-size: 20px">{{activeUser.activeNum}}</div>
                            </div>
                            <el-progress :text-inside="true"  :percentage="activeUser.active" :stroke-width="20" color="#67c23a"></el-progress>
                        </div>
                        <div style="margin-bottom: 20px">
                            <div style="display: flex;align-items: center;margin-bottom: 5px">
                                不活跃用户:
                                <div style="color: #f56c6c;font-size: 20px">{{activeUser.inActiveNum}}</div>
                            </div>
                            <el-progress  :text-inside="true" :percentage="activeUser.inActive" :stroke-width="20" color="#f56c6c"></el-progress>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{this.card.userNum}}</div>
                                    <div>系统用户</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-setting grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{this.card.devicesNum}}</div>
                                    <div>接入设备</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-mobile grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{this.card.directivesNum}}</div>
                                    <div>今日指令</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" style="font-size: 20px">
                        <span>各时间段指令次数统计</span>
                    </div>
                    <div id="directives" class="schart"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12" class="test">
                <el-card shadow="hover" style="width: 100%;justify-content: center;align-content: center">
                    <div id="devicesCount" class="schart"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import echarts from '../components/v-echarts';
    import {getAnalyseCard, getDevicePie,getActiveUser,getTimePeriod,getDeviceLine} from '@/api/api'

    export default {
        name: 'dashboard',
        data() {
            return {
                card: {},
                devicePie: {
                    tooltip: {
                        trigger: 'item'
                    },
                    series: [
                        {
                            name: false,
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '70%'],
                            startAngle: 180,
                            endAngle: 360,
                            data: []
                        }
                    ]
                },
                activeUser:{
                    activeNum:0,
                    active:0,
                    inActiveNum:0,
                    inActive:0
                },
                directivesOpt:{
                    title: {
                        text: '仅显示有记录时间段',
                        left: 'center',
                        textStyle:{
                            color:"#959393",
                            fontSize:18,
                            fontWeight:"normal"
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: { type: ['line', 'bar'] },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: [],
                            type: 'bar',
                            color:"#2f80ed",
                            markPoint: {
                                data: [
                                    { type: 'max', name: '最大值',itemStyle:{color:"#8849ec" }},
                                    { type: 'min', name: '最小值' ,itemStyle:{color:"#ef1616"}}
                                ]
                            },
                        }
                    ]
                },
                devicesCount:{
                    title: {
                        text: '近五日各设备使用次数统计'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['灯', '窗帘', '风扇', '插座', '锁','空调']
                    },
                    toolbox: {
                        feature: {
                            magicType: { type: ['line', 'bar','stack', 'tiled'] },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '灯',
                            type: 'line',
                            // stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: []
                        },
                        {
                            name: '窗帘',
                            type: 'line',
                            // stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: []
                        },
                        {
                            name: '风扇',
                            type: 'line',
                            // stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: []
                        },
                        {
                            name: '插座',
                            type: 'line',
                            // stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: []
                        },
                        {
                            name: '锁',
                            type: 'line',
                            // stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: []
                        },
                        {
                            name: '空调',
                            type: 'line',
                            // stack: 'Total',
                            label: {
                                show: true,
                                position: 'top'
                            },
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: []
                        }
                    ]
                }
            };

        },
        components: {
            Schart,
            echarts
        },
        created() {
            this.getAnalyseData();
            this.getDevicePieData()
            this.getActiveUserData()
            this.getTimePeriodData()
            this.getDeviceLineData()
        },
        mounted() {

        },
        methods: {
            getAnalyseData() {
                getAnalyseCard().then(res => {
                    if (res.code === 0 && res.data != null) {
                        this.card = res.data
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            getDevicePieData() {
                getDevicePie().then(res => {
                    if (res.code === 0 && res.data.length!==0) {
                        this.devicePie.series[0].data = res.data.map(obj => {
                            switch (obj.name) {
                                case "light":
                                    obj.name = "灯"
                                    break
                                case  "curtain":
                                    obj.name = "窗帘"
                                    break
                                case  "wind":
                                    obj.name = "风扇"
                                    break
                                case  "receptacle":
                                    obj.name = "插座"
                                    break
                                case  "lock":
                                    obj.name = "锁"
                                    break
                                case  "airConditioning":
                                    obj.name = "空调"
                                    break
                            }
                            return obj
                        })
                        this.drawT('devicePie', this.devicePie)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            getActiveUserData(){
                getActiveUser().then(res=>{
                    if (res.code===0&&res.data!==null){
                        let sum=res.data.sum
                        let activeNum=res.data.activeNum
                        let inActiveNum=res.data.inActiveNum
                       if (sum!==0){
                          this.activeUser={
                              activeNum:activeNum,
                              active:activeNum/sum*100,
                              inActiveNum:inActiveNum,
                              inActive:100-activeNum/sum*100
                          }
                       }
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            getTimePeriodData(){
                getTimePeriod().then(res=>{
                    if (res.code===0&&res.data.length!==0){
                        for (let i=0;i<res.data.length;i++){
                            this.directivesOpt.xAxis.data.push(res.data[i].timePeriod)
                            this.directivesOpt.series[0].data.push(res.data[i].count)
                        }
                        this.drawT("directives",this.directivesOpt)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            getDeviceLineData(){
                getDeviceLine().then(res=>{
                    if (res.code===0&&res.data!==null){
                        this.devicesCount.xAxis[0].data=res.data.xData
                        this.devicesCount.series[0].data=res.data.light
                        this.devicesCount.series[1].data=res.data.curtain
                        this.devicesCount.series[2].data=res.data.wind
                        this.devicesCount.series[3].data=res.data.receptacle
                        this.devicesCount.series[4].data=res.data.lock
                        this.devicesCount.series[5].data=res.data.airConditioning
                        this.drawT('devicesCount', this.devicesCount)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            drawT(id, opt) {
                let myChart = this.$echarts.init(document.getElementById(id));
                myChart.setOption(opt);
            }

        }
    };
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(43, 63, 239);
    }

    .grid-con-1 .grid-num {
        color: rgb(46, 143, 245);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(145, 79, 245);
    }

    .grid-con-2 .grid-num {
        color: rgb(145, 79, 245);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(238, 32, 32);
    }

    .grid-con-3 .grid-num {
        color: rgb(238, 32, 32);;
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

    .schartCard {
        width: 100%;
        height: 300px;
    }

    .schartCard1 {
        width: 100%;
        height: 300px;
    }

    .el-carousel__item h3 {
        color: #17181c;
        font-size: 14px;
        opacity: 0.75;
        text-align: center;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #24d3e3;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #c4bdff;
    }

    .test {
        width: 100%;

    }

    .stats-row {
        margin-bottom: 0;
        justify-content: center;
        align-items: center;
    }

    .stats-row .stat-item {
        display: inline-block;
        padding-right: 15px;
    }

    .art {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<template>
        <div :id="echartsId" ></div>
</template>


<script>

    export default {
        name: "echarts",
        props: {
            echartsId: {
                type: String,
                default: "",
                required: true
            },
                options:{
                type:Object,
                required:true
            }
        },
        mounted() {
           this.drawChart()
        },
        methods: {
            drawChart() {
                let myChart = this.$echarts.init(document.getElementById(this.echartsId));
                // 指定图表的配置项和数据
                let option = this.options
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);

            }
        }
    }
</script>

<style scoped>

</style>

/*
 * @Name: 饼状图组件
 * @Author: 孔团兵
 * @Date: 2018年6月7日
 * @domId:echart Dom id
 * @chartName：图名称
 * @chartData:饼图数据[{name:'堵车',value:23},{name:'迟到',value:46}]
 * @showNoData:无数据显示
 * @chartClick:父子组件通信，点击饼状图反馈父组件当前点击饼状图哪一个？ name
 * import echarts from 'echarts'
 * Vue.prototype.$echarts = echarts
 * 
 */
<style scoped>
    .pine-wrp{
        width:100%;
        height:100%;
        background-color:#ffffff;
        position: relative;
    }
    .echartContainer{
        width:100%;
        height:100%;
    }
    .no-data{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        font-size:16px;
        color:#333333;
        z-index: 2;
    }
</style>

<template>
    <div class="pine-wrp">
        <div class="echartContainer" :id="domId" v-if="chartData&&chartData.length"></div>
        <div class="no-data" v-if="noData">暂无数据</div>
    </div>
</template>

<script>
export default {
    name:'pineEchart',
    props:{
        domId:{
            require:false,
            type:String,
            default:'dom'
        },
        chartName:{
            require:false,
            type:String,
            default:"饼图"
        },
        chartData:{
            require:false,
            type:Array,
            default:[]
        },
        showNoData:{
            require:false,
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            getEchartDom:null,
        }
    },
    computed: {
        noData(){
            return this.showNoData?true:false;
        }
    },
    watch: {
       
    },
    methods: {
        initChart(){
            if(this.chartData&&this.chartData.length>0){
                //获取echarts实例
                this.getEchartDom = this.$echarts.init(document.getElementById(this.domId)); 
                this.drawChart(this.getEchartDom);
                let resizeTimeOut = null;
                //窗口变化改变echarts
                window.onresize = () => {
                    if(resizeTimeOut){
                        clearTimeout(resizeTimeOut);
                    }
                    resizeTimeOut = setTimeout(() => {
                        if(this.getEchartDom){
                            this.getEchartDom.resize();
                        }
                    }, 400);
                }
                //鼠标点击事件
                this.getEchartDom.on('click',(params)=>{
                    this.$emit('chartClick',params.data)
                })
            }
        },
        drawChart(chartDom){
            let options = {
                tooltip: {
                    formatter: "{b}: {c} ({d}%)"
                },
                legend: {
                    show:false
                },
                series: [
                    {
                        name:this.chartName,
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: true,
                        label:{
                            normal:{
                                show:true,
                                position:'outside',
                                formatter:'{b}\n{d}%'
                                // formatter:function(params){
                                //     return ''+params.name.split("").join("\n")+"\n"+params.percent+'%';
                                // }
                            }
                        },
                        data:this.chartData
                    }
                ]
            };
            chartDom.setOption(options);
        }
    },
    created () {
        
    },
    mounted () {
        this.$nextTick(()=>{
            this.initChart();
        })
    },
    updated () {
        this.$nextTick(()=>{
            this.initChart();
        })
    },
    beforeDestroy() {
		if (!this.getEchartDom) {
			return;
		}
		this.getEchartDom.dispose();
		this.getEchartDom = null;
	},
}
</script>


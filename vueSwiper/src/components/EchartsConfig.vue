<style lang="less" scoped>
    .echarts-config-wrp{
        width:100%;
        height:100%;
        position: relative;
        .echarts-wrp{
            width:100%;
            height:100%;
        }
        .no-data{
            text-align: center;
            color:#373737;
            padding-top:48px;
        }
    }
    
</style>


<template>
    <div class="echarts-config-wrp">
        <div class="echarts-wrp" :id="domId" v-if="isExitData"></div>
        <p class="no-data" v-else>暂无数据</p>
    </div>
</template>

<script>
export default {
    name:'EchartsConfig',
    props:{
        domId:{
            type:String,
            default:'EchartsDemo'
        },
        xData:{
            type:Array,
            default(){
                return [];
            }
        },
        yData:{
            type:Array,
            default(){
                return [];
            }
        },
        echartsName:{
            type:String,
            default:''
        },
        loading:{
            type:Boolean,
            default:false
        },

    },
    data(){
        return{
            getEchartDom:null,
            legendData:[],//图例组件数据
            seriesData:[],//格式化数据
        }
    },
    computed:{
        isExitData(){
            return this.yData.length>0?true:false;
        }
    },
    watch:{
        loading(newVal){
            if(newVal){
               this.getEchartDom.showLoading('default',{
                    text: 'loading',
                    color: '#4192e3',
                    textColor: '#000',
                    maskColor: 'rgba(255, 255, 255, 0.8)',
                    zlevel: 0
               }); 
            }else{
                this.getEchartDom.hideLoading(); 
            }
        }
    },
    components:{
        
    },
    methods:{
        //初始化
        initChart(){
            if(this.isExitData){
                this.getEchartDom = this.$Echarts.init(document.getElementById(this.domId)); 
                this.drawEcharts(this.getEchartDom);
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
            }else{
                if (!this.getEchartDom) {
                    return;
                }
                this.getEchartDom.dispose();
                this.getEchartDom=null;
            }
            
        },
        //绘制
        drawEcharts(echartsDom){
            this.transferData();
            echartsDom.clear();
            let options = {
                color:['#4192e3','#54da57','#005751','#ffc100','#bb30e5','#c490c0','#f35264','#9cbaff'],
                title: {//图表标题
                    text: this.echartsName
                },
                tooltip: {//鼠标悬浮提示框组件
                    trigger: 'axis',
                    show:true,
                },
                legend: {//图列组件
                    data:this.legendData,
                    left:'2%',
                    top:'12'
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {//工具栏
                    show:true,
                    feature: {
                        saveAsImage: {}
                    },
                    right:'2%'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine:{
                        show:false,
                    },
                    axisTick:{
                        show:false,
                    },
                    data: this.xData
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false,
                    }
                },
                series: this.seriesData
            };
            echartsDom.setOption(options)
        },
        transferData(){
            this.legendData=[];//图例组件数据
            this.seriesData=[];//格式化数据 
            if(this.yData.length>0){
                this.yData.forEach((item,index)=>{
                    for(var key in item){
                        if(key=='name'){
                            this.legendData.push(item[key])
                        }
                    }
                    this.seriesData.push(item);
                })
                this.seriesData.map((item,index)=>{
                    this.$set(item,'type','line')
                    this.$set(item,'stack',null)
                })
            }
        }
    },
    created(){

    },
    mounted(){
        this.$nextTick(()=>{
            this.initChart();
        })
    },
    updated(){
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





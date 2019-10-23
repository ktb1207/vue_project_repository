<style>
    .top-echarts{
        width:100%;
        height:380px;
    }
</style>

<template>
    <div class="page-wrp">
        <div class="top-echarts">
            <echarts-config dom-id="topEcharts" :x-data="chartXData" :y-data="chartYData" :loading="echartsDataLoading"></echarts-config>
        </div>
        <el-button @click="add" :disabled="disAddData">添加</el-button>
    </div>
</template>

<script>
import EchartsConfig from '../components/EchartsConfig.vue'
export default {
    name:'pageFive',
    props:{

    },
    data(){
        return{
            chartXData:['周一','周二','周三','周四','周五','周六','周7'],
            chartYData:[
                {
                    name:'音乐',
                    data:[32,12,4,24,18,56,10],
                },{
                    name:'美术',
                    data:[52,42,14,8,38,16,19],
                },{
                    name:'体育',
                    data:[45,2,8,64,38,76,14],
                },{
                    name:'课外活动',
                    data:[15,13,10,34,48,56,17],
                },{
                    name:'户外体验',
                    data:[null,null,44,64,0,36,32],
                },
            ],
            addData:[
                {
                    name:'add1',
                    data:[32,12,78,24,12,56,10],
                },{
                    name:'add2',
                    data:[52,42,14,13,38,136,19],
                },{
                    name:'add3',
                    data:[45,7,8,64,38,36,14],
                },{
                    name:'add4',
                    data:[12,13,10,34,41,56,7],
                },{
                    name:'add5',
                    data:[1,2,44,64,0,36,32],
                },
            ],
            step:0,
            disAddData:false,
            echartsDataLoading:false,
            testData:[
                {
                    name:'A分包',
                    value:[32,47,12],
                    xDate:['2018-02-12','2018-02-23','20018-06-02']
                },{
                    name:'c分包',
                    value:[32,47,12],
                    xDate:['2018-02-12','2018-02-23','20018-06-02']
                },{
                    name:'d分包',
                    value:[32,47,12],
                    xDate:['2018-02-12','2018-02-23','20018-06-02']
                }
            ]
        }
    },
    computed:{

    },
    watch:{

    },
    components:{
       EchartsConfig
    },
    methods:{
        add(){
            if(this.step>=this.addData.length){
                this.disAddData=true;
                this.chartYData=[];
                this.chartXData=[];
            }else{
               this.echartsDataLoading=true;
               setTimeout(()=>{
                    this.echartsDataLoading=false;
                    this.chartYData.push(this.addData[this.step])
                    this.step=this.step+1;
               },3200)

            }
        }
    },
    created(){
      
    },
    mounted(){

    },
    updated(){

    }
}
</script>

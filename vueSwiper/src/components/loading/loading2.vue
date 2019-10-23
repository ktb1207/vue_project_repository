<template>
    <div class="loading-wrp">
        <span :style="{backgroundColor:color}"></span>
        <span :style="{backgroundColor:color}"></span>
        <span :style="{backgroundColor:color}"></span>
        <span :style="{backgroundColor:color}"></span>
        <span :style="{backgroundColor:color}"></span>
    </div>
</template>

<script>
export default {
    name:'loading1',
    props:{
        color:{
            type:String,
            required:false,
            default:'#4ea980'
        }
    },
    data(){
        return {

        }
    }
}
</script>

<style lang="less" scoped>
    .loading-wrp{
        width:240px;
        height:240px;
        text-align: center;
        line-height: 240px;
        span{
            display: inline-block;
            width:24px;
            height:24px;
            border-radius: 12px;
            margin-right:8px;
        }
        &>span:nth-child(1){
            animation: onemove 1.2s linear infinite;
        }
        &>span:nth-child(2){
           animation: onemove 1.2s linear 0.2s infinite;
        }
        &>span:nth-child(3){
            animation: onemove 1.2s linear 0.4s infinite;
        }
        &>span:nth-child(4){
            animation: onemove 1.2s linear 0.6s infinite;
        }
        &>span:nth-child(5){
            animation: onemove 1.2s linear 0.8s infinite;
        }
    }
    @keyframes onemove {
        0%{
            transform: scale(0.2,0.2)
        }
        10%{
           transform: scale(0.6,0.6) 
        }
        20%{
            transform: scale(1,1)
        }
        60%{
            transform: scale(1,1)
        }
        80%{
            transform: scale(1,1)
        }
        100%{
            transform: scale(1,1)
        }
        
    }
</style>

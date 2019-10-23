<template>
    <div class="loading-wrp">
        <div class="loading-center">
            <div class="dot" :style="{backgroundColor:color}">
                <div class="first" :style="{backgroundColor:color}"></div>
            </div>
            <div class="dot" :style="{backgroundColor:color}"></div>
            <div class="dot" :style="{backgroundColor:color}"></div>
            <div class="dot" :style="{backgroundColor:color}"></div>
            <p :style="{color:color}"><span>加</span><span>载</span><span>中</span><span>...</span></p>
        </div>
        
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
        position: relative;
        .loading-center{
            position:absolute;
            width:80px;
            height:100px;
            left:50%;
            top:50%;
            margin-left:-40px;
            margin-top:-50px;
            .dot {
                left:35%;
                position:absolute;
                width:10px;
                height:10px;
                -webkit-border-radius:50%;
                -moz-border-radius:50%;
                border-radius:50%;
                transform-origin:10px 40px;
                animation:dotrotate 2s cubic-bezier(0.775,0.005,0.310,1.000) infinite;
                .first {
                    position:absolute;
                    width:8px;
                    height:8px;
                    top:50%;
                    left:50%;
                    margin-left:-4px;
                    margin-top:-4px;
                    border-radius:50%;
                    animation-delay:0.2s;
                    animation:1.7s dotscale cubic-bezier(0.775,0.005,0.310,1.000) infinite;
                }
            }
            .dot:nth-of-type(2) {
                animation-delay:0.2s;
            }
            .dot:nth-of-type(3) {
                animation-delay:0.3s;
            }
            .dot:last-of-type {
                animation-delay:0.4s;
            }
            p {
                font-size:12px;
                font-weight:bold;
                margin:0;
                position:absolute;
                text-align:center;
                width:100%;
                span {
                    animation:1.7s fontMove cubic-bezier(0.775,0.005,0.310,1.000) infinite;
                }
                span:nth-of-type(2) {
                    animation-delay:0.2s;
                }
                span:nth-of-type(3) {
                    animation-delay:0.3s;
                }
                span:last-of-type {
                    animation-delay:0.4s;
                }
            }
        }
        
        
        
        @keyframes dotrotate {
            0% {
                transform:rotate(0deg);
            }
            100% {
                transform:rotate(360deg);
            }
        }
        @keyframes dotscale {
            0%,10% {
                width:16px;
                height:16px;
                margin-left:-8px;
                margin-top:-8px;
            }
            50% {
                width:8px;
                height:8px;
                margin-left:-4px;
                margin-top:-4px;
            }
            90%,100% {
                width:16px;
                height:16px;
                margin-left:-8px;
                margin-top:-8px;
            }
        }
        
        @keyframes fontMove {
            0% {
                font-size:12px;
            }
            50% {
                font-size:14px;
            }
            100% {
                font-size:12px;
            }
        }
    }
    
</style>

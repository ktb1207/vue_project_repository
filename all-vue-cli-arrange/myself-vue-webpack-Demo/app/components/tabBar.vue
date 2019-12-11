
<style scoped>
    .wrp{
        color:#333333;
        font-size:16px;
        float:left;
        height:100%;
        width:auto;
        padding-left:24px;
        padding-right:24px;
        border-bottom: 2px solid #333333;
        box-sizing: border-box;
        cursor: pointer;
        position:relative;
    }
    .wrp:hover{
        color:red;
    }

    .wrp:after{

        content: "";/*单引号双引号都可以，但必须是英文*/

        width: 0;

        height: 2px; /*下划线高度*/

        background: red; /*下划线颜色*/

        position: absolute;

        top: 100%;

        left:0;

        transition: all .8s ; /*css动画效果，0.8秒完成*/

    }
    .wrp:hover:after{/*动画效果是从中间向右延伸至50%的宽度*/
        left:0; /*这句多余，主要是为了对照*/
        width: 100%;
    }
    .now-active{
        color:red;
        border-color:red;
    }
</style>

<template>
    <div class="wrp" :class="{'now-active':active}" @click="selectTab(name,active,$event)">
        <router-link :to="link" tag="li">{{name}}</router-link>
    </div>
</template>

<script>
    export default {
        props:{
            name:{
                require:true
            },
            active:{
                default:false,
                type:Boolean
            },
            link:{
                default:'*',
                type:String
            }
        },
        data:function(){
            return{

            }
        },
        mounted:function(){

        },
        methods:{
            selectTab:function(name,state,event){
                if(!state){
                    //this.isActive = !this.isActive;
                    this.$emit('selectchange',name);
                }

            }
        },
        computed:{

        }
    }
</script>


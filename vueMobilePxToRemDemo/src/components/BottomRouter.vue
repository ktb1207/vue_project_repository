<style lang="less" scoped>
    @rem:100rem;
    @active-font:#1afa29;
    @normal-font:#8a8a8a;
    .btn-wrp{
        font-size:32/@rem;
        color:@normal-font;
        height:100%;
        width:100%;
        display: flex;
        flex-direction: row;//水平
        flex-wrap:nowrap;//不换行
        justify-content: center;//水平居中
        align-items: center;//垂直居中
        .btn-item{
            flex:1 1 auto;
            height:100%;
            display: flex;
            flex-direction: column;//水平
            justify-content: center;//水平居中
            align-items: center;//垂直居中
            img{
                width:48/@rem;
                height:auto;
                display:block;
            }
            span{
                display: block;
            }
        }
        .active-item{
            color:@active-font;
        }
    }
</style>

<template>
    <div class="btn-wrp">
        <div class="btn-item" v-for="(item,index) in btnList" :class="{'active-item':index==activeIndex}" @click="switchRouter(index,item)">
            <img :src="item.activeImg" alt="导航" v-if="index==statusIndex">
            <img :src="item.normalImg" alt="导航" v-else>
            <span>{{item.name}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name:'BottomRouter',
    props:{
        btnList:{//按钮列表
            type:Array,
            default(){
                return []
            }
        },
        activeIndex:{//按钮默认激活项
            type:Number,
            default:0
        }
    },
    data(){
        return {
            
        }
    },
    computed:{
        statusIndex(){
            return this.activeIndex;   
        }
    },
    watch:{
        '$route':'changeRouter'
    },
    components:{

    },
    methods:{
        switchRouter(inx,item){
            this.$emit('btnClick',item); 
        },
        changeRouter(to,from){
            
        }
    },
    created(){

    },
    mounted(){
        this.$emit('btnClick',this.btnList[0])
    },
    beforeDestroy(){

    }
}
</script>


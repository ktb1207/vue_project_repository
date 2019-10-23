<style lang="less" scoped>
    @rem:100rem;

    .swiper-wrp{
        width:100%;
        height:420/@rem;
        .mint-swipe-item{
            img{
                width:100%;
                height:auto;
            }
        }
    }
    .item-wrp{
        width:100%;
        height:auto;
        display: flex;
        flex-direction: row;//水平
        flex-wrap:wrap;//换行
        justify-content: space-between;//水平居中
        align-items: center;//垂直居中
        .item-btn{
            flex:0 0 49.6%;
            height:320/@rem;
            margin-top:6/@rem;
            background-color:#ffffff;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            color:#ffffff;
            font-size:36/@rem;
            display: flex;
            justify-content: center;//水平居中
            align-items: center;//垂直居中
            span{
                display: block;
            }
        }
        
    }
</style>

<template>
    <div class="page-wrp">
        <div class="swiper-wrp">
            <mt-swipe :auto="4000" :prevent="true" :stopPropagation="true">
                <mt-swipe-item v-for="(item,index) in swiperImg" :key="index">
                    <img :src="item.src" :alt="item.des">
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <div class="item-wrp">
            <div class="item-btn" v-for="(item,index) in itemArr" :key="index" :style="{backgroundImage:`url(${item.src})`}">
                <span>{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import music from '@/assets/music.jpg';
import video from '@/assets/video.jpg';
import news from '@/assets/news.jpg';
import sport from '@/assets/sport.jpg';
export default {
    name:'home',
    props:{
        
    },
    data(){
        return {
            swiperImg:[
                {
                    des:'one',
                    src:'http://5.26923.com/download/pic/000/323/7d46c783cb8575a51eab5e66818d6741.jpg'
                },{
                    des:'two',
                    src:'http://img17.3lian.com/d/file/201702/28/a06c7441df52edf7e8a0fcb73737ebbf.jpg'
                },{
                    des:'three',
                    src:'http://img1.3lian.com/img13/c3/5/d/63.jpg'
                },{
                    des:'four',
                    src:'http://5.26923.com/download/pic/000/322/7e6b1027e516ad12500d69e9765c8376.jpg'
                }
            ],
            itemArr:[
                {
                    name:'音乐',
                    src:music
                },{
                    name:'视屏',
                    src:video
                },{
                    name:'新闻',
                    src:news
                },{
                    name:'体育',
                    src:sport
                }
            ]
        }
    },
    computed:{

    },
    watch:{

    },
    components:{

    },
    methods:{
        hideLoading(){
            setTimeout(()=>{
                this.$store.dispatch('switchLoading', false)
            },400)
        }
    },
    created(){

    },
    mounted(){
        this.hideLoading();
    },
    beforeDestroy(){

    }
}
</script>


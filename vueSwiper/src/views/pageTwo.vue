<style scoped>
    .scroll-wrp{
        width:760px;
        height:520px;
    }
</style>

<template>
    <div class="page-wrp">
        <div>轮播图当前页：{{nowNum}}</div>
        <div class="scroll-wrp">
            <swiper-carousel main-id="scollTopDom" scale-id="scollBtmDom" :scoll-img="imgArr" @nowPage="slideChange"></swiper-carousel>
        </div>
    </div>
</template>

<script>
    import swiperCarousel from '../components/swiperCarousel.vue';
    export default {
        name:'pageTwo',
        data(){
            return {
                imgArr:[
                    {
                        src:"http://pic.qjimage.com/ph039/high/ph1540-p01330.jpg",
                        desc:"图片1",
                        id:1
                    },{
                        src:"http://pic1.win4000.com/pic/c/37/47c71230717.jpg",
                        desc:"图片2",
                        id:2
                    },{
                        src:"http://imgsrc.baidu.com/imgad/pic/item/63d9f2d3572c11df6c83d30b692762d0f703c24c.jpg",
                        desc:"图片3",
                        id:3
                    },{
                        src:"http://p2.gexing.com/G1/M00/EB/44/rBACFFKoA4CBsqZPAAZ04nokOVo391.jpg",
                        desc:"图片4",
                        id:4
                    },{
                        src:"http://d.hiphotos.baidu.com/zhidao/pic/item/8435e5dde71190ef5542c274cc1b9d16fcfa60db.jpg",
                        desc:"图片5",
                        id:5
                    },{
                        src:"http://img17.3lian.com/201612/19/708642ae705ff0f3bbf26d8d154a41fc.jpg",
                        desc:"图片6",
                        id:6
                    }
                ],
                emptyArr:[],
                nowNum:1
            }
        },
        computed:{

        },
        components:{
            swiperCarousel
        },
        methods:{
            slideChange(index){
                this.nowNum=index;
            }
        },
        created(){

        },
        mounted(){
            
        }
    }
</script>


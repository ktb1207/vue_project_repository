
<style scoped>
    .carousel-wrp{
        width:100%;
        height:100%;
        text-align:center;
        position:relative;
    }
    .swiper-main{
        width:100%;
        height:70%;
        background-color: #000000;
    }
    .swiper-scale{
        width:100%;
        height:30%;
        background-color: #000000;
        padding-top:12px;
        padding-bottom:12px;
    }
    .swiper-main-slide{
        width:100%;
        height:100%;
        overflow: hidden;
        text-align: center;
    }
    .swiper-main-slide>img{
        height:100%;
        max-width: 100%;
    }
    
    .swiper-scale-slide>img{
        height:100%;
        max-width: 100%;
    }
    .swiper-main-scrollbar{
        background-color: #ffffff;
    }
    .swiper-scale .swiper-slide-active{
        border:1px solid red;
    }
    .swiper-no-data{
        color:#565656;
        font-size:16px;
        display: table-cell;
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
    }
</style>


<template>
    <div class="carousel-wrp">
        <div class="swiper-container swiper-main" :id="mainId" v-if="scollImg.length>0">
            <div class="swiper-wrapper swiper-main-wrapper">
                <div class="swiper-slide swiper-main-slide" v-for="item in scollImg" :key="item.id+'c'">
                    <img :src="item.src" alt="item.desc">
                </div>
            </div>
            <!-- 如果需要导航按钮 -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            <!-- 如果需要滚动条 -->
            <div class="swiper-scrollbar swiper-main-scrollbar"></div>
        </div>

        <div class="swiper-container swiper-scale" :id="scaleId" v-if="scollImg.length>0">
            <div class="swiper-wrapper">
                <div class="swiper-slide swiper-scale-slide" v-for="item in scollImg" :key="item.id+'c'">
                    <img :src="item.src" alt="item.desc">
                </div>
            </div>
        </div>
        <div v-if="scollImg.length==0" class="swiper-no-data">暂无图片</div>
    </div>
</template>

<script>
    /** 
     * create by ktb 2018/06/15
     * dependence:swiper4
     * 通过在main.js全局引入：
     * import Swiper from 'swiper';
     * import 'swiper/dist/css/swiper.css';
     * Vue.prototype.$Swiper = Swiper;
     * params {mainId}:轮播图主图id
     * params {scaleId}:轮播图缩略图id
     * params {scollImg}:图片数据
     * 
     * fallback{nowPage}:返回当前活动项索引
     * 
    */
    export default {
        name:"swiperCarousel",
        props:{
            mainId:{
                type:String,
                required:false,
                default:"domOne"
            },
            scaleId:{
                type:String,
                required:false,
                default:"domTwo"
            },
            scollImg:{
                type:Array,
                required:false,
                default:[]
            }
        },
        data(){
            return{
                
            }
        },
        computed:{

        },
        components:{
            
        },
        methods:{
            
        },
        created(){

        },
        mounted(){
            let _that=this;
            let mainSwiper = new this.$Swiper ('#'+this.mainId, {
                direction: 'horizontal',
                initialSlide:0,
                loop: true,
                grabCursor:true,
                loopedSlides: 5, //looped slides should be the same
                // 如果需要前进后退按钮
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                // 如果需要滚动条
                scrollbar: {
                    el: '.swiper-scrollbar',
                }
            })

            let scaleSwiper = new this.$Swiper ('#'+this.scaleId, {
                direction: 'horizontal',
                initialSlide:0,
                loop: true,
                grabCursor:true,
                slidesPerView : 4,
                loopedSlides: 5, //looped slides should be the same
                centeredSlides : true,
                spaceBetween:12,
                slideToClickedSlide:true,
                watchSlidesProgress : true,
                watchSlidesVisibility : true
            })

            mainSwiper.controller.control = scaleSwiper;    //双向控制
            scaleSwiper.controller.control = mainSwiper;    //双向控制

            mainSwiper.on('slideChange',function(){
                _that.$emit("nowPage",this.realIndex+1);
            });

  
        }
    }
</script>



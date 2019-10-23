
<style scoped>
    .swiper-wrp{
        width:100%;
        height:100%;
    }
    .swiper-container{
        width:100%;
        height:100%;
    }
    .swiper-slide{
        height:100%;
        width:100%;
        color:#ffffff;
        font-size:18px;
        text-align:center;
        line-height:280px;
    }
    .red-one{
        background-color:#CA4040;
    }
    .blue-one{
        background-color: #4390EE;
    }
</style>

<template>
    <div class="swiper-wrp">
        <div class="swiper-container" :id="domId">
            <div class="swiper-wrapper">
                <div class="swiper-slide red-one">Slide 1</div>
                <div class="swiper-slide blue-one">Slide 2</div>
                <div class="swiper-slide red-one">Slide 3</div>
                <div class="swiper-slide blue-one">Slide 4</div>
            </div>
             <!-- 如果需要分页器 -->
            <div class="swiper-pagination"></div>
            
            <!-- 如果需要导航按钮 -->
            <!-- <div class="swiper-button-prev"></div> -->
            <!-- <div class="swiper-button-next"></div> -->
            
            <!-- 如果需要滚动条 -->
            <!-- <div class="swiper-scrollbar"></div> -->
        </div>
    </div>
</template>

<script>
    /**
     * vue使用swiper
     * 方法一：全局引入
     * main.js:
     * import Swiper from 'swiper';
     * import 'swiper/dist/css/swiper.css';
     * Vue.prototype.$Swiper = Swiper;
     * var mySwiper = new this.$Swiper('swiper-container',{})
     * 
     * 方法二：组件引入
     * 在需要使用的组件内引入：
     * import Swiper from 'swiper';
     * import 'swiper/dist/css/swiper.css';
     * var mySwiper = new Swiper('swiper-container',{})
     * 
    */
    export default {
        name:'swiperDemo',
        props:{
            domId:{
                type:String,
                require:false,
                default:"oneDom"
            },
        },
        data(){
            return {
                
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
            var mySwiper = new this.$Swiper ('#'+this.domId, {
                direction: 'horizontal',
                loop: true,
                slidesPerView : 2,
                watchSlidesProgress : true,
                watchSlidesVisibility : true,
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable :true,
                },
                // 如果需要前进后退按钮
                // navigation: {
                //     nextEl: '.swiper-button-next',
                //     prevEl: '.swiper-button-prev',
                // },
                // 如果需要滚动条
                // scrollbar: {
                //     el: '.swiper-scrollbar',
                // },
            })
        }
    }
</script>




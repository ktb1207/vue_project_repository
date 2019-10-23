<style scoped>
    .don1{
        height:160px;
        width:240px;
        background-color: black;
        color:#ffffff;
        font-size:14px;
        text-align: center;
        line-height: 160px;
    }
    .img-list{
        width:360px;
        height:auto;
    }
    /*vue css3 transition过渡*/
    .tran-one-enter-active {    /*进入过渡动画*/
        transition: all .3s ease;
    }
    .tran-one-leave-active {    /*离开过渡动画*/
        transition: all 0.4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .tran-one-enter{    /*进入开始状态*/
        transform: translate(-240px);
    }
    .tran-one-enter-to{ /*进入结束状态*/
        transform: translate(0,0);
    }
    .tran-one-leave{    /*离开开始状态*/
        transform: translate(0,0);
        opacity: 0.8,
    }
    .tran-one-leave-to{ /*离开结束状态*/
        transform: translate(320px);
        opacity: 0;
    }
    /*vue css3 animation动画*/
    .tran-two-enter-active{
        animation:two-in 1s;
    }
    .tran-two-leave-active{
        animation: two-leave 1.2s;
    }
    @keyframes two-in{
        0% {
            transform: translateX(-240px);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes two-leave{
        0%{
            transform: rotate(0) scale(1,1);
        }
        100%{
            transform: rotate(360deg) scale(0,0);
        }
    }
    .upload-wrp{
        height:auto;
    }
    
</style>

<template>
    <div class="page-wrp">
        <button @click="changeToThumbnail">全部缩略图</button>
        <button @click="changeToOriginal">全部原图</button>
        <button type="button" @click="dialogTableVisible=true">显示dialog</button>
        <button type="button" @click="demoOne=true">显示过渡</button>
        <button type="button" @click="demoOne=false">关闭过渡</button>
        <button type="button" @click="demoTwo=true">显示动画</button>
        <button type="button" @click="demoTwo=false">关闭动画</button>
        <button type="button" @click="demoTree=true">显示animate</button>
        <button type="button" @click="demoTree=false">关闭animate</button>
        <!-- 图片预览 -->
        <div class="img-list">
            <PictureView
                :pictureList="pictureList"
                :props="defaultProps"
                @move="handleNext">
            </PictureView>
        </div>
        <div class="upload-wrp">
            <el-upload
                class="upload-demo"
                action=""
                :multiple="true"
                :on-preview="handlePreview"
                :on-remove="handleRemove">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </div>
        
        <!-- 调整element dialog -->
        <el-dialog title="收货地址" :visible.sync="dialogTableVisible" top="80px">
            <div :style="`overflow-y:auto;overflow-x:hidden;max-height:${dialogHeight}px`">
                <el-table :data="gridData">
                    <el-table-column property="date" label="日期" width="150"></el-table-column>
                    <el-table-column property="name" label="姓名" width="200"></el-table-column>
                    <el-table-column property="address" label="地址"></el-table-column>
                </el-table>
                <el-table :data="gridData">
                    <el-table-column property="date" label="日期" width="150"></el-table-column>
                    <el-table-column property="name" label="姓名" width="200"></el-table-column>
                    <el-table-column property="address" label="地址"></el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <transition name="tran-one">
            <div class="don1" v-show="demoOne">我是动画1</div>
        </transition>
        <transition name="tran-two">
            <div class="don1" v-show="demoTwo">我是动画2</div>
        </transition>
        <transition name="tran-tree">
            <div class="don1" v-show="demoTree">我是动画3</div>
        </transition>
    </div>    
</template>

<script>
    import PictureView from '../components/picturePreview/picture-preview.vue';
    export default {
        name:'pageFour',
        data(){
            return{
                pictureList: [
                    {
                        thumbnail: '/20180525091245.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
                        original: '/20180525091245.jpg'
                    },
                    {
                        thumbnail: '/20180525091249.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
                        original: '/20180525091249.jpg'
                    },
                    {
                        thumbnail: '/20180525091252.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
                        original: '/20180525091252.jpg'
                    },
                    {
                        thumbnail: '/20180525091253.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
                        original: '/20180525091253.jpg'
                    }
                ],
                defaultProps: {
                    originalKey: 'original',
                    thumbnailKey: 'thumbnail',
                    domain: 'http://p09vugqdu.bkt.clouddn.com'
                },
                dialogTableVisible:false,
                gridData: [
                    {
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }
                ],
                dialogHeight:450,
                demoOne:false,
                demoTwo:false,
                demoTree:false,
                fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
            }
        },
        computed:{

        },
        components:{
            PictureView,
        },
        methods:{
            handleNext(data) {
                console.log(data);
            },
            changeToThumbnail() {
                this.defaultProps.originalKey = 'thumbnail';
            },
            changeToOriginal() {
                this.defaultProps.originalKey = 'original';
            },
            //图片上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            }
        },
        created(){

        },
        mounted(){
            this.dialogHeight = window.innerHeight-240;
        }
    }
</script>


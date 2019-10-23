<style scoped>
    .drag-wrp{
        width:100%;
        height:420px;
        border:1px solid aqua;
        position:relative;
    }
    .drag-btn{
        width:60px;
        height:60px;
        background-color: brown;
        color:#fff;
        text-align: center;
        line-height: 60px;
        cursor: move;
        position:absolute;
        left:0;
        top:0;
        user-select: none;
    }
</style>


<template>
    <div class="drag-wrp">
        <div class="drag-btn" ref="drag" @mousedown="startMove" @mousemove="dragMove">拖拽我</div>
    </div>
</template>

<script>
    export default {
        name:"dragDemo",
        props:{},
        data(){
            return{
                ph:0,   //外层容器高
                pw:0,   //外层容器宽
                mh:0,   //拖放元素高
                mw:0,   //拖放元素宽
                startX:0,   //移动开始x坐标
                startY:0,   //移动开始y坐标
                isDown:false,           //鼠标是否按下
            }
        },
        computed:{

        },
        methods:{
            startMove(event){
                this.isDown=true;
                this.startX=event.clientX-this.$refs.drag.offsetLeft;
                this.startY=event.clientY-this.$refs.drag.offsetTop;
            },
            dragMove(event){
                if(this.isDown){
                    this.$refs.drag.style.left=event.clientX-this.startX+"px";
                    this.$refs.drag.style.top=event.clientY-this.startY+"px";
                    //边界
                    if(event.clientX-this.startX<=0){
                        this.$refs.drag.style.left=0+"px";
                    }
                    if(event.clientY-this.startY<=0){
                        this.$refs.drag.style.top=0+"px";
                    }
                    if(event.clientX-this.startX>=this.pw-this.mw){
                        this.$refs.drag.style.left=this.pw-this.mw+"px";
                    }
                    if(event.clientY-this.startY>=this.ph-this.mh){
                        this.$refs.drag.style.top=this.ph-this.mh+"px";
                    }
                }
            },
        },
        created(){

        },
        mounted(){
            this.pw=parseInt(window.getComputedStyle(this.$refs.drag.parentNode).width);
            this.ph=parseInt(window.getComputedStyle(this.$refs.drag.parentNode).height);
            this.mw=parseInt(window.getComputedStyle(this.$refs.drag).width);
            this.mh=parseInt(window.getComputedStyle(this.$refs.drag).height);
            document.onmouseup=()=>{
                this.isDown=false;
            }
        }
    }
</script>



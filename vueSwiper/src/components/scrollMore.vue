<style scoped>
    .table-wrp{
        width:100%;
        height:auto;
    }
    .tittle-header{
        font-size:20px;
        color: #000000;
        font-weight: 600;
        padding-left:32px;
        padding-right:32px;
        border-left:3px solid #004CC8;
        margin-top:4px;
        line-height: 20px;
    }
    .more-icon-style{
        font-size:18px;
        color:#585858;
        float:right;
    }
    .more-icon-style:hover{
        color:#999999;
    }
    .more-table{
        margin-top:18px;
        padding-left:32px;
        padding-right:32px;
        font-size:16px;
        box-sizing: border-box;
        width:100%;
        table-layout:fixed; 
        color:#383838;
    }
    .more-table>tbody>tr{
        height:36px;
        line-height: 36px;
    }
    .more-table>tbody>tr:first-child,.more-table>tbody>tr:last-child{
        color:#888888;
    }
    .more-table>tbody>tr>td:nth-child(1){
        width:32px;
    }
    .more-table>tbody>tr>td:nth-child(2){
        word-break:keep-all;/* 不换行 */  
        white-space:nowrap;/* 不换行 */  
        overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */  
        text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用*/  
    }
    .more-table>tbody>tr>td:nth-child(3){
        width:186px;
        text-align: right;
    }
    .el-button{
        padding:2px 15px;
    }
</style>


<template>
    <div class="table-wrp">
        <div class="tittle-header text-overflow">
            <span>{{myTittle}}</span>
            <el-tooltip class="item" effect="dark" content="展开更多" placement="left-start">
                <el-button type="text" icon="more" class="more-icon-style"  @click="showMore()"></el-button>
            </el-tooltip>
        </div>
        <table class="more-table">
            <tbody>
                <tr v-for="item in limitData">
                    <td>{{item.order}}、</td>
                    <td>{{item.content}}</td>
                    <td>{{item.date}}</td>
                </tr>
            </tbody>
        </table>
        <el-dialog :title="myTittle" :visible.sync="dialogTableVisible" @close="hideMore()">
            <el-table :data="initData">
                <el-table-column property="order" label="序号" width="150"></el-table-column>
                <el-table-column property="content" label="名称"></el-table-column>
                <el-table-column property="date" label="日期" width="240"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'scrollMore',
    props:{
        myTittle:{
            require:true,
            type:String,
            default:"标题"
        },
        listArr:{
            require:true,
            type:Array,
            default:[]
        },
        limit:{
            require:false,
            type:Number,
            default:4
        },
        autoScoll:{
            require:false,
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            initData:this.listArr,      //原始数据
            limitData:this.listArr.slice(0,this.limit), //截取数据
            dialogTableVisible:false,    //更多是否展示
            loop:null,                  //setInterval返回对象
            loopIndex:0                 //记录当前滚动位置
        }
    },
    computed:{
        
    },
    methods:{
        // 循环滚动
        delayScoll(index){
            let i = index;
            const maxLg = this.initData.length;
            this.loop = setInterval(()=>{
                //滚动到最后从前开始
                if(i>=maxLg){
                    i = 0;
                }
                //截取指定项显示
                this.limitData = this.initData.slice(i,i+this.limit);
                //如果截取数组长度小于指定显示长度，则进行从原始数组开始项截取部分项补全当前数组
                if(this.limitData.length<this.limit){
                    let differ = this.limit - this.limitData.length;
                    let completArr = this.initData.slice(0,differ);
                    this.limitData = this.limitData.concat(completArr);
                }
                i++;
                //记录当前循环位置
                this.loopIndex = i;
            },1800)
            
        },
        showMore(){
            this.dialogTableVisible = !this.dialogTableVisible;
            if(this.loop){
                clearInterval(this.loop);
            }
            
        },
        hideMore(){
            //从上次滚动位置继续滚动
            if(this.autoScoll){
                this.delayScoll(this.loopIndex)
            }
            
        }
    },
    mounted(){
        if(this.autoScoll){
            this.delayScoll(0)
        }
        
    }
}
</script>


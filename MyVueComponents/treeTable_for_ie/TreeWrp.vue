<!--
    Attributes:
        :columns-表格列 array 
        :tree-data 表格tree平行数据
        :spread-num 表格默认展开层级

    Events:
        @checkRow 复选框勾选事件 回调参数：[id,id]
        @clickRow 节点名称项点击选择 回调参数：tree-data项obj
-->

<style lang="less">
    @basic-font:#3b3b3b;
    @color-font:#a1adcf;
    @border-color:#dce8ed;
    .tree-wrp{
        width:100%;
        height:auto;
        overflow-x: auto;
        position:relative;
        div{
            box-sizing: border-box;
        }
        .define-table{
            min-width:100%;
            .define-body{
                min-width: 100%;
                display: inline-block;
                overflow-y: hidden;
                color:@basic-font;
                border-style: solid solid none solid;
                border-width: 1px;
                border-color: @border-color;
                .define-header-row{
                    white-space: nowrap;
                    line-height: 44px;
                    font-weight: 700;
                    border-bottom:1px solid @border-color;
                    background-color: #e6e9f1;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: flex-start;

                }
                .define-body-row{
                    white-space: nowrap;
                    line-height: 38px;
                    font-weight: normal;
                    color:@color-font;
                    border-bottom:1px solid @border-color;
                    display:flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                }
            }
            
            .define-cell{
                display: inline-block;
                padding:0 8px;
                vertical-align: middle;
                box-sizing: border-box;
                border-right:1px solid @border-color;
                text-align: center;
                margin:0;
                flex:0 0 auto;
            }
            
        }
    }
    .tree-table{
        min-width:100%;
        table-layout:fixed;
        word-wrap: break-word; 
        word-break: break-all;
        thead{
            font-size:14px;
            color:@basic-font;
            font-weight: 700;
            background-color: #e6e9f1;
            tr{
                line-height: 40px;
            }
        }
        tbody{
            font-size:14px;
            color:@color-font;
            background-color: #ffffff;
            tr{
                line-height: 36px;
            }
        }
        td{
            padding:0 8px;
            border:1px solid #e7e7e7;
            word-break: keep-all;
            white-space:nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
        }      
    }

    
</style>
<style lang="less">
    .tree-table{
        .el-checkbox__input.is-checked .el-checkbox__inner{
            background-color: #ffffff !important;
        }
        .el-checkbox__inner::after{
            border-color:#0190fe;
        }
    }
    
</style>


<template>
    <div class="tree-wrp">
        <el-checkbox-group v-model="checkList" @change="checkBoxChange">
            <div class="define-table">
                <div class="define-body">
                    <div class="define-header-row">
                        <div class="define-cell" v-for="item in columns" :style="{width:item.width,textAlign:item.align,flexGrow:item.grow}">{{item.title}}</div>
                    </div>
                    <tree-content v-for="item in formaterTreeData" :key="item.id+'c'" :content-obj="item"
                        :content-col="columns" :dom-index="1" :show-node="spreadNum"
                        @nodeClick="selectNodeName"></tree-content>
                </div>
            </div>
        </el-checkbox-group>   
    </div>
</template>

<script>
    import TreeContent from './TreeContent.vue';
    export default {
        name:'TreeWrp',
        props:{
           columns:{//列项
               type:Array,
               default(){
                   return []
               }
           },
           treeData:{//tree数据
               type:Array,
               default(){
                   return []
               }
           },
           spreadNum:{//展开第几项，0即展开所有
               type:Number,
               default:0
           }
        },
        data(){
            return {
                checkList:[],   //勾选值
                saveTreeData:this.treeData, //保存原始数据
                saveSpreadNum:this.spreadNum,//保存展开项控制
            }
        },
        computed:{
            formaterTreeData(){
                return this.dataTreeFirst(this.saveTreeData);
            }
        },
        components:{
            TreeContent
        },
        watch:{
           treeData(newVal,oldVal){ //监听父tree数据改变重新保存
               this.saveTreeData=newVal;
           },
           spreadNum(newVal,oldVal){//监听切换展开层级
               this.checkList=[];//清空复选项
               this.addSelect();//初始化tree
           }
        },
        methods:{
            //对原始数据新增selected,勾选框文字
            addSelect(){
                this.saveTreeData.map((item,index)=>{
                    this.$set(item,'selected',false);
                    this.$set(item,'checkText','');
                });
            },
            //先把父亲节点取出来，放进一个数组
            dataTreeFirst(datas) {
                var dataArray = [];
                datas.forEach((item,index)=>{
                    if(item.parentId==null||item.parentId==''){
                        dataArray.push(item);
                    }
                });
                //检测原始数据是否含有选择项
                let isExzitSelected=datas.some((item,index)=>{
                    return item.selected==true;
                })
                //修改selected，默认选择根节点第一项
                if(!isExzitSelected){
                    dataArray.map((item,index)=>{ 
                        if(index==0){
                            this.$set(item,'selected',true);
                            this.$emit('clickRow',item);
                        }
                    });
                }
                return this.dataTreeDG(datas, dataArray);
            },
            //递归所有数据，创建tree结构
            dataTreeDG(datas, dataArray) {
                /*
                *@param {Object} datas  所有数据
                *@param {Object} dataArray 父节点组成的数组
                */
                for(var j = 0; j < dataArray.length; j++) {
                    var dataArrayIndex = dataArray[j];
                    var childrenArray = [];
                    var parentCode = dataArrayIndex.id;

                    for(var i = 0; i < datas.length; i++) {
                        var data = datas[i];
                        var toCode = data.parentId;
                        if(toCode == parentCode) {  //判断是否为儿子节点
                            childrenArray.push(datas[i]);
                        }

                    }
                    dataArrayIndex.children = childrenArray;
                    if(childrenArray.length > 0) {  //有儿子节点则递归
                        this.dataTreeDG(datas, childrenArray);
                    }

                }
                return dataArray;
            },
            selectNodeName(obj){
                //根据点击修改选中项
                this.saveTreeData.forEach((item,index)=>{
                    if(obj.id==item.id){
                        this.$set(item,"selected",true);
                    }else{
                        this.$set(item,"selected",false);
                    }
                })
                this.$emit('clickRow',obj);
            },
            checkBoxChange(arr){
                this.$emit('checkRow',arr);
            }
        },
        created(){

        },
        mounted(){
            this.$nextTick(()=>{
                this.addSelect();
            })
        },
        updated(){
            this.$nextTick(()=>{

            })
        }
    }
</script>



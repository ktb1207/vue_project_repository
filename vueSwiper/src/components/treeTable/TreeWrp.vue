<!--
    Attributes:
        :columns-表格列 array 
        {
            type: selection 选择框,node 节点树,text 普通文本
            title: 表格列标题,
            key: 表格列数据对应键标识,
            width: 列宽 
            align: 单元格对齐方式,
            grow: 单元格flex布局是否伸展剩余空间
        }
        :tree-data 表格tree平行数据
        {
            源数据：
            id:数据id
            pid:数据父id

            修改增加字段：
            selected:选中当前行
            disabled:禁止勾选行
        }
        :spread-num 表格默认展开层级
        parent-id-name 配置指定tree根节点名称
        :row-click 是否允许点击切换行
        :exist-data 是否有无数据
    Events:
        @checkRow 复选框勾选事件 回调参数：[id,id]
        @clickRow 节点行项点击选择 回调参数：tree-data项obj，每一列的key项columns.key
-->

<style lang="less">
    @basic-font:#383838;
    @color-font:#383838;
    @border-color:#c3e0f5;
    @head-bg:#D7EBF9;
    .tree-wrp{
        width:100%;
        height:auto;
        overflow-x: auto;
        position:relative;
        border-width:1px;
        border-style:solid solid none solid;
        border-color:@border-color;
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
                border-bottom:1px solid @border-color;
                .define-header-row{
                    white-space: nowrap;
                    line-height: 42px;
                    font-weight: normal;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                    background-color: @head-bg;
                    .define-cell:last-child{
                        border-right:none;
                    }
                }
                .define-header-bottom-border{
                    border-bottom:1px solid @border-color;
                }
                .define-body-row{
                    white-space: nowrap;
                    line-height: 38px;
                    font-weight: normal;
                    color:@color-font;
                    border-top:1px solid @border-color;
                    display:flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                    .define-cell:last-child{
                        border-right:none;
                    }
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
        .tree-content .define-cell .el-checkbox{
            .el-checkbox__input.is-disabled .el-checkbox__inner{
                background-color:#dddddd;
                border-color: #dddddd;
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
            &::after{
                border-color:#0190fe;
            }
        } 
    }
    
</style>


<template>
    <div class="tree-wrp">
        <el-checkbox-group v-model="checkList">
            <div class="define-table">
                <div class="define-body">
                    <div class="define-header-row" :class="{'define-header-bottom-border':!existData}">
                        <div class="define-cell" v-for="item in columns" :style="{width:item.width,textAlign:item.align,flexGrow:item.grow}">{{item.title}}</div>
                    </div>
                    <div v-if="existData">
                        <tree-content 
                            v-for="item in formaterTreeData" :key="item.id+'c'" 
                            :content-obj="item"
                            :content-col="columns" 
                            :dom-index="1" 
                            :show-node="spreadNum" 
                            :row-click="rowClick"
                            @nodeClick="selectNodeName"></tree-content>
                    </div>
                    <no-data v-else></no-data>
                </div>
            </div>
        </el-checkbox-group> 
         
    </div>
</template>

<script>
    import TreeContent from './TreeContent.vue';
    import NoData from '@/components/NoData.vue';
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
           },
           parentIdName:{//tree根节点名称
                type:String,
                default:'parentId'
           },
           rowClick:{//是否允许点击节点名称
                type:Boolean,
                default(){
                    return false
                }
           },
           existData:{
               type:Boolean,
               default:false,
           }
        },
        data(){
            return {
                checkList:[],  //勾选值 
                saveTreeData:this.treeData, //保存原始数据
                saveSpreadNum:this.spreadNum,//保存展开项控制
                saveTreeSelectedRow:false,//保存记录源数据是否包含选中行
            }
        },
        computed:{
            formaterTreeData(){
                return this.parseList(this.saveTreeData);
            }
        },
        components:{
            TreeContent,
            NoData
        },
        watch:{
           treeData(newVal,oldVal){ //监听父tree数据改变重新保存
               this.saveTreeData=newVal;
               console.log('数据更新了...');
           },
           spreadNum(newVal,oldVal){//监听切换展开层级
               this.checkList=[];//清空复选项
               this.addSelect();//初始化tree
           },
           checkList(newVal,oldVal){
               this.$emit('checkRow',newVal);
           },
           saveTreeData(newVal,oldVal){
               if(newVal.length>0){
                   this.addSelect();
               }
           },
           //无数据清空勾选
           existData(newVal,oldVal){
               if(!newVal){
                   this.checkList=[];
               }
           }
        },
        methods:{
            //对原始数据新增selected,禁止勾选状态属性
            addSelect(){
                this.saveTreeData.map((item,index)=>{
                    if(!item.selected){
                        //如果源数据项存在选中状态则不改变，否则取消选中状态
                        this.$set(item,'selected',false);
                    }
                    if(!item.disabled){
                        //如果源数据项存在禁止状态则不改变，否则取消禁止状态
                        this.$set(item,'disabled',false);
                    }
                });

                //检测原始数据是否含有选择项
                this.saveTreeSelectedRow=this.saveTreeData.some((item,index)=>{
                    return item.selected==true;
                })
                /** 
                 * 修改selected
                 * 如果源数据没有选中项则继续判断勾选框有没有选中数据
                 * 如果有选中数据则默认选中勾选款保存对应第一个数据
                 * 否则没有默认选择项
                */
                if(!this.saveTreeSelectedRow){
                    if(this.checkList.length>0){
                        this.saveTreeData.forEach((item,index)=>{
                            if(item.id==this.checkList[0]){
                                this.$set(item,'selected',true);
                                this.$emit('clickRow',item,'undefind','undefined');
                            }
                        })
                    }  
                }
            },
            parseList(list){
                //创建一个对象命名为map
                var map={};
                //通过遍历把list中的元素放到map对象中
                list.forEach(item=>{
                    this.$set(item,'children',[])//出发vue更新
                    if(!map[item.id]){
                        //核心步骤1：map中的'item.id'属性指向list数组中的对象元素
                        map[item.id]=item;
                    }
                });
                //再次遍历为了对map属性所指的对象进行处理
                list.forEach(item=>{
                    //过滤父级id不是null的元素
                    if(item[this.parentIdName]!=null){
                        //map[item.pid]为该元素的父级元素
                        map[item[this.parentIdName]].children.push(item)
                    }
                });
                //过滤后仅剩下根节点
                let filterArr=list.filter(item=>{
                    if(item[this.parentIdName]===null){
                        return item;
                    } 
                });
                //首次加载默认选中第一个根节点行
                filterArr.forEach((ele,index)=>{
                    if(!this.saveTreeSelectedRow&&index==0){
                        this.$set(ele,'selected',true);
                        this.$emit('clickRow',ele,'undefind','undefined');
                    }
                })
                //console.log("数据构建完成！");
                return filterArr;
            },
            //先把父亲节点取出来，放进一个数组
            // dataTreeFirst(datas) {
            //     let dataArray = [];
            //     let rootIdArr=[];//保存添加根节点id
            //     datas.forEach((item,index)=>{
            //         if(item[this.parentIdName]==null||item[this.parentIdName]==""){
            //             dataArray.push(item);
            //             rootIdArr.push(item.id);

            //         }
            //     });
            //     dataArray.map((item,index)=>{ 
            //         item['rootId']=item.id;//根节点id为自己id
            //         //首次加载默认选中第一个根节点行
            //         if(!this.saveTreeSelectedRow&&index==0){
            //             this.$set(item,'selected',true);
            //             this.$emit('clickRow',item,'undefind','undefined');
            //         }
            //     });
            //     return this.dataTreeDG(datas, dataArray,rootIdArr);
            // },
            //递归所有数据，创建tree结构
            // dataTreeDG(datas, dataArray,rootArr) {
            //     /*
            //     *@param {Object} datas  所有数据
            //     *@param {Object} dataArray 父节点组成的数组
            //     */
            //     for(var j = 0; j < dataArray.length; j++) {
            //         var dataArrayIndex = dataArray[j];
            //         var childrenArray = [];
            //         var parentCode = dataArrayIndex.id;
            //         var rootNodeId=rootArr[j];
            //         for(var i = 0; i < datas.length; i++) {
            //             var data = datas[i];
            //             var toCode = data[this.parentIdName];
            //             if(toCode == parentCode) {  //判断是否为儿子节点
            //                 datas[i].rootId=rootNodeId;
            //                 childrenArray.push(datas[i]);
            //             }

            //         }
            //         this.$set(dataArrayIndex,'children',childrenArray)
            //         if(childrenArray.length > 0) {  //有儿子节点则递归
            //             var createRootArr=[];//继承保存添加根节点id
            //             childrenArray.forEach((item,index)=>{
            //                 createRootArr.push(item.rootId)
            //             })
            //             this.dataTreeDG(datas, childrenArray,createRootArr);
            //         }

            //     }
            //     console.log('数据构建完成！');
            //     return dataArray;
            // },
            selectNodeName(obj,colKey,RowValue){
                //根据点击修改选中项
                this.saveTreeData.forEach((item,index)=>{
                   item.selected=obj.id==item.id?true:false; 
                })
                this.$emit('clickRow',obj,colKey,RowValue);
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
                //清楚删除项勾选值
                if(this.treeData.length>0){
                    let treeArrIds=[];
                    this.treeData.forEach((item,index)=>{
                        treeArrIds.push(item.id);
                    })
                    this.checkList.forEach((item,index)=>{
                        if(!treeArrIds.includes(item)){
                        this.checkList.splice(index,1) 
                        }
                    })
                }
            })
        },
        beforeDestroy(){
            this.checkList=[];//清空复选项
        }
    }
</script>



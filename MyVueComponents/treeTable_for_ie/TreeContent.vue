
<style lang="less" scoped>
.tree-content {
  .tree-click-node{
      cursor: pointer;
  }
  .tree-node-img{
      width:22px;
      height:22px;
      margin-right:6px;
  }
  .tree-name-select{
      font-weight: 700;
  }
}
</style>

<template>
    <div class="tree-content" v-show="ctrlNodeShow">
        <div class="define-body-row">
            <div class="define-cell" v-for="col in contentCol" :style="{width:col.width,textAlign:col.align,flexGrow:col.grow}">
                <span v-if="col.type=='selection'">
                    <el-checkbox :label="contentObj.id">{{contentObj.checkText}}</el-checkbox>
                </span>
                <span v-else-if="col.type=='node'" :style="{paddingLeft:nodePadding,color:'#3b3b3b'}">
                    <span class="tree-click-node" v-if="contentObj.children.length>0" @click="hideNodeShow(nodeStatusType)">
                        <img :src="nodeImg" alt="node" class="tree-node-img">
                    </span>
                    <span :class="{'tree-name-select':contentObj.selected,'tree-click-node':true}" @click="switchNode(contentObj)">{{contentObj[col.key]}}</span>
                </span>
                <span v-else>{{contentObj[col.key]}}</span>
            </div>
        </div>
        <tree-content v-for="item in contentObj.children" :key="item.id+'c'" :content-obj="item"
            :content-col="contentCol" :dom-index="saveDomInxPop" :show-node="saveShowNode"
            @nodeClick="selectNodeName"></tree-content>      
    </div>  
</template>

<script>
import closeImg from './tree_close.png';
import openImg from './tree_open.png';
export default {
  name: "TreeContent",
  props: {
    contentCol: {//列项
      type: Array,
      default() {
        return [];
      }
    },
    contentObj: {   //行项
      type: Object,
      default() {
        return {};
      }
    },
    domIndex:{  //记录当前递归次数
        type:Number,
        default:1
    },
    showNode:{  //展开节点层级
        type:Number,
        default:0    //0展开所有
    }
  },
  data() {
    return {
        isShowNode:true,//是否显示节点
        saveDomInxPop:this.domIndex+1,
        saveDomIndex:this.domIndex,
        saveShowNode:this.showNode,
    };
  },
  computed: {
      nodeImg(){//计算打开or关闭图片
        if(this.saveShowNode==0){
              return openImg;
          }else{
              return this.saveShowNode>this.saveDomIndex?openImg:closeImg;//显示数量大于tree层级节点即为显示子节点状态
          }
      },
      nodePadding(){//计算层级节点缩进
        if(this.domIndex==1){
            return '0';
        }else{
            let num = this.domIndex*12;
            return num+'px';
        }
        
      },
      ctrlNodeShow(){//节点显示or隐藏
          if(this.showNode==0){
              return true;
          }else{
              return this.saveDomIndex>this.saveShowNode?false:true;
          }
          
      },
      nodeStatusType:{//当前节点打开or关闭
          get(){
              if(this.saveShowNode==0){//显示全部状态，为0不能参与运算比较bug
                  return true;
              }else{
                  return this.saveShowNode>this.saveDomIndex?true:false;//显示数量大于tree层级节点即为显示子节点状态
              }
              
          },
          set(newVal){
              if(newVal){//关闭--打开
                  this.saveShowNode=this.saveDomIndex+1;
              }else{//打开--关闭
                  this.saveShowNode=this.saveDomIndex;
              }
          }
      }
  },
  components: {},
  watch: {
      domIndex(newVal,oldVal){//监听重新保存
          this.saveDomIndex=newVal;
      },
      showNode(newVal,oldVal){//监听重新保存
          this.saveShowNode=newVal;
      }
  },
  methods: {
      //节点展开收起
      hideNodeShow(status){
          console.log(status);
          this.nodeStatusType=!status;
          
      },
      switchNode(obj){//单击节点名称，反馈父级
          this.$emit('nodeClick',obj)
      },
      selectNodeName(obj){//反馈父级
          this.$emit('nodeClick',obj)
      }
  },
  created() {},
  mounted() {},
  updated() {}
};
</script>




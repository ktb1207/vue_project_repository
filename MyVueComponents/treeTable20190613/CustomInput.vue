<style lang="less">
    .custom-input{

    }
    .check_box, .check_box_ban{
        display:inline-block;
        position:relative;
        height:18px;
        line-height: 18px;
    }
    // 选中
    .check_box label {
        width:16px;
        height:16px;
        position:absolute;
        top:0;
        left:0;
        border:1px solid #bfcbd9;
        border-radius:4px;
        background:#fff;
        cursor:pointer;
    }
    .check_box label:hover {
        border:1px solid #0190fe;
    }
    .check_box label:after {
        content:'';
        width:8px;
        height:4px;
        position:absolute;
        top:3px;
        left:2px;
        border:2px solid #bfcbd9;
        border-top:none;
        border-right:none;
        opacity:0;
        transform:rotate(-45deg);
    }
    .check_box label:hover:after {
        border:1px solid #0190fe;
        border-top:none;
        border-right:none;
    }
    .check_box input:checked + label {
        border:1px solid #0190fe;
    }
    .check_box input:checked + label:after {
        opacity:1;
        border:2px solid #0190fe;
        border-top:none;
        border-right:none;
    }
    // 半选
    .check_box_ban label {
        width:16px;
        height:16px;
        position:absolute;
        top:0;
        left:0;
        border:1px solid #0190fe;
        border-radius:4px;
        background:#fff;
        cursor:pointer;
    }
    .check_box_ban label:after {
        content:'';
        width:8px;
        height:4px;
        position:absolute;
        top:2px;
        left:3px;
        border:3px solid #0190fe;
        border-left:none;
        border-top:none;
        border-right:none;
        opacity:1;
    }
    .check_box_ban input:checked+label:after{
        content:'';
        width:8px;
        height:4px;
        position:absolute;
        top:3px;
        left:2px;
        border:2px solid #0190fe;
        border-top:none;
        border-right:none;
        opacity:1;
        transform:rotate(-45deg);
    }
    .check_box .inter-text, .check_box_ban .inter-text{
        margin:0 0 0 8px;
        vertical-align: text-top;
    }
    // 禁止选择
    .check_box_ban input:disabled+label,.check_box input:disabled+label{
        background-color: #edf2fc;
        cursor: not-allowed;
        border:1px solid #dcdfe6;
    }
    .check_box_ban input:disabled+label:after,.check_box input:disabled+label:after{
        content:'';
        width:0px;
        height:0px;
        position:absolute;
        top:0px;
        left:0px;
        border:none;
        opacity:0;
    }
</style>
<template>
    <span class="custom-input" :class="isBan ? 'check_box_ban':'check_box'">
        <input type="checkbox" :id="unique" :value="propValue" :disabled="isDisabled" v-model="checkValue">
        <label :for="unique"></label>
        <span class="inter-text">
            <slot></slot>
        </span>
    </span>
</template>
<script>
export default {
  name:"customInput",
  props:{
    unique:{
        type:String,
        default:'unique'
    },
    propValue:{
        type:Object,
        default(){
            return {}
        }
    },
    checkedStatus:{
        type:Boolean,
        default:false,
    },
    isBan:{
        type:Boolean,
        default:false,
    },
    isDisabled:{
        type:Boolean,
        default:false
    }
  },
  data(){
    return {
        inputValue:'',
        checkValue:this.checkedStatus
    };
  },
  computed:{
    
  },
  components:{},
  watch:{
    checkedStatus(newVal){
        this.checkValue=newVal;
    },
    checkValue(newVal){
        if(!this.propValue.noEmit){
            if(newVal){
                this.$emit('checkChange',true,this.propValue)
            }else{
                this.$emit('checkChange',false,this.propValue)
            }
        }
    }
  },
  methods:{},
  created(){},
  mounted(){
    this.$nextTick(()=>{
        this.checkValue=this.checkedStatus;
    })
  },
  updated(){},
  beforeDestroy(){}
}
</script>
<style lang="less">
  .dependent_wrap {
    width: 100%;
    height: 90%;
    p {
      width: 100%;
      height: 100%;
      line-height: 36px;
      text-indent: 10px;
      cursor: pointer;
    }
    input {
      width: 100%;
      height: 30px;
      margin: 2px 4%;
      border: none;
      text-indent: 10px;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      &:focus {
        outline: none;
      }
    }
  }
</style>
<template>
  <div class="dependent_wrap">
    <input v-if="isEditing" type="text" @keydown="downMethod($event)" @keyup="upMethod($event)" @blur="blurMethod" v-model="inputValue">
    <p class="dependent_info" v-else>{{value}}</p>
  </div>
</template>
<script>
export default {
  name:"inputChecking",
  props:{
    //是否处于编辑模式
    isEditing: {
      type: Boolean,
      default: false
    },
    itemValue:{
      type:String,
      default:''
    },
    itemKey:{
      type:String,
      default:''
    }
  },
  data(){
    return {
      inputValue:'',
      keyCodeArr:[
        48,//数字0
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,//9
        96,//0
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,//9
        190,//.
        110,//.
        70,//fF
        83,//sS
        107,//+
        187,//+
        189,//-
        109,//-
        16 // shift
      ],
      isError:false,// 输入是否非法
      saveSuccessValue:'',// 保存正确值
      numArr:['1','2','3','4','5','6','7','8','9','0'],
    };
  },
  computed:{},
  components:{},
  watch:{},
  methods:{
    downMethod(event){
      // backspace和enter
      if(event.keyCode==8||event.keyCode==13){
        this.isError = false;
        return
      }
      if(this.keyCodeArr.includes(event.keyCode)){
        if((event.keyCode==190||event.keyCode==110||event.keyCode==70||event.keyCode==83||event.keyCode==107||event.keyCode==187||event.keyCode==189||event.keyCode==109||event.keyCode==48||event.keyCode==96)&&this.inputValue==''){
          // 不能以0+-.fs开头
          console.log('0不能以+-.fs开头')
          this.isError = true;
        }else{
          this.isError = false;
        }
      }else{
        // 不能输入限定外键值
        this.isError = true;
        console.log('不能输入限定外键值')
      }
      this.saveSuccessValue = this.inputValue;
    },
    upMethod(event){
      // 输入非法
      if(this.isError){
        this.inputValue = this.saveSuccessValue;
        return
      }
      //两个点不能连续且前面必须是数字
      let endStr = this.inputValue.charAt(this.inputValue.length-1)
      let endSecondStr = this.inputValue.charAt(this.inputValue.length-2)
      let endThirdStr = this.inputValue.charAt(this.inputValue.length-3)
      if(event.keyCode==190||event.keyCode==110){
        if(endSecondStr=='.'||!(this.numArr.includes(endSecondStr))){
          this.inputValue = this.saveSuccessValue;
          console.log('两个点不能连续且前面必须是数字')
        }
      }
      // f前面必须是数字且只能出现一次f
      if(event.keyCode==70){
        if(!this.numArr.includes(endSecondStr)){
          this.inputValue = this.saveSuccessValue;
          console.log('f前面必须是数字')
        }
        if(this.saveSuccessValue.includes('f')||this.saveSuccessValue.includes('F')){
          this.inputValue = this.saveSuccessValue;
          console.log('f只能出现一次')
        }
      }
      //s
      if(event.keyCode==83){
        //console.log(endStr)
        //console.log(endSecondStr)
        // 前面只能是数字或者f或者s
        if(this.numArr.includes(endSecondStr)||endSecondStr=='s'||endSecondStr=='S'||endSecondStr=='f'||endSecondStr=='F'){
          //s 前面为数字--之前不能有s
          if(this.numArr.includes(endSecondStr)&&(this.saveSuccessValue.includes('s')||this.saveSuccessValue.includes('S'))){
            this.inputValue = this.saveSuccessValue;
            console.log('s 前面为数字--之前不能有s')
          }
          // fs ss
          // s之前为s之前不能再有s或者f
          if((endSecondStr=='s'||endSecondStr=='S')&&(endThirdStr=='s'||endThirdStr=='S'||endThirdStr=='f'||endThirdStr=='F')){
            this.inputValue = this.saveSuccessValue;
            console.log('s之前为s之前不能再有s或者f')
          }
        }else{
          this.inputValue = this.saveSuccessValue;
          console.log('前面只能是数字或者f或者s')
        }
      }
      // + -
      if(event.keyCode==107||event.keyCode==187||event.keyCode==189||event.keyCode==109){
        if(endSecondStr=='s'||endSecondStr=='S'){
          // 正常
        }else{
          this.inputValue = this.saveSuccessValue;
          console.log('+,-之前只能为s和S')
        }
      }
    },
    blurMethod(){
      if(this.inputValue.includes('+')){
        let valArr = this.inputValue.split('+');
        let addVal = valArr[1];
        if(addVal==''||Number(addVal)%0.5!==0){
          this.inputValue = ''
          this.saveSuccessValue = ''
          return
        }
      }
      if(this.inputValue.includes('-')){
        let valArr = this.inputValue.split('-');
        let addVal = valArr[1];
        if(addVal==''||Number(addVal)%0.5!==0){
          this.inputValue = ''
          this.saveSuccessValue = ''
          return
        }
      }
    }
  },
  created(){},
  mounted(){
    
  },
  updated(){},
  beforeDestroy(){}
}
</script>
<template>
  <div>
    <KRow align="left" verticalAlign="stretch"
      ><KCol width="16" flexDirection="row" mainAlign="start" crossAlign="stretch"
        ><KP fontAlign="right" fontColor="#d54848" :fontSize="20" fontWeight="normal" children="保存"
          >这是默认文本内容，点击可编辑</KP
        ></KCol
      ></KRow
    ><KRow align="left" verticalAlign="stretch"
      ><KCol width="160px" flexDirection="row" mainAlign="center" crossAlign="flex-end"
        ><KImage imageName="image1.jpg" imageWidth="200px" imageHeight="100px"></KImage></KCol
      ><KCol width="160px" flexDirection="row" mainAlign="start" crossAlign="stretch"
        ><KImage imageName="image2.jpeg" imageWidth="400px" imageHeight="360px"></KImage></KCol
      ><KCol width="160px" flexDirection="row" mainAlign="start" crossAlign="stretch"
        ><KImage imageName="image1.jpg" imageWidth="auto" imageHeight="auto"></KImage></KCol
    ></KRow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'StudyInfo'
});
</script>

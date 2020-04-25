<style lang="less">
.upload-wrp {
  padding: 14px 24px;
  i {
    color: red;
  }
}
</style>

<template>
  <div class="upload-wrp">
    <back-home></back-home>
    <file-upload :multiple="true"></file-upload>
  </div>
</template>

<script>
import BackHome from '../components/BackHome';
import FileUpload from '../components/FileUpload';
export default {
  name: 'uploadFile',
  props: {},
  data() {
    return {};
  },
  computed: {},
  components: {
    BackHome,
    FileUpload
  },
  watch: {},
  methods: {},
  mounted() {}
};
</script>
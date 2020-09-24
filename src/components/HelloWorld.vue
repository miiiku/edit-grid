<template>
  <div class="hello">
    <h1>Edit Grid</h1>
    <h6>一个在线编辑Grid网格配置文件工具</h6>
    <p>1: 使用时先确认输入列数，后期不可变</p>
    <p>2: 双击某一块区域进入区域编辑模式</p>
    <p>3: 被使用的区域不能在被编辑</p>
    <p>4: 编辑完成以后点击 `Send Config` 按钮来提交修改</p>
    <p>5: 进入 `/show` 页面查看最新布局样式</p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  text-align: center;
}

p {
  font-size: 14px;
  color: #666666;
}
</style>

<template>
  <div class="edit-page">
    <HelloWorld/>
    <button class="config-btn" @click="sendConfig">Send Config</button>
    <div class="container">
      <GridContainer
        ref="grid"
        class="grid-container-box"
        :usedAreas="usedAreas"
        :isEdit="isEdit"
        @updateEdit="handleUpdateEditStatus"
        @update="handleUpdateAreas"
      />

      <EditContainer
        ref="edit"
        class="edit-container-box"
        :areas="areas"
        :usedAreas="usedAreas"
        :isEdit="isEdit"
        @update="handelUpdateUsedAreas"
      />
    </div>
  </div>
</template>

<script>
import HelloWorld from "../components/HelloWorld";
import GridContainer from "../components/GridContainer";
import EditContainer from "../components/EditContainer";

export default {
  name: 'EditPage',
  components: {
    HelloWorld,
    GridContainer,
    EditContainer
  },
  data() {
    return {
      areas: [],
      usedAreas: [],
      isEdit: false,
    };
  },
  methods: {
    handleUpdateEditStatus(state) {
      console.log(state)
      this.isEdit = state
    },
    handleUpdateAreas(data) {
      this.areas = data;
    },
    handelUpdateUsedAreas(data) {
      this.usedAreas = data;
    },
    sendConfig() {
      if (!this.$refs.grid.isInit) return alert("请选输入列数进行初始化!");
      let gridConfig = this.$refs.grid.initGridConfig();
      let listConfig = this.$refs.edit.initListConfig();
      this.sendData({ ...gridConfig, ...listConfig });
    },
    sendData(config) {
      let ajax = new XMLHttpRequest()
      ajax.onerror = function(error) {
        console.log(error)
        alert('更新布局失败!')
      }
      ajax.onloadend = function() {
        console.log(ajax.response)
        alert('更新布局成功!')
      }
      ajax.open('POST', 'http://118.31.103.61:9000/update')
      ajax.send(JSON.stringify(config))
    }
  }
}
</script>

<style scoped>
.edit-page {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.config-btn {
  width: 120px;
  margin: auto;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
}

.container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.container > div {
  padding: 20px 40px;
}
</style>
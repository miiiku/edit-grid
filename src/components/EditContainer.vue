<template>
  <div class="edit-container">
    <div class="input-row">
      <input v-model="title" class="input-item" type="text" placeholder="专辑名">
      <input v-model="ratio" class="input-item" type="text" :placeholder="`宽高比(${defaultRatio})`">
    </div>
    <div class="input-row">
      <input v-model="area" class="input-item" type="text" placeholder="请输入区域" @keyup.enter="handleSub">
    </div>
    <ul class="images-list">
      <li
        class="images-item"
        v-for="img in images"
        :key="img.key"
        :class="{ active: selected && selected.key == img.key }"
        @click="handleClick(img)"
      >
        <img :src="img.url + '@compress180'">
        <p>{{ img.name }}</p>
        <strong>{{ img.area }}</strong>
      </li>
    </ul>
    <div class="preview-box" v-if="selected">
      <img :src="selected.url + '@compress240'" :alt="selected.name">
    </div>
  </div>
</template>


<script>
export default {
  name: "EditContainer",
  props: {
    areas: {
      type: Array,
      required: true,
      default: () => []
    },
    usedAreas: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      images: [],
      selected: null,
      title: "",
      defaultRatio: 1.7777,
      ratio: "",
      area: ""
    };
  },
  mounted() {
    // 模拟网络请求返回数据
    this.loadList()
  },
  methods: {
    loadList() {
      let ajax = new XMLHttpRequest()
      ajax.onerror = error => {
        console.log(error)
      }
      ajax.onloadend = () => {
        let data = JSON.parse(ajax.response);
        if (data.code == 200 && data.data) {
          this.images = data.data
        }
      }
      ajax.open('GET', 'http://118.31.103.61:9000/list', true)
      ajax.send()
    },
    handleClick(img) {
      if (this.selected && this.selected.key === img.key) return;
      this.selected = img;
      this.area = img.area || "";
    },
    handleSub() {
      if (!this.selected) return;
      if (!this.areas.includes(this.area)) return alert("无效区域");
      if (this.usedAreas.includes(this.area)) return alert("该区域已被使用");
      this.selected.area = this.area;
      this.area = "";
      this.selected = null;
      this.updateUsedAreas();
    },
    updateUsedAreas() {
      let existAreas = this.images.filter(item => item.area)
      let usedAreas = new Set(existAreas.map(item => item.area))
      this.$emit('update', [...usedAreas]);
    },
    initListConfig() {
      return {
        title: this.title,
        images: this.images,
        ratio: this.ratio || this.defaultRatio
      }
    }
  }
};
</script>


<style scoped>
.edit-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* area input start */
.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-item {
  flex: 1;
  height: 32px;
  line-height: 28px;
  padding: 2px 6px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}

.input-item:not(:last-child) {
  margin-right: 20px;
}
/* area input end */

/* images list start */
.images-list {
  flex: 1;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 300px;
  overflow: auto;
}

.images-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  user-select: none;
}

.images-item.active {
  background-color: yellow;
}

.images-item img {
  display: block;
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.images-item p {
  width: 60%;
  text-align: left;
  padding-left: 5px;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
}

.images-item strong {
  flex: 1;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/* images list end */

/* preview box start */
.preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 72px;
  width: 160px;
  height: 160px;
  border: 2px solid #e1e1e1;
}

.preview-box img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
/* preview box end */
</style>

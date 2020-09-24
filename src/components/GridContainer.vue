<template>
  <div class="grid-container">
    <form class="grid-form" v-if="!this.gridCol">
      <input type="number" name="col" id="col" class="form-input" placeholder="输入列数进行初始化">
      <button type="submit" class="form-btn">确定</button>
    </form>
    <div class="grid-btns" v-if="this.gridCol">
      <button @click="handleAddRow">add row</button>
      <button :disabled="!isEdit" @click="handleSave">save</button>
      <button :disabled="!isEdit" @click="handleCancel">cancel</button>
      <button :disabled="!isEdit" @click="handleRename">rename</button>
    </div>
    <div class="grid-body" v-bind:style="gridStyle" v-if="this.gridCol">
      <div
        class="grid-area"
        v-for="(area, index) in areas"
        :key="area.key"
        :class="[
          editArea && editArea.area == area.area ? 'active' : '',
          isUsedArea(area.area) ? 'used' : ''
        ]"
        :style="{ backgroundColor: area.color }"
        @dblclick="handleEdit(area)"
        @click="handleSelect(index)"
      >{{ area.area }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GridContainer",
  props: {
    usedAreas: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      isInit: false,
      isEdit: false,
      editArea: null,
      copyArea: null,
      lastEditArea: null,
      gridRow: 0,
      gridCol: 0,
      areas: [],
      colorIndex: 0,
      colors: ['#ff9a76', '#679b9b', '#726a95', '#21243d', '#f56a79', '#065446', '#d789d7', '#28df99', '#05dfd7', '#a8df65']
    };
  },
  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.gridCol}, 1fr)`,
        gridTemplateRows: `repeat(${this.gridRow}, 40px)`,
        backgroundColor: this.isEdit ? "rgba(0, 0, 0, 0.8)" : "#ffffff"
      };
    },
    isUsedArea() {
      let areas = this.usedAreas;
      return function(area) {
        return areas.includes(area);
      };
    }
  },
  mounted() {
    let form = document.querySelector(".grid-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      let col = Number(form.col.value);
      if (!col) return false;
      if (col < 1) return false;
      if (col > 8) return alert('建议列数在3-6之前，不能大于8')
      this.isInit = true;
      this.gridCol = col;
      this.gridRow = col;
      this.initAreaList();
    });
  },
  methods: {
    initAreaList() {
      let len = this.gridRow * this.gridCol;
      let areas = [];
      for (let i = 1; i <= len; i++) {
        areas.push({
          area: `area${i}`,
          color: this.getColor(),
          key: i
        });
      }
      this.areas = areas;
      this.updateAreas();
    },
    updateAreas() {
      let areas = new Set(this.areas.map(item => item.area));
      this.$emit("update", [...areas]);
    },
    getColor() {
      let color = this.colors[this.colorIndex]
      this.colorIndex ++
      if (this.colorIndex >= this.colors.length) {
        this.colorIndex = 0
      }
      return color
    },
    handleEdit(area) {
      if (this.isEdit) return;
      if (this.usedAreas.includes(area.area)) return alert("已被使用的区域不能在被编辑");
      this.isEdit = true;
      this.editArea = area;
      this.copyArea = JSON.parse(JSON.stringify(this.areas));
    },
    handleSelect(index) {
      if (!this.isEdit) return;
      let selfArea = this.areas[index];
      if (this.usedAreas.includes(selfArea.area)) return;
      let adjoin = this.isAdjoin(index, this.editArea.area);
      if (!adjoin) return;
      // 取消最后一次操作
      if (
        this.lastEditArea &&
        selfArea.area === this.editArea.area &&
        selfArea.key === this.lastEditArea.key
      ) {
        this.areas.splice(index, 1, this.lastEditArea);
        this.lastEditArea = null;
      } else {
        let newArea = Object.assign({}, this.editArea, { key: selfArea.key });
        this.lastEditArea = selfArea;
        this.areas.splice(index, 1, newArea);
      }
    },
    handleAddRow() {
      let lastKey = this.areas[this.areas.length - 1]["key"];
      for (let i = lastKey + 1; i <= lastKey + this.gridCol; i++) {
        this.areas.push({
          area: `area${i}`,
          color: this.getColor(),
          key: i
        });
      }
      this.gridRow = this.gridRow += 1;
      this.updateAreas();
    },
    handleSave() {
      let matrix = this.isMatrix(this.editArea.area);
      if (!matrix) {
        this.handleCancel();
      } else {
        this.isEdit = false;
        this.editArea = null;
        this.copyArea = null;
        this.updateAreas();
      }
    },
    handleCancel() {
      this.areas = this.copyArea;
      this.isEdit = false;
      this.editArea = null;
      this.copyArea = null;
    },
    handleRename() {
      let newName = window.prompt("请输入新的区域名称:");
      if (!newName) return;
      let areaName = this.editArea.area;
      this.areas.forEach(area => {
        if (area.area === areaName) {
          area.area = newName;
        }
      });
      this.editArea.area = newName;
      this.updateAreas();
    },
    isAdjoin(index, area) {
      let matrixArr = this.initMatrixArr();
      let row = Math.floor(index / this.gridCol);
      let i = index % this.gridCol;
      // 上
      if (row > 0 && matrixArr[row - 1][i] === area) {
        return true;
      }
      // 右
      if (i < this.gridCol - 1 && matrixArr[row][i + 1] === area) {
        return true;
      }
      // 下
      if (row < matrixArr.length - 1 && matrixArr[row + 1][i] === area) {
        return true;
      }
      // 左
      if (i > 0 && matrixArr[row][i - 1] === area) {
        return true;
      }
      return false;
    },
    isMatrix(area) {
      let matrix = true;
      let matrixArr = this.initMatrixArr();
      let row = new Set();
      let col = new Set();
      for (let i = 0; i < matrixArr.length; i++) {
        for (let j = 0; j < matrixArr[i].length; j++) {
          if (matrixArr[i][j] === area) {
            row.add(i);
            col.add(j);
          }
        }
      }
      row.forEach(i => {
        col.forEach(j => {
          if (matrixArr[i][j] !== area) {
            matrix = false;
          }
        });
      });
      return matrix;
    },
    initMatrixArr() {
      let arr = this.copyData(this.areas).map(item => item.area);
      let newArr = [];
      while (arr.length > 0) {
        newArr.push(arr.splice(0, this.gridCol));
      }
      return newArr;
    },
    copyData(data) {
      return JSON.parse(JSON.stringify(data));
    },
    initGridConfig() {
      return {
        areas: this.initMatrixArr(),
        gridCol: this.gridCol,
        gridRow: this.gridRow
      }
    }
  }
};
</script>

<style scoped>
.grid-container {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* btns start */
.grid-btns {
  width: 100%;
  padding: 10px 0;
  text-align: right;
}

.grid-btns button {
  margin: 0 10px;
}

.grid-btns button:last-child {
  margin: 0;
}
/* btns end */

/* form start */
.grid-form .form-input {
  width: 260px;
  height: 32px;
  padding: 2px 6px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}

.grid-form .form-btn {
  height: 32px;
  font-size: 12px;
  line-height: 28px;
  padding: 2px 16px;
  border: none;
  border-radius: 4px;
  margin-left: 20px;
}
/* form end */


/* grid body start */
.grid-body {
  flex: 1;
  width: 100%;
  border: 1px solid #e1e1e1;
  padding: 5px;
  display: grid;
  grid-gap: 5px;
  place-content: stretch;
  transition: all 0.3s ease;
  overflow: auto;
}

.grid-area {
  width: 100%;
  height: 100%;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  font-weight: bolder;
  user-select: none;
  color: #ffffff;
  border-radius: 2px;
  border: 2px solid transparent;
}

.grid-area.active {
  border-color: #ff0000;
}

.grid-area.used {
  border-color: #ffff00;
  border-style: dashed;
}
/* grid body end */
</style>

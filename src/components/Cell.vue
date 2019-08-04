<template>
  <button v-if="isClicked" disabled @click="clicked" class="cell clicked">
    <span v-if="bomb">
      <img src="https://i.ya-webdesign.com/images/explosion-clipart-animated-gif.gif" width="20px" />
    </span>
    <span v-else>
      <span v-if="empty">&nbsp;&nbsp;</span>
      <span v-else>{{adjacentbombs}}</span>
    </span>
  </button>
  <button
    v-else
    class="cell"
    :class="{'green':canbeBomb}"
    @click="clicked"
    @contextmenu.prevent="rightClicked"
  >&nbsp;&nbsp;</button>
</template>
<script>
export default {
  props: ["x", "y", "bomb", "empty"],
  data() {
    return {
      isClicked: false,
      adjacentbombs: 0,
      canbeBomb: false,
    };
  },
  watch: {
    empty(newvalue, oldvalue) {
      if (newvalue){
         if(this.isClicked && this.adjacentbombs > 0){
           this.empty = false;
         }else{
            this.isClicked = true
         }
         
      }
    }
  },
  methods: {
    rightClicked() {
      if (
        !this.canbeBomb &&
        this.$parent.possiblebombs.length == this.$parent.bombs.length
      ) {
        return alert("Possible marking of bombs is done");
      }
      this.canbeBomb = !this.canbeBomb;
      this.$emit("rightClicked", "" + this.x + this.y);
    },
    clicked() {
      this.isClicked = true;
      console.log("Clicked", this.x, this.y);
      if (this.bomb) {
        this.$emit("bombselected");
      } else {
        this.highlight();
      }
    },
    highlight() {
      const x = this.x;
      const y = this.y;
      const gridNumer = this.$parent.gridNumber;
      console.log("Highlighted", x, y);
      let adjacentcells = [];
      const prevCol = y - 1;
      const nextCol = y + 1;
      const prevRow = x - 1;
      const nextRow = x + 1;

      //prevCell
      if (prevCol !== 0) {
        adjacentcells.push("" + x + prevCol);
        if (prevRow !== 0) {
          adjacentcells.push("" + prevRow + prevCol);
        }
        if (nextRow <= gridNumer) {
          adjacentcells.push("" + nextRow + prevCol);
        }
      }
      //nextCell
      if (nextCol <= gridNumer) {
        adjacentcells.push("" + x + nextCol);
        if (prevRow !== 0) {
          adjacentcells.push("" + prevRow + nextCol);
        }
        if (nextRow <= gridNumer) {
          adjacentcells.push("" + nextRow + nextCol);
        }
      }
      if (prevRow !== 0) {
        adjacentcells.push("" + prevRow + y);
      }
      if (nextRow <= gridNumer) {
        adjacentcells.push("" + nextRow + y);
      }
      const found = adjacentcells.filter(r => this.$parent.bombs.includes(r));
      if (found.length) {
        this.adjacentbombs = found.length;
      } else {
        this.$emit("makeCellsEmpty", [...adjacentcells, "" + x + y]);
      }
    }
  }
};
</script>
<style>
.cell {
  border: 1px solid black;
  background: #999999;
  width: 16px;
  height: 16px;
  margin: 1px;
  text-align: center;
  min-width: 30px;
  min-height: 30px;
  color: white;
  font-size: medium;
}
.clicked {
  background: white;
  color: black;
}
.green {
  background: green;
  border:none
}
</style>
<template>
  <div class="grid-container">
    <div class="grid-item"></div>
    <div class="grid-item">
      <span v-if="mode=='simple'">{{timer | formatTime}}</span>
      <span v-else>{{(totalTime-timer) | formatTime}} left</span>
    </div>
    <div class="grid-item">
      <div style="margin-bottom:30px">
        Game Mode
        <select v-model="mode">
          <option value="simple">Simple</option>
          <option value="timer">Timer</option>
        </select>
        <span v-if="mode =='timer'"></span>
      </div>
      <div v-if="renderComponent">
        <input type="number" v-model="grid" id="gridinput" @keyup.enter="startGame" />
        <input type="button" value="start" @click="startGame" />
        <br />
        <br />
        <div v-for="x in gridNumber" :key="'row'+x">
          <cell
            v-for="y in gridNumber"
            :key="''+x+y"
            :x="x"
            :y="y"
            :bomb="isBomb(x,y)"
            :empty="isCellEmpty(x,y)"
            @bombselected="handleBombClicked"
            @makeCellsEmpty="makeCellsEmpty"
            @rightClicked="handleRightClick"
          >&nbsp;&nbsp;</cell>
        </div>
      </div>
    </div>
    <div class="grid-item" ><span id='bombleft'>{{bombs.length-possiblebombs.length}}</span>/{{bombs.length}} left</div>
    <div class="grid-item"></div>
  </div>
</template>

<script>
let initialState = () => {
  return {
    mode: "simple",
    grid: 6,
    selectedbombs: 0,
    gridNumber: 0,
    timer: 0,
    renderComponent: true,
    emptycells: [],
    possiblebombs: []
  };
};
import Cell from "./components/Cell";
export default {
  name: "App",
  data() {
    return initialState();
  },
  methods: {
    makeCellsEmpty(cells) {
      this.emptycells.push(...cells);
    },
    isCellEmpty(x, y) {
      return this.emptycells.includes("" + x + y);
    },
    handleBombClicked() {
      console.log("this", this.timer);

      window.clearInterval(this.interval);
      alert("Game is Over,Start a new Game", this.timer);
      this.emptycells.push(...this.bombs)
      // this.startGame()
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
    startGame() {
      window.clearInterval(this.interval);
      Object.assign(this.$data, {
        ...initialState(),
        grid: this.grid,
        mode: this.mode
      });
      let tempgrid = this.grid;
      this.grid = 0;
      this.grid = tempgrid;
      this.gridNumber = parseInt(this.grid);
      this.forceRerender();
      this.interval = window.setInterval(this.countDown, 1000);
    },
    countDown() {
      this.timer++;
      if (this.mode == "timer" && this.timer == this.totalTime) {
        alert("Your time is up");
        window.clearInterval(this.interval);
        this.emptycells.push(...this.bombs)
        // this.startGame()
      }
    },
    handleRightClick(cell) {
      let indexOfCell = this.possiblebombs.indexOf(cell);
      console.log("cell", cell, indexOfCell);
      if (indexOfCell < 0) {
        this.possiblebombs.push(cell);
      } else {
        this.possiblebombs.splice(indexOfCell, 1);
      }
      let correctPossibleBombs = this.possiblebombs.filter(cell =>
        this.bombs.includes(cell)
      );
      if (correctPossibleBombs.length == this.bombs.length) {
        if (this.mode == "simple")
          alert(`You won the game,took ${this.timer}s to complete the game`);
        else
          alert(
            `You won the game,${this.totalTime - this.timer} seconds  left`
          );
      }
    },
    isBomb(x, y) {
      return this.bombs.includes("" + x + y);
    }
  },
  computed: {
    bombs() {
      let array = [];
      let grid = parseInt(this.grid, 10);
      for (let x = 1; x < grid; x++) {
        for (let y = 1; y < grid; y++) {
          array.push("" + x + y);
        }
      }
      const shuffled = array.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      let bombs = Math.round(grid * grid * 0.2);
      // console.log("bombs", bombs);
      let selected = shuffled.slice(0, bombs);

      return selected;
    },
    totalTime() {
      return this.gridNumber * this.gridNumber * 3;
    }
  },
  filters: {
    formatTime(s) {
      if (s > 60) {
        let m = Math.floor(s / 60);
        let sec = s % 60;
        return `${m} min ${sec} seconds`;
      }
      return s + " seconds";
    }
  },
  components: {
    Cell
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.grid-container {
  display: grid;
}
.grid-item {
  /* border:black solid; */
  grid-row-start: 1;
  grid-row-end: 3;
}
</style>

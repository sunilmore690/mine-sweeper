import { mount } from "@vue/test-utils";
import App from "@/App";
import Cell from "@/components/Cell";
import { wrap } from "module";

// describe("App", () => {
//   let vm;
//   beforeEach(() => {
//     const Constructor = Vue.extend(App);
//     vm = new Constructor().$mount();
//   });
//   it("displays 'Emitted!' when custom event is emitted", () => {
//     expect(vm.grid).toEqual(6);
//   });

// });

describe("Component", () => {
  it("is a Vue instance", () => {
    const wrapper = mount(App);
    const vm = wrapper.vm;
    expect(vm.bombs.length).toEqual(Math.round(vm.grid * vm.grid * 0.2));
  });
  it("Should have 20% (rounded to nearest integer) of the total cells as the count of bombs in the game.", () => {
    const wrapper = mount(App);
    const vm = wrapper.vm;
    expect(vm.bombs.length).toEqual(Math.round(vm.grid * vm.grid * 0.2));
  });
  it("Cell should contain grid*grid size ", () => {
    const wrapper = mount(App, {
      children: [Cell]
    });
    const vm = wrapper.vm;
    vm.gridNumber = vm.grid;
    expect(vm.$el.querySelectorAll(".cell").length).toEqual(vm.grid * vm.grid);
  });
  it("Should show correct Bomb Marking left count", () => {
    const wrapper = mount(App, {
      children: [Cell]
    });
    const vm = wrapper.vm;
    vm.gridNumber = vm.grid;
    wrapper.find(".cell").trigger("contextmenu");
    expect(vm.$el.querySelector("#bombleft").innerHTML).toEqual(
      vm.bombs.length - 1 + ""
    );
  });
  it("After marking Background color should go to green", () => {
    const wrapper = mount(App, {
      children: [Cell]
    });
    const vm = wrapper.vm;
    vm.gridNumber = vm.grid;
    wrapper.find(".cell").trigger("contextmenu");
    expect(vm.$el.querySelector(".cell").classList).toContain("green");
  });
  it("After Unmarking Background color should go to normal", () => {
    const wrapper = mount(App, {
      children: [Cell]
    });
    const vm = wrapper.vm;
    vm.gridNumber = vm.grid;
    wrapper.find(".cell").trigger("contextmenu");
    wrapper.find(".cell").trigger("contextmenu");
    expect(vm.$el.querySelector(".cell").classList).not.toContain("green");
  });
});

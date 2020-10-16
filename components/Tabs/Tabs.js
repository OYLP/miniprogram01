// components/Tabs/Tabs.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      tabs:{
        type:Array,
        value:[]
      }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
      handleItemTap(e){
       //获取点击的索引值
        const {index} = e.target.dataset
        //触发 父组件的事件 自定义 ，子组件向父组件 以 绑定事件的方法 传递数据
        // this.triggerEvent("tabsItemChange",{index:index})
        this.triggerEvent("tabsItemChange",{index})

      }
    }
})

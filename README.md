### sunSelection

* * *

##### v1.0.0 文档
###### 效果预览
![66bd784366ff7ee8650e90e8b17f69a3.gif](en-resource://database/553:1)
###### 应用效果预览
![f8bd8fb3e5502ab10cb135c4c291640b.gif](en-resource://database/555:1)

###### 简介

- 支持的数据结构： 树形结构
- 支持的层级： 无限制
- 可拆分： 组件被独立拆分成两个独立组件

###### 起步

引入依赖：
```
<script src="lib/vue.js"></script>
<script src="lib/sunSelection.js"></script>
```

需要提前准备数据源结构为树形结构，默认：
```
 [
 {
    id:xxx,
    text: xxx,
    children: []
 }
 ]
```
确保数据源准备好的情况下可以在初始化Vue实例之前调用；

initSelector(data, option); 来初始化插件结构

##### data数据字段的使用说明：

| 字段 |是否必填 |类型 | 默认值  | 功能  | 
| --- | --- | --- | --- | --|
|  lineData  | 否 | Array| [] | line部分数据源  | 
|  mainData  | 否 | Array| [] | drop部分数据源  |
以上数据 统一采用树形结构。

lineData 数据为演示中的： 
![ec7f75dd3a53d71a67ab48e2a8958efc.png](en-resource://database/557:1)

mainData 数据为演示中的：
![c5c7940ff053ad59387b603034eeca70.png](en-resource://database/559:1)


两部分都是非必填项，组件可被拆分使用。想要使用哪个功能，填写对应的数据即可。

```
var data = {
        lineData: [xxxx],
        mainData: [xxxx]
    };
var option = {
    alias: {xxxxx}
} 

initSelection(data, option);

var app = new Vue({});
    
```
或者在vue生命周期中使用vue实例方法进行初始化

```
var app = new Vue({
    data: {
        selectionData: {
        lineData: [xxxx],
        mainData: [xxxx]
        },
        option: {
         alias: {xxxxx}
        }
    },
    created: function () {
        this.initSelection(this.selectionData, this.option)
    }
});
    
```
##### option字段，功能配置：

| 字段 |是否必填 |类型 | 默认值  | 功能  | 
| --- | --- | --- | --- | --|
| layout | 否 | Object| {} |插件布局相关配置  | 
| selector | 否 | Object| {} | 插件选择相关配置  | 
| selectNum | 否 |Number |1  |可被选择的数量  | 
| lastOnly | 否 |Boolean |false  | 是否只能选最后一个子集  | 

##### option字段 layout配置：

| 字段 |是否必填 |类型 | 默认值  | 功能  | 
| --- | --- | --- | --- | --|
| width | 否 | 200| Number | line部分元素的宽度  | 
| itemHeight| 否 | 35| Number | line部分元素的高度  | 
| center| 否 | 35| Boolean | line部分元素是否采用居中对齐  | 

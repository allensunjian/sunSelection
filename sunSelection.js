/**
 *    Create by Allen.sun on 2020/05/21
 *    Module: sunSelection.js
 *    Collaborator:
 *    Description: sunSelection for vue plugin;
 */

(function ($v, $w) {
    var scope = null;
    var mainData = [];
    var lineData = [];
    var privateProps = {
        showLine: false
    };
    var alias = {
        children: "children",
        text: "text",
        id: "id"
    };
    var lifeCircy = {
        created: function () {
            scope = this;
            this._computedDefaultSelectedValue();
        },
        mounted: function () {
            var el = this.$refs.lineWrap;
            this.dropSize.width = el.offsetWidth;
            this.dropSize.itemNumber = this.zIndexLevel + 1;
            this.dropSize.itemWidth = (el.offsetWidth / (this.zIndexLevel + 1)).toFixed(0);
            _initGlobalEvents.call(this);
        }
    };
    var classMap = {
        MainWrap: "sunSelection",
        LineWrap: "sunSelection__line_wrap",
        LineItem: "sunSelection__line_item",
        LineList: "sunSelection__line_list",
        DropPanel: "sunSelection__drop_panel",
        DropPanel_title: "sunSelection__drop_title",
        DropPanel_list_wrap: "sunSelection__list_wrap",
        DropPanel_list: "sunSelection__drop_list",
        DropPanel_listItem: "sunSelection__drop_listItem",
        SelecorWrap: "sunSelection__selector_wrap",
        Selecor_controll: "sunSelection__selector_controll",
        Selecor_controllItem: "sunSelection__controll_item",
        Selecor_selected: "sunSelection__selector_selected",
        Selecor_selectedItem: "sunSelection__selected_item",
        Selecor_icon_cancel: "sunSelection__icon_cancel",
        Selecor_title: "sunSelection__title",
        clear: "button_danger",
        close: "button_empty"
    };
    var triggerEvents = {
        stateLib: {
            overflow: function (val) {
                return {
                    type: "overflow",
                    ruleValue: scope.getVerSelectedNumber(),
                    inputValue: val
                }
            }
        },
        message: function (query) {
            return triggerEvents.stateLib[query.type](query.value)
        }
    };
    var name = "sunSelection";
    var tamplate = "";
    var util = {
        elementLayout: {
            createPackingElement: function (slot, props) {
                return this.createElement("span", slot, props);
            },
            createWrap: function (slot, props) {
                return this.createElement("div", slot, props);
            },
            createList: function (slot, props) {
                return this.createElement("ul", slot, props);
            },
            createListItem: function (slot, props) {
                return this.createElement("li", slot, props);
            },
            createElement: function (elString, slot, props) {
                return util.elementLayout.startTag(elString, props) + slot + util.elementLayout.endTag(elString);
            },
            startTag: function (elString, props) {
                return "<" + elString + util.common.propsToString(props) + ">"
            },
            endTag: function (elString) {
                return "</" + elString + ">"
            },

        },
        common: {
            propsToString: function (obj) {
                var str = "";
                Object.keys(obj).forEach(function (key) {
                    str += pritaveProps.space + key + "=" + util.common.generateString(obj[key]);
                })
                return str
            },
            generateString: function (str, valite) {
                return '"' + str + '"'
            },
            _createFacProps: function (type, dataDefault) {
                type = type.name;
                if (type == "Array") {
                    return util.common._ArrayFac(dataDefault)
                }

                if (type == "String") {
                    return util.common._StringFac(dataDefault)
                }

                if (type == "Boolean") {
                    return util.common._BooleanFac(dataDefault)
                }

                if (type == "Number") {
                    return util.common._NumberFac(dataDefault)
                }
                if (type == "Object") {
                    return util.common._ObjectFac(dataDefault)
                }
            },
            _ArrayFac: function (dataDefault) {
                return {
                    type: Array,
                    default: util.common._FacShell(dataDefault, [])
                }
            },
            _StringFac: function (dataDefault) {
                return {
                    type: String,
                    default: dataDefault || ""
                }
            },
            _BooleanFac: function (dataDefault) {
                return {
                    type: Boolean,
                    default: dataDefault === false ? false : dataDefault
                }
            },
            _NumberFac: function (dataDefault) {
                return {
                    type: Number,
                    default: dataDefault || 0
                }
            },
            _ObjectFac: function (dataDefault) {
                return {
                    type: Object,
                    default: util.common._FacShell(dataDefault, {})
                }
            },
            _FacShell: function (dataDefault, baseData) {
                return function () {
                    return dataDefault || baseData
                }
            },
            _createLevel: function (level, index) {
                return level + "" + index.toString(16)
            },
            _computedStyleText: function (layoutObj, listDefault) {
                var cssText = "";
                Object.keys(listDefault).forEach(function (key) {
                    cssText += key + ":" + listDefault[key];
                });
                Object.keys(layoutObj).forEach(function (key) {
                    cssText += key + ":" + layoutObj[key];
                });
            },
        },
        setData: function (key, value) {
            _data[key] = value;
            data = util.common._FacShell(_data);
        },
        tools: {
            forEachForNum: function (num, fn) {
                for (var i = 0; i < num ; i++) {
                    if (fn(i)) break;
                }
            },
            emit: function (event, query) {
                this.$emit(event, query)
            },
            hasClass: function (el, className) {
                var classList = el.classList;
                return Array.prototype.indexOf.call(classList, className) >= 0;
            },
            getParent: function (el) {
                return el.parentNode
            },
            computedLinkMap: function (link, text, id, level) {
                var map = []
                for (var i = 0; i <= level; i++) {
                    map.push(link.slice(0, 2 + i))
                };
                if (!_data.patDwonDataMap.LinkListOfDataForFirst) {
                    _data.patDwonDataMap.LinkListOfDataForFirst = [];
                    _data.patDwonDataMap.LinkListOfDataForFirst.push(map);
                } else {
                    // 优化：当取数据最大层级深度时，说明已经全部取过了则不用再取了
                    if ((_data.patDwonDataMap.LinkListOfDataForFirst.length - 1) < _data.zIndexLevel) {
                        // 计算每条层级路径有且只有一条存在于LinkListOfDataForFirst中
                        var lenArr = _data.patDwonDataMap.LinkListOfDataForFirst.map(function (arr) { return arr.length });
                        lenArr.indexOf(map.length) < 0 && _data.patDwonDataMap.LinkListOfDataForFirst.push(map);
                    }
                }
                return map;
            },
            tirrger: (function (triggerEvents) {
                return function (key, queury) {
                    scope.$emit(key, triggerEvents[key](queury))
                }
            })(triggerEvents)
        },
        controlls: {
            clear: function () {
                this.selectedStateList = [];
                this.selectedIdList = [];
            },
            close: function () {
                this.hoverSelectorStateList = [];
                this.$emit("closepanle")
            }
        }
    };
    var _data = {
        lineData: lineData,
        mainData: mainData,
        hoverSelectorStateList: [], // 实时hover状态
        selectedStateList: [], // 选中记录状态
        selectedIdList: [], // 记录选中的ID
        defaultWidth: 160,
        defaultItemHeight: 35,
        zIndexLevel: 0, // 不算第一级，全部的子层级数量
        dropSize: {
            width: 0,
            itemWidth: 0,
            itemNumber: 0
        },
        patDwonDataMap: {}, // 降维拍平后的ID为键， 选项数据为值的键值对
        selectedDetailList: [], //选择详情
        alias: alias
    }
    var data = util.common._FacShell(_data);
    var props = {
        data: util.common._createFacProps(Object, {}),
        option: util.common._createFacProps(Object, {
            alias: alias,
            layout: {
                itemHeight: 25,
                center: true
            },
            selectNum: 3,
            lastOnly: true,
            cancel: true
        }),
        showdrop: util.common._createFacProps(Boolean, false),
        defaultvalue: util.common._createFacProps(Array, []),
        clearselectedvalue: util.common._createFacProps(Boolean, false),
        title: util.common._createFacProps(String, "选择"),
        controlls: util.common._createFacProps(Array, [
            { text: "清空", type: "clear" },
            { text: "关闭", type: "close" }
        ])
    };
    var defaultValue = {
        selectNum: 1,
        lastOnly: false,
        cancel: true
    };
    var pritaveProps = {
        space: " "
    };
    var component = {};
    var methods = {
        itemClick: function (e) {
            var dataset = e.target.dataset, _this = this, retArr = [];
            this.switchLastOnly(dataset.islast == "true", function () {
                var states = [];
                this.hoverSelectorStateList.forEach(function (item, index) {
                    states.push(item)
                });
                this.swicthSelectedNumEvent(function (isFull, verNum) {
                    var index = this.selectedIdList.indexOf(dataset.id);
                    // 取消选项 逻辑
                    if (index >= 0) {
                        this.option.cancel && this._cancelSelectedItem(index);
                        return
                    }
                    if (isFull) {
                        if (verNum == 1) {
                            this.clearSelectedValue();
                        } else {
                            util.tools.tirrger("message", {
                                type: "overflow",
                                value: verNum
                            })
                            return
                        }
                    }
                    this.selectedIdList.push(dataset.id);

                    if (this.selectedIdList.length >= verNum) {
                        dataset.module == "line" && (this.hoverSelectorStateList = []);
                    }
                    this.$set(this.selectedStateList, this.selectedStateList.length, states);
                });
            });
        },
        itemOver (e) {
            var dataset = e.target.dataset, level = dataset.level, index = dataset.index, name = dataset.name;
            if (level == 0) {
                this.hoverSelectorStateList = [];
                this.hoverSelectorStateList.push(name);
            } else {
                this.$set(this.hoverSelectorStateList, level, name);
            }
        },
        switchLastOnly (isLast, next) {
            if (this.option.lastOnly) {
                isLast ? next.call(this) : ""
            } else {
                next.call(this)
            }
        },
        swicthSelectedNumEvent (next) {
            var _this = this;
            setTimeout(function () {
                var verNum = _this.getVerSelectedNumber()
                var len = _this.selectedIdList.length;
                var isFull = verNum <= len;
                //isFull && (_this.hoverSelectorStateList = [])
                next.apply(_this, [isFull, verNum])
            }, 50)

        },
        getVerSelectedNumber () {
            return (this.option.selectNum ?
                this.option.selectNum :
                defaultValue.selectNum);
        },
        clearSelectedValue () {
            this.selectedIdList = [];
            this.selectedStateList = [];
        },
        cancelItem: function (id) {
            this.selectedIdList = this.selectedIdList.filter(function (i) { return i !== id });
        },
        controllSwicthCenter: function (type) {
            util.controlls[type] && util.controlls[type].call(this);
        },
        _cancelSelectedItem (index) {
            this.selectedIdList.splice(index, 1);
            this.selectedStateList.splice(index, 1)
        },
        _computedDefaultWidthAndPosition: function (level) {
            var w = (this.option.layout && this.option.layout.width) ? this.option.layout.width : this.defaultWidth;
            var h = this.option.layout && this.option.layout.itemHeight ? this.option.layout.itemHeight : this.defaultItemHeight;
            if (level == 0) {
                return "width:" + w + "px;left: 0;top:" + h + "px";
            }
            return "width:" + w + "px;right:-" + w + "px;text-aligin:center";
        },
        _computedItemDefaultSize: function () {
            var h = this.option.layout && this.option.layout.itemHeight ? this.option.layout.itemHeight : this.defaultItemHeight;
            return "height: " + h + "px; line-height:" + h + "px";
        },
        __computedSelectedItemList: function (e, zLevel) {
            var findIt = false;
            this.selectedStateList.forEach(function (arr) {
                if (findIt) return;
                if (arr.indexOf(zLevel) >= 0) {
                    findIt = true
                }
            })
            return findIt
        },
        // Destoried
        _computedDropDefaultSelect: function () {
            // 通过状态链 反推
            this.selectedStateList.forEach(function (arr, index) {
                // 强制排序
                arr.sort(function (arr1, arr2) {

                    return arr1[0] < arr2[0]
                })
                arrSplitCode(arr, index)
            })

            function arrSplitCode(arr, index) {
                console.log("第" + index + "条状态线")
                arr.forEach(function (code) {
                    console.log(code.split(""))
                })
            }
            this._initDropData()
        },
        _computedDropPanelItemSize: function (num) {
            if (num == 0) {
                return "width:" + this.dropSize.itemWidth + "px;"
            }
            return "width:" + this.dropSize.itemWidth + "px;left: " + this.dropSize.itemWidth + "px";

        },
        _computedDefaultSelectedValue: function () {
            var _this = this;
            this.selectedIdList = this.defaultvalue;
            this.defaultvalue.forEach(function (idKey) {
                var map = _this.patDwonDataMap[idKey], linkMap = [];
                if (!map) return;
                linkMap = _this.patDwonDataMap[idKey].linkMap;
                _this.selectedStateList.push(linkMap)
            })
        },
        _getBtnClass: function (type) {
            return classMap[type]
        },
        _computedDropDefaultValue () {
            var _this = this;
            // 如果没有选项； 默认hover第一个数据的第一条链；
            if (_this.selectedStateList.length > 0) {
                _this.hoverSelectorStateList = this.selectedStateList[0].map(function (item) { return item });
                return
            }
            // 没有选项； 默认展开第一条链
            _this.hoverSelectorStateList = _this.patDwonDataMap.LinkListOfDataForFirst[1];
        }
    }
    var createElementFramework = function () {
        var line = createTampLine();
        var drop = createTampDropPanel();
        tamplate = util.elementLayout.createWrap(line + drop, {
            class: classMap.MainWrap,
        })
    };
    function createTampLine() {
        var lis = "", list = "", wrap = "", plugin = "", zIndexLevel = 1;
        function createDeep(arr, level, parent) {
            var deepList = "", deepItem = "";
            arr.forEach(function (o, index) {
                var chilren = o[alias.children];
                var zlevel = util.common._createLevel(parent, index)
                if (chilren && chilren.length > 0) {
                    deepList = util.elementLayout.createList(createDeep(chilren, level + 1, zlevel), {
                        class: classMap.LineList,
                        "data-parent": zlevel,
                        "v-show": "!showdrop && hoverSelectorStateList.indexOf(" + "'" + zlevel + "'" + ") >= 0",
                        ":style": " _computedDefaultWidthAndPosition(" + level + ") "
                    });
                    zIndexLevel = (zIndexLevel < level + 1) ? level + 1 : zIndexLevel;
                } else {
                    deepList = "";
                }
                o.linkMap = util.tools.computedLinkMap(zlevel, o[alias.text], o[alias.id], level);
                _data.patDwonDataMap[o[alias.id]] = o;
                deepItem += util.elementLayout.createListItem(o[alias.text] + deepList, {
                    class: classMap.LineItem + " " + (level > 0 && Boolean(deepList) && "sunSelection__state_hasChildren"),
                    "@click.stop": "itemClick($event)",
                    "@mouseover.stop": "itemOver",
                    "data-id": o[alias.id],
                    "data-level": level,
                    "data-index": index,
                    "data-name": zlevel,
                    "data-isroot": level == 0 ? true : false,
                    "data-islast": deepList == "",
                    "data-module": "line",
                    ":style": "_computedItemDefaultSize()",
                    ":class": "{'sunSelection__state_hover':(hoverSelectorStateList.indexOf(" + "'" + zlevel + "'" + ") >= 0)," +
                        "'sunSelection__state_selected': !showdrop && __computedSelectedItemList(" + index + "," + "'" + zlevel + "'" + ")" +
                        ",'sunSelection__icon_selected': !showdrop && selectedIdList.indexOf(" + "'" + o[alias.id] + "'" + ") >= 0" +
                        "}",
                    "ref": o[alias.id]
                })
            });

            return deepItem
        }
        list = util.elementLayout.createList(createDeep(lineData, 0, 0), {
            class: classMap.LineList,
        });
        wrap = util.elementLayout.createWrap(list, {
            class: classMap.LineWrap,
            "ref": "lineWrap"
        });
        util.setData("zIndexLevel", zIndexLevel)
        return wrap;
    }
    function createTampDropPanel() {
        function createDeep(arr, level, parent) {
            var deepList = "",
                deepItem = "",
                packing = function (text, props) {
                    return util.elementLayout.createPackingElement(text, props)
                },
                packItem = "";
            arr.forEach(function (o, index) {
                var chilren = o[alias.children];
                var zlevel = util.common._createLevel(parent, index)
                if (chilren && chilren.length > 0) {
                    deepList = util.elementLayout.createList(createDeep(chilren, level + 1, zlevel), {
                        class: classMap.DropPanel_list,
                        "data-parent": zlevel,
                        "v-show": "hoverSelectorStateList.indexOf(" + "'" + zlevel + "'" + ") >= 0",
                        ":style": " _computedDropPanelItemSize(" + level + 1 + ") "
                    });
                } else {
                    deepList = "";
                }
                o.linkMap = util.tools.computedLinkMap(zlevel, o[alias.text], o[alias.id], level);
                _data.patDwonDataMap[o[alias.id]] = o;
                packItem = packing(o[alias.text], {
                    class: "drop__packing" + " " + (Boolean(deepList) && "sunSelection__state_hasChildren"),
                    "@click.stop": "itemClick($event)",
                    "@mouseover.stop": "itemOver",
                    "data-id": o[alias.id],
                    "data-level": level,
                    "data-index": index,
                    "data-name": zlevel,
                    "data-isroot": level == 0 ? true : false,
                    "data-islast": deepList == "",
                    "data-module": "drop",
                    ":class": "{'sunSelection__icon_selected': selectedIdList.indexOf(" + "'" + o[alias.id] + "'" + ") >= 0}"
                })
                deepItem += util.elementLayout.createListItem(packItem + deepList, {
                    class: classMap.DropPanel_listItem,
                    ":style": "_computedItemDefaultSize()",
                    ":class": "{'sunSelection__state_hover': (hoverSelectorStateList.indexOf(" + "'" + zlevel + "'" + ") >= 0)," +
                        "'sunSelection__state_selected': __computedSelectedItemList(" + index + "," + "'" + zlevel + "'" + ")" +
                        "}",
                    "ref": o[alias.id]
                })
            });
            return deepItem
        }
        var list = util.elementLayout.createList(createDeep(mainData, 0, 0), {
            class: classMap.DropPanel_list,
            ":style": "_computedDropPanelItemSize(0)"
        });
        var listWrap = util.elementLayout.createWrap(list, {
            class: classMap.DropPanel_list_wrap
        })
        var controllItem = util.elementLayout.createElement("span", "{{item.text}}", {
            class: classMap.Selecor_controllItem,
            "v-for": "(item, index) in controlls",
            "@click": "controllSwicthCenter(item.type)",
            ":class": "_getBtnClass(item.type)"
        });
        var controllWrap = util.elementLayout.createWrap(controllItem, {
            class: classMap.Selecor_controll
        });
        var title = util.elementLayout.createWrap("{{title}}" + controllWrap, {
            class: classMap.DropPanel_title
        })
        var selector = createTampSelecor();
        return util.elementLayout.createWrap(title + selector + listWrap, {
            class: classMap.DropPanel,
            "v-show": "showdrop",
            "ref": "dropPanel"
        })


    }
    function createTampSelecor() {
        var wrap = "",
            selectorWrap = "",
            selectorItem = "",
            cancel = "",
            selectortitle = "",
            selectorEmpty = "";

        cancel = util.elementLayout.createElement("i", "", {
            class: classMap.Selecor_icon_cancel,
        });
        selectorItem = util.elementLayout.createElement("span", "{{item[alias.text]}}" + cancel, {
            class: classMap.Selecor_selectedItem,
            "v-for": "(item,index) in selectedDetailList",
            "v-show": "selectedDetailList.length > 0",
            "@click.stop": "cancelItem(item[alias.id])"
        });
        selectortitle = util.elementLayout.createElement("span", "{{option.selector.title || '已选择'}}:", {
            class: classMap.Selecor_title
        });
        selectorEmpty = util.elementLayout.createElement("span", "还没有选择哦~", {
            class: classMap.Selecor_title,
            "v-show": "!selectedDetailList || selectedDetailList.length == 0",
            style: "color: #999"
        })
        selectorWrap = util.elementLayout.createWrap(selectortitle + selectorItem + selectorEmpty, {
            class: classMap.Selecor_selected,
        });
        return util.elementLayout.createWrap(selectorWrap, {
            class: classMap.SelecorWrap,
        });
    }
    function _createComponent() {
        component.template = tamplate;
        component.data = data;
        component.props = props;
        component.methods = methods;
        component.watch = {
            hoverSelectorStateList: {
                deep: true,
                handler: function (val) {
                    // console.log(val)
                }
            },
            selectedIdList: {
                deep: true,
                handler: function (arr) {
                    var retArr = [], _this = this, keyMap = [];
                    retArr = arr.map(function (id) {
                        keyMap.push(_this.patDwonDataMap[id].linkMap)
                        return {
                            id: id,
                            text: _this.patDwonDataMap[id][alias.text]
                        }
                    });
                    this.selectedStateList = keyMap;
                    this.selectedDetailList = retArr;
                    this.$emit("selectioncomplete", retArr);
                }
            },
            showdrop: function (val) {
                val && this._computedDropDefaultValue()
            },
        }
        Object.keys(lifeCircy).forEach(function (key) {
            component[key] = lifeCircy[key]
        });
        console.log(component);
        return component;
    }
    function iniComponent() {
        $v.component(name, _createComponent())
    }
    function _initData(data) {
        if (data.lineData) {
            privateProps.showLine = true;
        };
        mainData = data.mainData;
        lineData = privateProps.showLine ? data.lineData : [];
    }
    //  _initAlias
    function _initAlias(options) {
        var aliasTamp = options.alias;
        // to do something
        if (aliasTamp) alias = aliasTamp;
    }
    function _init() {
        createElementFramework();
        return {
            install: iniComponent
        }
    }
    //  _initGlobalEvents
    function _initGlobalEvents() {
        var _this = this;
        document.body.onclick = function (e) {
            util.controlls.close.call(_this);
        }
    }
    //  通过ID拿到当前选择的数据
    function getValueForId(ids) {
        var retArr = [];
        ids.forEach(function (id) {
            var obj = _data.patDwonDataMap[id];
            if (!obj) return;
            retArr.push({
                id: obj[alias.id],
                text: obj[alias.text]
            })
        })
        return retArr;
    };
    function clearSelectedValue() {
        scope.clearSelectedValue()
    }
    $w.initSelector = function (data, options) {
        _initData(data);
        _initAlias(options);
        $v.use(_init());
        return {
            getValueForId: getValueForId,
            clearSelected: clearSelectedValue
        }
    }
})(Vue, window);
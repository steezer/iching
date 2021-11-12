<template>
    <div v-if="selected!=null" class="main">
        <h2 class="name" @click="handleSelect">
            <span>{{selected.name}}卦</span> <span>第{{selected.index|toChinesNum}}</span>
        </h2>
        <div class="text" @click="handleGetDetail(-1)">{{selected.hexagram}}</div>
        <div class="hexagram">
            <div v-for="(v,k) of value" @click="handleChange(k)" :key="k" :class="{item: true, no: v=='0'}"></div>
        </div>
        <ul class="trigram">
            <li v-for="(item, index) of selected.trigrams" :key="index" @click="handleGetDetail(index)">{{item}}</li>
        </ul>
        <SelectDialog 
            v-if="isSelect" 
            :lists="lists" 
            @select="setData" 
            @close="isSelect=false" 
            :selected="selected.value"
        />
        <DetailDialog 
            v-if="isExplain" 
            :detail="explain.detail" 
            :index="explain.index"
            :selected="selected"
            @close="isExplain=false" 
        />
    </div>
</template>

<script>

export default {
    components: {
        DetailDialog: component("@/detail.vue"),
        SelectDialog: component("@/select.vue")
    },
    data: function(){
        return {
            lists: [],
            selected: null,
            value: [],
            explain: {
                lists: null,
                detail: null,
                original: null,
                index: -1
            },
            isExplain: false,
            isSelect: false
        }
    },
    created: function(){
        util.getJson('./data/export/basic.json').then(res=>{
            let value=localStorage.getItem('last_hexagram')||res[0].value;
            this.lists=res;
            this.setData(value);
        });
    },
    filters: {
        toChinesNum: function(num){
            return util.toChinesNum(num);
        }
    },
    methods: {
        setData(value){
            this.value=value.split('');
            this.selected=this.lists.find(e=>e.value==value);
            localStorage.setItem('last_hexagram', value);
        },
        handleChange(index){
            let value=this.value;
            value[index]=value[index]=='1' ? '0' : '1';
            this.setData(value.join(''));
        },
        handleSelect(){
            this.isSelect=true;
        },
        handleGetDetail(index){
            if(this.explain.lists==null){
                return util.getJson('./data/export/hexagram.json').then(res=>{
                    this.explain.lists=res;
                    this.handleGetDetail(index);
                });
            }
            this.explain.index=index;
            this.explain.detail=this.explain.lists.find(e=>e.index==this.selected.index);
            this.isExplain=true;
        }
    }
}
</script>

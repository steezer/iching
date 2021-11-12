<template>
    <div class="dialog" @click.self="$emit('close')">
        <div class="body detail">
            <div class="original">
                <p>{{original}}</p>
            </div>
            <div v-if="trans.length" class="trans">
                <p v-for="(item, index) of trans" :key="index"><b>直译：</b>{{item}}</p>
            </div>
            <div v-if="anno.length" class="anno">
                <p v-for="(item, index) of anno" :key="index"><b>注释：</b>{{item}}</p>
            </div>
            <div v-if="analysis.length" class="analysis">
                <p v-for="(item, index) of analysis" :key="index"><b>分析{{analysis.length>1?index+1:''}}：</b>{{item}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['index', 'detail', 'selected'],
    data: function(){
        return {
            name: ''
        };
    },
    created: function(){
        if(!this.isShow){
            this.$emit('close');
        }
    },
    computed: {
        isShow: function(){
            return this.anno.length>0 || this.trans.length>0 || this.analysis.length>0
        },
        original: function(){
            return this.index==-1 ? this.selected.hexagram:
                    this.selected.trigrams[this.index];
        },
        anno: function(){
            return this.getExplain(this.detail, 'anno', this.index);
        },
        trans: function(){
            return this.getExplain(this.detail, 'trans', this.index);
        },
        analysis: function(){
            return this.getExplain(this.detail, 'analysis', this.index);
        }
    },
    methods: {
        getExplain: function(data, type, index){
            const content=index==-1 ? data[type] : 
                (typeof(data.trigrams[index])!='undefined' ? 
                    data.trigrams[index][type]: '');
            if(content instanceof Array){
                return content;
            }
            if(content!==''){
                return [content];
            }
            return [];
        }
    }
}
</script>

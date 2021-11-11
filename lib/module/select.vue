<template>
    <div class="dialog" @click.self="$emit('close')">
        <div class="body select">
            <ul>
                <li v-for="(item, index) of lists" :key="index" :class="{on: item.value==selected}" @click.stop="handleSelect(item)">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['lists', 'selected'],
    data: function(){
        return {
            name: '1212'
        };
    },
    methods: {
        handleSelect(item){
            this.$emit('select', item.value);
            this.$emit('close');
        }
    }
}
</script>

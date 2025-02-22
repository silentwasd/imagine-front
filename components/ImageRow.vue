<script setup lang="ts">
import type TagResource from "~/resources/TagResource";

defineProps<{
    items: any[]
}>();

const rowRef         = ref();
const {width}        = useElementBounding(rowRef);
const widthDebounced = useDebounce(width, 150);
</script>

<template>
    <div ref="rowRef">
        <div class="grid grid-cols-5 transition-all"
             :style="`height: ${widthDebounced / 5}px;`">
            <ImageItem v-for="item in items"
                       :key="item.innerId"
                       :item="item"
                       :style="`height: ${widthDebounced / 5}px;`"
                       class="w-full transition-all"
                       @click="item.state == 'uploaded' ? (navigateTo('/?id=' + item.id)) : null"/>
        </div>
    </div>
</template>

<style scoped>

</style>
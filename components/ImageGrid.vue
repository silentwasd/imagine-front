<script setup lang="ts">
import type ImageResource from "~/resources/ImageResource";

const props = defineProps<{
    images: ImageResource[],
    currentId: number
}>();

const readyCount = ref<number>(0);
const loading = computed<boolean>(() => props.images.length == 0 || readyCount.value < props.images.length);
</script>

<template>
    <div class="relative flex justify-center items-start overflow-auto p-2 transition-opacity"
         :class="{'opacity-0': loading, 'opacity-100': !loading}">
        <div class="grid grid-cols-4 gap-2">
            <ImageGridItem v-for="image in images"
                           :image="image"
                           :is-active="currentId == image.id"
                           :loading="readyCount < images.length"
                           @ready="readyCount++"/>
        </div>
    </div>
</template>

<style scoped>

</style>
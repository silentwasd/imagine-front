<script setup lang="ts">
import type ImageResource from "~/resources/ImageResource";

const props = defineProps<{
    images: ImageResource[],
    currentId?: number
}>();
</script>

<template>
    <div class="relative flex justify-center items-start overflow-auto p-2 transition-opacity">
        <div class="grid gap-2"
             :class="{'grid-cols-4': currentId, 'grid-cols-8': !currentId}">
            <ImageGridItem v-for="image in images"
                           :image="image"
                           :is-active="currentId == image.id"/>
        </div>
    </div>
</template>

<style scoped>

</style>
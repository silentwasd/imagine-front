<script setup lang="ts">
import type ImageResource from "~/resources/ImageResource";

defineProps<{
    images: ImageResource[]
}>();
</script>

<template>
    <div class="flex justify-center p-2">
        <div class="grid grid-cols-4 gap-2">
            <NuxtLink v-for="image in images"
                      class="w-full"
                      :to="`/image?id=${image.id}`">
                <img :src="fileUrl(image.preview_path)"
                     loading="lazy"/>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
import type ImageResource from "~/resources/ImageResource";

const props = defineProps<{
    image: ImageResource,
    isActive: boolean
}>();

const imageRef = ref();

watch(() => props.isActive, (value) => {
    if (!value)
        return;

    imageRef.value.scrollIntoView({behavior: 'smooth', block: 'nearest'});
});

onMounted(() => {
    if (props.isActive)
        imageRef.value.scrollIntoView({behavior: 'instant', block: 'nearest'});
});
</script>

<template>
    <NuxtLink class="w-full border-primary-500 transition-all duration-75"
              :class="{'border-8': isActive}"
              :to="`/image?id=${image.id}`">
        <img :src="fileUrl(image.preview_path)"
             ref="imageRef"
             loading="lazy"/>
    </NuxtLink>
</template>

<style scoped>

</style>
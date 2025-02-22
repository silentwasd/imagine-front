<script setup lang="ts">
import type ImageResource from "~/resources/ImageResource";

const props = defineProps<{
    image: ImageResource,
    isActive: boolean,
    tags: number[]
}>();

const imageRef = ref();

watch(() => props.isActive, (value) => {
    if (!value)
        return;

    useTimeoutFn(() => imageRef.value.scrollIntoView({behavior: 'smooth', block: 'nearest'}), 100);
});

onMounted(() => {
    if (props.isActive)
        imageRef.value.scrollIntoView({behavior: 'instant', block: 'nearest'});
});
</script>

<template>
    <NuxtLink class="w-full border-primary-500 transition-all duration-75 relative"
              :class="{'border-8': isActive}"
              :to="`/image?id=${image.id}&tags=${tags.join(',')}`">
        <img :src="fileUrl(image.preview_path)"
             ref="imageRef"
             loading="lazy"
             class="pointer-events-none"/>
    </NuxtLink>
</template>

<style scoped>

</style>
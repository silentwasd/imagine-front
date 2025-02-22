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
    <NuxtLink class="w-full border-primary-500 transition-all duration-75 relative group"
              :to="`/?id=${image.id}&tags=${tags.join(',')}`">
        <img :src="fileUrl(image.preview_path)"
             ref="imageRef"
             loading="lazy"
             class="pointer-events-none group-hover:rotate-3 transition-transform"
             :class="{'brightness-50': isActive}"/>
    </NuxtLink>
</template>

<style scoped>

</style>
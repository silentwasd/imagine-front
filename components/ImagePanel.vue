<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";
import type ImageResource from "~/resources/ImageResource";

const props = defineProps<{
    imageId: number,
    images: ImageResource[],
    tags: number[]
}>();

const imageRepo = new ImageRepository();
const image     = ref<ImageResource>();

const previewSrc = ref<string>(fileUrl(image.value?.preview_path ?? ''));
const imageSrc   = ref<string>(fileUrl(image.value?.path ?? ''));
const loading    = ref<boolean>(true);
const imageKey   = ref<number>(1);

watch(() => props.imageId, async (id) => {
    loading.value = true;
    imageKey.value++;

    previewSrc.value = '';
    imageSrc.value   = '';

    image.value = (props.images ?? []).filter(_image => _image.id == id)[0] ?? (await imageRepo.get(id)).data;

    previewSrc.value = fileUrl(image.value.preview_path ?? '');
    imageSrc.value   = fileUrl(image.value.path ?? '');
}, {immediate: true});

function onLoad() {
    setTimeout(() => loading.value = false, 10);
}

const {copy, copied} = useClipboard();
const toast = useToast();

watch(copied, value => {
    if (!value)
        return;

    toast.add({
        title: 'Успех',
        description: 'Теги успешно скопированы',
        icon: 'i-heroicons-check'
    });
});

onMounted(() => {
    loading.value = false;
});
</script>

<template>
    <div v-if="image"
         class="group w-1/2 h-dvh shrink-0 bg-cover bg-center bg-no-repeat"
         :style="`background-image: url(${previewSrc});`">
        <div class="relative flex items-center justify-center w-full h-full overflow-clip">
            <img :key="`image-${imageKey}`"
                 :src="imageSrc"
                 @load="onLoad"
                 class="absolute max-h-dvh z-10 transition-all"
                 :class="{'opacity-0 scale-125': loading, 'opacity-100 scale-100': !loading}"/>

            <div class="absolute w-full h-full backdrop-blur"></div>

            <div class="absolute w-full h-full flex items-center justify-center transition-opacity z-10"
                 :class="{'opacity-0': !loading, 'opacity-100': loading}">
                <UIcon class="animate-spin text-8xl text-gray-50/90"
                       name="i-heroicons-arrow-path-20-solid"/>
            </div>

            <div class="absolute w-full h-full top-0 z-10">
                <div
                    class="flex items-center justify-end gap-2.5 p-2.5 bg-gradient-to-b from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <UTooltip text="Скопировать теги">
                        <UButton color="white"
                                 variant="link"
                                 icon="i-heroicons-tag-16-solid"
                                 size="xl"
                                 class="drop-shadow [&>span]:w-8 [&>span]:h-8"
                                 :padded="false"
                                 @click="copy(image.tags.map(tag => '#' + tag.name).join(', '))"/>
                    </UTooltip>

                    <UButton color="white"
                             variant="link"
                             icon="i-heroicons-x-mark"
                             size="xl"
                             class="drop-shadow [&>span]:w-10 [&>span]:h-10"
                             :padded="false"
                             @click="navigateTo(`/?tags=${tags.join(',')}`)"/>
                </div>

                <div
                    class="absolute bottom-0 w-full p-2.5 bg-gradient-to-t bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="flex flex-wrap gap-x-1.5 drop-shadow">
                        <NuxtLink v-for="tag in image.tags"
                                  class="leading-5 hover:text-primary-400"
                                  :class="{'text-primary-400': tags.find(id => id == tag.id)}"
                                  :key="tag.id"
                                  :to="tags.find(id => id == tag.id) ? `/?id=${imageId}&tags=${tags.filter(id => id != tag.id).join(',')}` : `/?id=${imageId}&tags=${[...tags, tag.id].join(',')}`">
                            #{{ tag.name }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
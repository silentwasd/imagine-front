<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";
import type TagResource from "~/resources/TagResource";
import type ImageResource from "~/resources/ImageResource";
import type PaginatedCollection from "~/types/api/PaginatedCollection";

const tags = ref<TagResource[]>([]);

const imageRepo      = new ImageRepository();
const {data: images} = await imageRepo.lazyList<PaginatedCollection<ImageResource>>(() => ({
    tags: tags.value.map(tag => tag.id)
}));

const page      = ref<number>(1);
const nextId    = ref<number>(0);
const newImages = ref<any[]>([]);

watch(images, () => {
    newImages.value = [];
    page.value      = 1;
});

const items = computed<any[]>(() => [
    ...newImages.value,
    ...(images.value?.data ?? []).map(item => ({
        id          : item.id,
        innerId     : ++nextId.value,
        state       : 'uploaded',
        path        : item.path,
        preview_path: item.preview_path,
        created_at  : item.created_at,
        tags        : item.tags
    }))
]);

const sortedItems = computed(() => items.value.sort((a, b) => a.state == 'uploading' && b.state != 'uploading' ? -1 : 1));
const openedItem  = ref<any | null>(null);

const inputRef = ref<HTMLInputElement>();

function input() {
    newImages.value.unshift(
        ...([...inputRef.value?.files ?? []]).map((file: File) => ({
            innerId: -(++nextId.value),
            state  : 'upload-queue',
            file
        }))
    );
}

const loadingMore = ref<boolean>(false);

async function loadMore() {
    loadingMore.value = true;

    try {
        images.value?.data.push(...(await imageRepo.fetchList({
            tags: tags.value.map(tag => tag.id),
            page: ++page.value
        })).data);
    } finally {
        loadingMore.value = false;
    }
}

watch(newImages, (_items) => {
    if (_items.find(item => item.state == 'failed'))
        newImages.value = _items.filter(item => item.state != 'failed');

    if (_items.find(item => item.state == 'uploading'))
        return;

    _items.filter(item => item.state == 'upload-queue')
        .slice(0, 5)
        .forEach(item => {
            item.state = 'uploading';
        });
}, {deep: true});

function prevImage() {
    if (!openedItem.value)
        return;

    const uploaded   = sortedItems.value.filter(item => item.state == 'uploaded');
    openedItem.value = uploaded[Math.max(0, uploaded.findIndex(item => item.id == openedItem.value?.id) - 1)];
}

function nextImage() {
    if (!openedItem.value)
        return;

    const uploaded   = sortedItems.value.filter(item => item.state == 'uploaded');
    openedItem.value = uploaded[Math.min(uploaded.length - 1, uploaded.findIndex(item => item.id == openedItem.value?.id) + 1)];
}

defineShortcuts({
    arrowleft : {
        usingInput: true,
        handler   : () => prevImage()
    },
    arrowright: {
        usingInput: true,
        handler   : () => nextImage()
    }
});
</script>

<template>
    <UContainer class="flex flex-col gap-5 py-10">
        <input ref="inputRef"
               type="file"
               class="hidden"
               multiple
               @input="input"/>

        <div class="flex justify-center">
            <UButton label="Загрузить картинки"
                     icon="i-heroicons-arrow-up-tray"
                     size="xl"
                     @click="inputRef?.click()"/>
        </div>

        <div v-if="tags.length > 0" class="flex flex-wrap">
            <TagButton v-for="tag in tags"
                       :key="tag.id"
                       :tag="tag"
                       v-model="tags"/>
        </div>

        <div class="flex flex-col relative select-none">
            <ImageRow v-for="n in Math.ceil(items.length / 5)"
                      :items="sortedItems.slice((n - 1) * 5, n * 5)"
                      v-model="openedItem"
                      v-model:tags="tags"
                      @prev-image="prevImage"
                      @next-image="nextImage"/>
        </div>

        <div class="flex justify-center">
            <UButton label="Загрузить еще"
                     color="gray"
                     icon="i-heroicons-arrow-down"
                     size="xl"
                     :loading="loadingMore"
                     @click="loadMore"/>
        </div>
    </UContainer>
</template>

<style scoped>
</style>
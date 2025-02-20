<script setup lang="ts">
import type TagResource from "~/resources/TagResource";

defineProps<{
    items: any[]
}>();

defineEmits<{
    (e: 'prevImage'): void,
    (e: 'nextImage'): void
}>();

const rowRef         = ref();
const {width}        = useElementBounding(rowRef);
const widthDebounced = useDebounce(width, 150);

const openedItem    = defineModel<any | null>({default: () => null});
const openedItemRef = ref();

const tags = defineModel<TagResource[]>('tags', {default: () => []});

watch(openedItemRef, () => {
    if (!openedItemRef.value)
        return;

    openedItemRef.value.scrollIntoView({behavior: 'instant', block: 'center'});
});
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
                       @click="openedItem = item.state == 'uploaded' ? item : null"/>
        </div>

        <div v-if="openedItem && items.find(item => item.id == openedItem?.id)"
             class="bg-gray-800"
             ref="openedItemRef">
            <div class="flex w-full h-[400px]">
                <UButton color="gray"
                         icon="i-heroicons-chevron-left"
                         class="shrink-0 ring-0"
                         :ui="{rounded: 'rounded-none'}"
                         @click="$emit('prevImage')"/>

                <div class="w-[500px] bg-cover bg-center bg-no-repeat shrink-0"
                     :style="`background-image: url(${fileUrl(openedItem.path)});`">
                    <div class="flex items-center justify-center w-full h-full backdrop-blur">
                        <img :src="fileUrl(openedItem.path)" class="max-h-[400px]"/>
                    </div>
                </div>

                <div class="flex grow w-0 select-text overflow-auto py-5">
                    <div class="shrink-0 sticky top-0 order-1 pe-5">
                        <UButton color="gray"
                                 icon="i-heroicons-x-mark"
                                 @click="openedItem = null"/>
                    </div>

                    <div class="flex flex-wrap gap-1.5 px-5 grow h-0">
                        <TagButton v-for="tag in openedItem?.tags ?? []"
                                   :key="tag.id"
                                   :tag="tag"
                                   v-model="tags"/>
                    </div>
                </div>

                <UButton color="gray"
                         icon="i-heroicons-chevron-right"
                         class="shrink-0 ring-0"
                         :ui="{rounded: 'rounded-none'}"
                         @click="$emit('nextImage')"/>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
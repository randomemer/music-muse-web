<template>
  <div class="table-wrapper">
    <v-data-table
      fixed-header
      color="primary"
      class="rounded table"
      :items-per-page="PAGE_LIMIT"
      :headers="headers"
      :items="data?.items"
      :loading="pending && `primary`"
    >
      <template #top>
        <div class="table-header">
          <v-select
            hide-details
            v-model="timeRange"
            color="primary"
            density="compact"
            item-title="label"
            item-value="value"
            variant="solo-filled"
            :class="$style.time_range_select"
            :items="TIME_RANGE_ITEMS"
          />
        </div>
      </template>
      <template #item="{ index, item }">
        <tr>
          <td>{{ (page - 1) * 50 + index + 1 }}</td>
          <td><TrackItem :track="item" /></td>
        </tr>
      </template>
      <template #bottom>
        <div class="table-footer text-center">
          <v-pagination
            rounded="circle"
            density="comfortable"
            active-color="primary"
            v-model="page"
            :length="data ? Math.ceil(data.total / PAGE_LIMIT) : undefined"
          />
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";

definePageMeta({
  name: "app:dashboard:top-tracks",
  middleware: "auth",
  layout: "dashboard",
});

useHead({ title: "Top Tracks | Music Muse" });

const { $spotify } = useNuxtApp();

const timeRange = ref(SpotifyTimeRange.ShortTerm);
const page = ref(1);

const { data, pending, error } = useAsyncData(
  async () => {
    const query = new URLSearchParams({
      limit: `${PAGE_LIMIT}`,
      time_range: timeRange.value,
      offset: `${(page.value - 1) * PAGE_LIMIT}`,
    });
    const resp = await $spotify.get<SpotifyApi.UsersTopTracksResponse>(
      `/me/top/tracks?${query}`
    );

    return resp.data;
  },
  {
    watch: [timeRange, page],
  }
);

const headers = [
  { title: "#", key: "num", sortable: false },
  { title: "Track", key: "track", sortable: false },
];
</script>

<style scoped lang="scss">
.table-wrapper {
  position: sticky;
  top: var(--v-layout-top) + 1.8rem;
}

.table {
  td {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}

.table-header {
  display: flex;
  flex-direction: row-reverse;
  padding: 0.75rem;
}

.table-footer {
  padding: 0.75rem 0;
}
</style>

<style module>
.time_range_select {
  flex: unset;
}
</style>

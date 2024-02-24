<template>
  <div :class="$style['page']">
    <header :class="$style['page__header']">
      <img
        src="@/assets/images/logo.svg"
        :class="$style['page__logo']"
        alt="Geoguess Master Logo"
        :width="deviceState >= DEVICE_TYPES.TABLET_LANDSCAPE ? 60 : 44"
        :height="deviceState >= DEVICE_TYPES.TABLET_LANDSCAPE ? 60 : 44"
      >
      <a href="https://github.com/spider-hand/GeoguessMaster">
        <img
          src="@/assets/images/github.svg"
          :class="$style['page__github-ribbon']"
          alt="Fork me on Github"
        >
      </a>
    </header>
    <AuroraBackgroundComponent
      :from="'var(--color-brand-light)'"
      :x-percent="'40'"
      :y-percent="'90'"
    />
    <AuroraBackgroundComponent
      :from="'var(--color-tone-light)'"
      :x-percent="'90'"
      :y-percent="'30'"
    />
    <div :class="$style['page__container']">
      <CreateGameFormComponent />
      <span :class="$style['page__title']">Let's explore the world &#128526;</span>
    </div>
    <footer :class="$style['page__footer']">
      <span
        :style="{
          color: 'var(--color-surface-primary)',
          fontSize: '12px',
          fontWeight: 500,
        }"
      >
        All rights reserved. Copyright © {{ new Date().getFullYear() }}
        <strong>GeoguessMaster</strong>
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AuroraBackgroundComponent from "@/components/home/AuroraBackgroundComponent.vue";
import CreateGameFormComponent from "@/components/home/CreateGameFormComponent.vue";
import { useDeviceStore } from "@/stores/device";
import { storeToRefs } from "pinia";
import { DEVICE_TYPES } from "@/constants";

const deviceStore = useDeviceStore();
const { deviceState } = storeToRefs(deviceStore);
</script>

<style module lang="scss">
.page {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.page__header {
  @include pagePadding;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;

  @media #{$tablet-landscape} {
    height: 84px;
  }
}

.page__logo {
  height: 44px;

  @media #{$tablet-landscape} {
    height: 60px;
  }
}

.page__github-ribbon {
  position: absolute;
  top: 0;
  right: 0;
}

.page__container {
  @include pagePadding;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  top: 0;
  left: 0;
  padding-top: 48px;
  width: 100%;
  height: calc(100% - 84px); // header + footer

  @media #{$tablet-landscape} {
    height: calc(100% - 120px);
  }
}

.page__title {
  margin-top: 48px;
  font-size: 48px;
  font-weight: 700;
  color: var(--color-surface-primary);

  @media #{$tablet-landscape} {
    font-size: 60px;
  }
}

.page__footer {
  @include pagePadding;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  top: 0;
  left: 0;
  padding: 0 12px;
  width: 100%;
  height: 24px;

  @media #{$tablet-landscape} {
    height: 36px;
  }
}
</style>

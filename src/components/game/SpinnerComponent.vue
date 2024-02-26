<template>
  <div :class="$style['spinner']" />
</template>

<style module lang="scss">
.spinner {
  width: 64px;
  height: 64px;
  border: 8px solid white;
  border-top: 8px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

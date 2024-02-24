import { computed, ref } from "vue";

const useCountdown = (timePerRound: number) => {
  const remainingTime = ref<number>(timePerRound * 60);
  const hasStopped = ref(false);

  const minutes = computed<string>(() => {
    return String(Math.floor(remainingTime.value / 60)).padStart(2, "0");
  });

  const seconds = computed<string>(() => {
    return String(Math.floor(remainingTime.value % 60)).padStart(2, "0");
  });

  const countdown = computed<string>(() => {
    return `${minutes.value}:${seconds.value}`;
  });

  const startCountdown = () => {
    let target = performance.now();
    const interval = 1000;

    let currentTime = performance.now();
    let currentInterval = (target += interval) - currentTime;

    const tick = () => {
      if (hasStopped.value) return;
      currentTime = performance.now();
      currentInterval = (target += interval) - currentTime;

      remainingTime.value = Math.max(0, --remainingTime.value);

      setTimeout(tick, currentInterval);
    };

    setTimeout(tick, currentInterval);
  };

  const stopCountdown = () => {
    hasStopped.value = true;
  };

  return {
    remainingTime,
    countdown,
    startCountdown,
    stopCountdown,
  };
};

export default useCountdown;

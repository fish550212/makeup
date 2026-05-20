import { ref } from "vue";

export function useModal(initialValue = false) {
  const open = ref(initialValue);

  return {
    open,
    show: () => {
      open.value = true;
    },
    hide: () => {
      open.value = false;
    },
  };
}

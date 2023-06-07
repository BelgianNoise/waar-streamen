import { elasticOut } from 'svelte/easing';

export const spin = (node: HTMLElement, { duration }: { duration: number }) => {
  return {
    duration,
    css: (t: number) => {
      const eased = elasticOut(t + 0.08);

      return `
        transform: scale(${eased}) rotate(${eased * 360}deg);
      `;
    }
  };
}

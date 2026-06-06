<template>
  <div class="site-atmosphere" aria-hidden="true">
    <svg class="air-map" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
      <path class="air-current air-current-a" d="M-120 188 C 182 84 318 282 548 168 S 922 88 1124 184 S 1454 260 1568 112" />
      <path class="air-current air-current-b" d="M-160 370 C 88 300 268 438 482 356 S 866 250 1080 348 S 1362 438 1560 314" />
      <path class="air-current air-current-c" d="M-140 628 C 144 524 320 712 574 594 S 904 528 1126 628 S 1390 752 1580 580" />
    </svg>
  </div>
  <router-view />
</template>

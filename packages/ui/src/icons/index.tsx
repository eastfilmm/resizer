import type { SVGProps } from 'react';

/**
 * 아이콘.
 *
 * 예전에는 각 앱의 public/에 svg 파일을 두고 <img src="/download.svg">로
 * 참조했다. 컴포넌트는 @resizer/editor 한 곳으로 합쳤는데 그 아이콘은 앱마다
 * 한 벌씩 있어서, 아이콘을 바꾸면 양쪽을 고쳐야 했다(내용까지 동일한 파일 9개).
 *
 * 전부 300~700바이트라 인라인해도 부담이 없고, public/ 의존이 사라진다.
 * 원본 svg의 속성은 그대로 옮겼다(색 지정 방식도 동일). 루트의 width/height만
 * 뺐는데 크기는 CSS가 정하기 때문이다.
 */

export const LayoutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="M120-120v-520h200v-200h520v720H120Zm520-80h120v-560H400v120h240v440Zm-240 0h160v-360H400v360Zm-200 0h120v-360H200v360Zm440-440v80-80Zm-320 80Zm240 0Zm80-80Z"/>
  </svg>
);

export const PolaroidIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="M160-80q-33 0-56.5-23.5T80-160v-600q0-33 23.5-56.5T160-840h40v-40q0-17 11.5-28.5T240-920h160q17 0 28.5 11.5T440-880v40h40q33 0 56.5 23.5T560-760h320v600H560q0 33-23.5 56.5T480-80H160Zm0-80h320v-80h320v-440H480v-80H160v600Zm200-120h80v-80h-80v80Zm0-280h80v-80h-80v80Zm160 280h80v-80h-80v80Zm0-280h80v-80h-80v80Zm160 280h80v-80h-80v80Zm0-280h80v-80h-80v80ZM320-460Z"/>
  </svg>
);

export const BackgroundIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="M346-140 100-386q-10-10-15-22t-5-25q0-13 5-25t15-22l230-229-106-106 62-65 400 400q10 10 14.5 22t4.5 25q0 13-4.5 25T686-386L440-140q-10 10-22 15t-25 5q-13 0-25-5t-22-15Zm47-506L179-432h428L393-646Zm399 526q-36 0-61-25.5T706-208q0-27 13.5-51t30.5-47l42-54 44 54q16 23 30 47t14 51q0 37-26 62.5T792-120Z"/>
  </svg>
);

export const GlassBlurIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="M176-120q-19-4-35.5-20.5T120-176l664-664q21 5 36 20.5t21 35.5L176-120Zm-56-252v-112l356-356h112L120-372Zm0-308v-80q0-33 23.5-56.5T200-840h80L120-680Zm560 560 160-160v80q0 33-23.5 56.5T760-120h-80Zm-308 0 468-468v112L484-120H372Z"/>
  </svg>
);

export const ShadowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="m389-347 337-337q-11-12-22-23.5T680-729L367-415q4 18 9 34.5t13 33.5Zm338 70q29-35 47-76t23-86L547-189q8 3 16.5 7t16.5 6q44-14 81-40t66-61ZM160-480q0 122 79 211.5T436-163q-72-55-114-137.5T280-480q0-97 42-179.5T436-797q-118 16-197 105.5T160-480Zm317 247 315-314q-4-18-9-35t-13-33L432-278q11 13 21 23.5t24 21.5Zm3 153q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80ZM363-525l247-247q-8-3-14.5-6.5T581-784q-86 28-145.5 97.5T363-525Zm217 45Z"/>
  </svg>
);

export const DownloadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
  </svg>
);

export const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

export const RefreshIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
  </svg>
);

export const UploadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#1f1f1f" {...props}>
    <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
  </svg>
);

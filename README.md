<div align="center">
  <h1>여행 일정 공유 웹사이트[TRIPPLANNER]🌍</h1>
  
  TripPlanner는 나만의 여행 계획을 작성하고, 다른 사람들과 공유할 수 있는 웹 플랫폼입니다. 여행일정 계획을 세울 때, 실질적으로 소요되는 비용, 항공편, 숙소, 물가 등등 필수적인 사항들을 작성하고, 다른이들과 공유하며 서로의 여행의 이정표가 되었으면 합니다.

</div>

## 미리 보기

<div align="center">
  <img src="./images/main.png" width="300" alt="시작 화면" />
  <img src="./images/info.png" width="375" alt="사용자 정보 화면" />
</div>


## 주요 기능

<table> <tr> <td width="50" align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/user-check.svg" width="22" style="filter: invert(36%) sepia(98%) saturate(623%) hue-rotate(120deg) brightness(92%) contrast(88%);" /> </td> <td><b>회원가입 / 로그인</b> — JWT 기반 인증을 통해 안전한 사용자 로그인 및 세션 유지 기능을 제공합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/plane.svg" width="22" style="filter: invert(36%) sepia(98%) saturate(623%) hue-rotate(190deg) brightness(95%) contrast(90%);" /> </td> <td><b>여행일정 관리</b> — 사용자가 여행일정을 작성, 수정, 삭제할 수 있습니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/map-pin.svg" width="22" style="filter: invert(41%) sepia(93%) saturate(347%) hue-rotate(125deg) brightness(95%) contrast(85%);" /> </td> <td><b>Google Maps 연동</b> — 지도에 핀을 등록하고 이미지와 함께 여행 장소를 기록할 수 있습니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/message-circle.svg" width="22" style="filter: invert(40%) sepia(92%) saturate(548%) hue-rotate(240deg) brightness(90%) contrast(92%);" /> </td> <td><b>실시간 채팅</b> — WebSocket(STOMP)을 이용하여 여행자 간 실시간 소통을 제공합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/bell.svg" width="22" style="filter: invert(68%) sepia(50%) saturate(830%) hue-rotate(15deg) brightness(98%) contrast(92%);" /> </td> <td><b>실시간 알림</b> — SSE(Server-Sent Events) 기반으로 댓글, 좋아요 알림을 실시간으로 제공합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/message-square.svg" width="22" style="filter: invert(28%) sepia(90%) saturate(380%) hue-rotate(290deg) brightness(94%) contrast(90%);" /> </td> <td><b>댓글 및 대댓글</b> — 여행일지에 댓글, 대댓글, 좋아요 기능을 지원합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/search.svg" width="22" style="filter: invert(70%) sepia(45%) saturate(830%) hue-rotate(195deg) brightness(98%) contrast(90%);" /> </td> <td><b>게시글 검색 및 페이징</b> — 제목 및 작성자 기준으로 여행일지를 검색하고, 페이지 단위로 탐색할 수 있습니다.</td> </tr> </table>

## 기술 스택

<p align="left"> 
    <h3>Backend</h3>
    <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white"/> 
    <img src="https://img.shields.io/badge/WebSocket(STOMP)-4B32C3?style=flat-square&logo=stomp&logoColor=white"/> 
    <img src="https://img.shields.io/badge/Spring%20Data%20JPA-59666C?style=flat-square&logo=spring&logoColor=white"/> 
    <img src="https://img.shields.io/badge/WebFlux-6DB33F?style=flat-square&logo=spring&logoColor=white"/> 
</p>

<p align="left">
    <h3>Frontend</h3>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
    <img src="https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=react&logoColor=white"/>
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
 </p>
 
<p align="left">
    <h3>Database</h3>
    <img src="https://img.shields.io/badge/MariaDB-003545?style=flat-square&logo=mariadb&logoColor=white"/> 
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white"/> 
</p>


## 아키텍처

```mermaid
flowchart LR
    A[Next.js Zustand] -- STOMP/SockJS --> B(Spring WebSocket)
    A -- REST/JSON --> C[Spring Boot API]
    C --> D[(MariaDB)]
    B --> E[(MongoDB)]
    C -- SSE --> A
```


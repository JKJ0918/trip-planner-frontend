<div align="center">
  <h1>여행 일정 공유 웹사이트[TRIPPLANNER]🌍</h1>
</div>

## 프로젝트 개요

TripPlanner는 여행 일정을 계획하고, 실제 비용·항공편·숙소 등의 정보를 함께 기록할 수 있는 여행 공유 플랫폼입니다.  
사용자는 자신의 여행일지를 작성하고 지도 기반으로 핀을 등록하며, 다른 사람들과 댓글·채팅으로 소통할 수 있습니다.  
실시간 알림(SSE)과 WebSocket 채팅을 통해 여행자 간 상호작용 경험을 극대화했습니다.




<div align="center">
  <img src="./images/main.png" width="300" alt="시작 화면" />
  <img src="./images/info.png" width="375" alt="사용자 정보 화면" />
</div>

## 📆 개발 기간 및 인원

- **기간**: 2025.03 ~ 2025.10 (약 7개월)
- **참여 인원**: 1인 개인 프로젝트 (Full Stack 개발)
- **역할**: 백엔드(Spring Boot) / 프론트엔드(Next.js)


## 주요 기능

<table> <tr> <td width="50" align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/user-check.svg" width="22" style="filter: invert(36%) sepia(98%) saturate(623%) hue-rotate(120deg) brightness(92%) contrast(88%);" /> </td> <td><b>회원가입 / 로그인</b> — JWT 기반 인증을 통해 안전한 사용자 로그인 및 세션 유지 기능을 제공합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/plane.svg" width="22" style="filter: invert(36%) sepia(98%) saturate(623%) hue-rotate(190deg) brightness(95%) contrast(90%);" /> </td> <td><b>여행일정 관리</b> — 사용자가 여행일정을 작성, 수정, 삭제할 수 있습니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/map-pin.svg" width="22" style="filter: invert(41%) sepia(93%) saturate(347%) hue-rotate(125deg) brightness(95%) contrast(85%);" /> </td> <td><b>Google Maps 연동</b> — 지도에 핀을 등록하고 이미지와 함께 여행 장소를 기록할 수 있습니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/message-circle.svg" width="22" style="filter: invert(40%) sepia(92%) saturate(548%) hue-rotate(240deg) brightness(90%) contrast(92%);" /> </td> <td><b>실시간 채팅</b> — WebSocket(STOMP)을 이용하여 여행자 간 실시간 소통을 제공합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/bell.svg" width="22" style="filter: invert(68%) sepia(50%) saturate(830%) hue-rotate(15deg) brightness(98%) contrast(92%);" /> </td> <td><b>실시간 알림</b> — SSE(Server-Sent Events) 기반으로 댓글, 좋아요 알림을 실시간으로 제공합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/message-square.svg" width="22" style="filter: invert(28%) sepia(90%) saturate(380%) hue-rotate(290deg) brightness(94%) contrast(90%);" /> </td> <td><b>댓글 및 대댓글</b> — 여행일지에 댓글, 대댓글, 좋아요 기능을 지원합니다.</td> </tr> <tr> <td align="center"> <img src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/search.svg" width="22" style="filter: invert(70%) sepia(45%) saturate(830%) hue-rotate(195deg) brightness(98%) contrast(90%);" /> </td> <td><b>게시글 검색 및 페이징</b> — 제목 및 작성자 기준으로 여행일지를 검색하고, 페이지 단위로 탐색할 수 있습니다.</td> </tr> </table>


## 기술 스택 & 개발 환경

<div>
🖥️ Frontend
<p> <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Zustand-764ABC?style=flat-square&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/> <img src="https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white"/> </p>
⚙️ Backend
<p> <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white"/> <img src="https://img.shields.io/badge/WebSocket(STOMP)-4B32C3?style=flat-square&logo=stomp&logoColor=white"/> <img src="https://img.shields.io/badge/Spring%20Data%20JPA-59666C?style=flat-square&logo=spring&logoColor=white"/> <img src="https://img.shields.io/badge/WebFlux-6DB33F?style=flat-square&logo=spring&logoColor=white"/> <img src="https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=flat-square&logo=intellijidea&logoColor=white"/> </p>
🗄️ Database
<p> <img src="https://img.shields.io/badge/MariaDB-003545?style=flat-square&logo=mariadb&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white"/> <img src="https://img.shields.io/badge/DBeaver-372923?style=flat-square&logo=dbeaver&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB%20Compass-47A248?style=flat-square&logo=mongodb&logoColor=white"/> </p>
🧰 Infra
<p> <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> </p> </div>


## 아키텍처

```mermaid
flowchart LR
    A[Next.js Zustand] -- STOMP/SockJS --> B(Spring WebSocket)
    A -- REST/JSON --> C[Spring Boot API]
    C --> D[(MariaDB)]
    B --> E[(MongoDB)]
    C -- SSE --> A
```


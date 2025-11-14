// 이용 가이드 페이지
"use client";

// app/guide/page.tsx

import React from "react";
import Link from "next/link";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 Hero 영역 */}
      <section className="w-full bg-gradient-to-b from-gray-900/80 to-gray-900/60 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
          <p className="text-sm md:text-base text-gray-300 mb-2">이용 가이드</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            TripPlanner를 처음 사용하시나요?
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-6">
            여행 정보 입력부터 지도에 핀 찍기, 날짜별 상세 일정 작성까지
            <br />
            아래 순서를 따라 오면서 차근차근 여행을 완성해 보세요.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 transition text-sm md:text-base font-semibold"
            >
              여행 계획 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 전체 3단계 요약 */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          한눈에 보는 이용 방법
        </h2>
        <p className="text-gray-600 mb-8">
          TripPlanner는 크게 세 단계로 여행을 완성할 수 있도록 설계되었습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            step="STEP 1"
            title="여행 기본 정보 입력"
            icon={
              <img
                src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/plane.svg"
                width={22}
                style={{
                  filter:
                    "invert(36%) sepia(98%) saturate(623%) hue-rotate(190deg) brightness(95%) contrast(90%)",
                }}
                alt="여행 아이콘"
              />
            }
            description="여행 제목, 도시, 날짜, 인원 등을 입력해 여행의 뼈대를 만듭니다."
          />
          <StepCard
            step="STEP 2"
            title="지도에서 방문지 추가"
            icon={
              <img
                src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/map-pin.svg"
                width={22}
                style={{
                  filter:
                    "invert(41%) sepia(93%) saturate(347%) hue-rotate(125deg) brightness(95%) contrast(85%)",
                }}
                alt="지도 핀 아이콘"
              />
            }
            description="지도에 핀을 찍고, 사진·비용·메모를 남기며 가고 싶은 장소를 정리합니다."
          />
          <StepCard
            step="STEP 3"
            title="날짜별 상세 일정 작성"
            icon={
              <img
                src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/search.svg"
                width={22}
                style={{
                  filter:
                    "invert(70%) sepia(45%) saturate(830%) hue-rotate(195deg) brightness(98%) contrast(90%)",
                }}
                alt="일정 아이콘"
              />
            }
            description="각 날짜별로 구체적인 동선과 메모를 추가하며 일정을 완성합니다."
          />
        </div>
      </section>

      {/* 상세 가이드 섹션들 */}
      <section className="max-w-5xl mx-auto px-4 pb-16 space-y-14 md:space-y-16">
        {/* 1. 여행 일정 만들기 */}
        <GuideSection
          icon={
            <img
              src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/plane.svg"
              width={22}
              style={{
                filter:
                  "invert(36%) sepia(98%) saturate(623%) hue-rotate(190deg) brightness(95%) contrast(90%)",
              }}
              alt="여행일정 아이콘"
            />
          }
          title="1. 여행 일정 만들기"
          description={
            <>
              상단 메뉴에서 <strong>“계획 하기”</strong> 또는 메인 배너의{" "}
              <strong>“여행 계획 시작하기”</strong> 버튼을 눌러 새로운 여행을
              생성할 수 있습니다.
            </>
          }
          bullets={[
            "여행 제목: 한눈에 알아볼 수 있는 이름을 정해 주세요.",
            "여행 도시: 여행할 도시 또는 국가를 선택합니다.",
            "여행 날짜: 출발일과 도착일을 선택해 기본 기간을 설정합니다.",
            "인원·예산·교통수단 등 추가 정보를 입력해도 좋습니다.",
          ]}
          tip="여행 기본 정보는 나중에도 언제든지 수정할 수 있으니 부담 없이 대략적으로 입력해도 괜찮아요."
        />

        {/* 2. 지도에서 방문지 등록 */}
        <GuideSection
          icon={
            <img
              src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/map-pin.svg"
              width={22}
              style={{
                filter:
                  "invert(41%) sepia(93%) saturate(347%) hue-rotate(125deg) brightness(95%) contrast(85%)",
              }}
              alt="지도 핀 아이콘"
            />
          }
          title="2. 지도에서 방문지 등록하기"
          description={
            <>
              여행 게시글을 만들었다면, 이제{" "}
              <strong>지도에서 가고 싶은 장소를 추가</strong>할 차례입니다.
            </>
          }
          bullets={[
            "여행 상세 페이지 또는 편집 화면에서 지도를 확인할 수 있습니다.",
            "지도의 원하는 위치를 클릭하면 핀이 생성되고 정보 입력창이 열립니다.",
            "장소 이름, 설명, 예상 비용, 방문 시간 등을 입력합니다.",
            "사진 업로드 버튼을 통해 최대 3장의 이미지를 등록할 수 있습니다.",
            "저장 버튼을 누르면 해당 핀이 여행 일정에 반영됩니다.",
          ]}
          tip="나중에 핀을 다시 클릭하면 내용을 수정하거나 삭제할 수 있습니다."
        />

        {/* 3. 날짜별 상세 일정 */}
        <GuideSection
          icon={
            <img
              src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/search.svg"
              width={22}
              style={{
                filter:
                  "invert(70%) sepia(45%) saturate(830%) hue-rotate(195deg) brightness(98%) contrast(90%)",
              }}
              alt="일정 아이콘"
            />
          }
          title="3. 날짜별 상세 일정 작성하기"
          description={
            <>
              여행 기간이 설정되어 있다면, 각 날짜별로{" "}
              <strong>Day Plan(상세 일정)</strong>을 작성할 수 있습니다.
            </>
          }
          bullets={[
            "여행 상세 페이지에서 날짜별 일정 탭을 선택합니다.",
            "각 날짜에 제목과 내용을 입력해 하루 동선을 정리합니다.",
            "필요하다면 ‘일정 추가’ 버튼을 눌러 같은 날에 여러 일정을 만들 수 있습니다.",
            "사진 업로드 기능을 통해 해당 날짜에 찍은 사진을 함께 기록할 수 있습니다.",
            "불필요해진 일정은 삭제 버튼으로 쉽게 제거할 수 있습니다.",
          ]}
          tip="날짜와 완벽히 맞지 않아도 괜찮아요. 대략적인 동선을 적어두는 용도로 사용해도 좋습니다."
        />

        {/* 4. 댓글 & 좋아요 */}
        <GuideSection
          icon={
            <img
              src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/message-square.svg"
              width={22}
              style={{
                filter:
                  "invert(28%) sepia(90%) saturate(380%) hue-rotate(290deg) brightness(94%) contrast(90%)",
              }}
              alt="댓글 아이콘"
            />
          }
          title="4. 댓글 & 좋아요로 소통하기"
          description={
            <>
              다른 사용자의 여행을 참고하거나, 내 여행에 대한 의견을 주고받을
              수 있습니다.
            </>
          }
          bullets={[
            "게시글 하단에서 댓글을 작성할 수 있습니다.",
            "댓글은 수정·삭제가 가능하며, 수정된 댓글에는 ‘수정됨’ 표시가 붙습니다.",
            "대댓글 기능을 통해 질문이나 피드백을 남길 수 있습니다.",
            "좋아요 버튼을 눌러 마음에 드는 여행 계획에 공감을 표현할 수 있습니다.",
          ]}
          tip="댓글이나 좋아요는 로그인한 사용자만 이용할 수 있어요."
        />

        {/* 5. 실시간 알림(SSE) */}
        <GuideSection
          icon={
            <img
              src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/bell.svg"
              width={22}
              style={{
                filter:
                  "invert(68%) sepia(50%) saturate(830%) hue-rotate(15deg) brightness(98%) contrast(92%)",
              }}
              alt="알림 아이콘"
            />
          }
          title="5. 실시간 알림 확인하기"
          description={
            <>
              TripPlanner는 <strong>SSE(Server-Sent Events)</strong>를 이용해
              실시간 알림을 제공합니다.
            </>
          }
          bullets={[
            "내 게시글에 새로운 댓글이 달리면 알림이 도착합니다.",
            "내가 쓴 댓글에 대댓글이 달려도 알림을 받을 수 있습니다.",
            "누군가 내 게시글에 좋아요를 눌렀을 때도 알림이 표시됩니다.",
            "알림 영역을 클릭하면 관련 게시글 상세 페이지로 바로 이동합니다.",
          ]}
          tip="로그인 상태에서 사이트에 접속하면 자동으로 알림 채널을 구독합니다."
        />

        {/* 6. 프로필 관리 */}
        <GuideSection
          icon={
            <img
              src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide/icons/user-check.svg"
              width={22}
              style={{
                filter:
                  "invert(36%) sepia(98%) saturate(623%) hue-rotate(120deg) brightness(92%) contrast(88%)",
              }}
              alt="프로필 아이콘"
            />
          }
          title="6. 내 프로필에서 활동 내역 관리하기"
          description={
            <>
              상단 메뉴 또는 프로필 아이콘을 통해{" "}
              <strong>내 프로필 페이지</strong>로 이동할 수 있습니다.
            </>
          }
          bullets={[
            "닉네임과 프로필 이미지를 수정해 나만의 계정을 꾸밀 수 있습니다.",
            "내가 작성한 여행 게시글 목록을 한눈에 확인할 수 있습니다.",
            "추후에는 내가 좋아요한 게시글 목록도 모아서 볼 수 있도록 확장될 예정입니다.",
          ]}
          tip="프로필은 포트폴리오처럼 사용할 수 있으니, 여행 기록을 꾸준히 쌓아 보세요."
        />
      </section>
    </main>
  );
}

type StepCardProps = {
  step: string;
  title: string;
  icon: React.ReactNode;
  description: string;
};

function StepCard({ step, title, icon, description }: StepCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-500 tracking-wide">
        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100">
          {icon}
        </div>
        <span>{step}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

type GuideSectionProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  bullets: string[];
  tip?: string;
};

function GuideSection({ icon, title, description, bullets, tip }: GuideSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-7">
      <div className="flex items-center gap-3 mb-3">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>

      <ul className="list-disc list-inside space-y-1.5 text-gray-700 text-sm md:text-base mb-4">
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {tip && (
        <div className="mt-2 rounded-xl bg-yellow-50 border border-yellow-100 px-4 py-3 text-sm text-yellow-800">
          <span className="font-semibold mr-1">Tip.</span>
          {tip}
        </div>
      )}
    </section>
  );
}

// MemoryGame 클래스 정의
      class MemoryGame {
        constructor() {
          // 게임 목표 카드 데이터 (아이콘은 SVG path)
          // 각 목표에 고유한 파스텔 색상 변수 할당
          this.goals = [
            {
              text: "알고리즘 향상",
              icon: "M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8L6,7L4,9M4,15H8L6,13L4,15Z",
              colorVar: "var(--pastel-blue)",
            }, // 리스트 아이콘
            {
              text: "1학기 성적우수",
              icon: "M12,2L15.09,8.26L22,9L17,14L18.18,21L12,17.77L5.82,21L7,14L2,9L8.91,8.26L12,2Z",
              colorVar: "var(--pastel-purple)",
            }, // 별 아이콘
            {
              text: "취업 성공",
              icon: "M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z",
              colorVar: "var(--pastel-orange)",
            }, // 가방 아이콘
            {
              text: "B형 취득",
              icon: "M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8L6,7L4,9M4,15H8L6,13L4,15Z",
              colorVar: "var(--pastel-green)",
            }, // 리스트 아이콘 (알고리즘 향상과 동일한 아이콘)
          ];
          // 스페셜 카드 데이터
          this.specialCard = {
            text: "14기 파이팅!",
            icon: "M12,2L13.09,8.26L20,9L13.09,9.74L12,16L10.91,9.74L4,9L10.91,8.26L12,2Z",
          }; // 별 아이콘
          this.cards = []; // 현재 게임에 사용될 카드 배열
          this.flippedCards = []; // 뒤집힌 카드 배열
          this.matchedPairs = 0; // 매칭된 쌍의 수
          this.isChecking = false; // 카드 매칭 확인 중인지 여부
          this.gameStarted = false; // 게임 시작 여부
          this.startTime = null; // 게임 시작 시간
          this.timerInterval = null; // 타이머 인터벌 ID

          this.initializeGame(); // 게임 초기화
          this.setupEventListeners(); // 이벤트 리스너 설정
        }

        // 게임 초기화 메서드
        initializeGame() {
          this.createCards(); // 카드 생성
          this.renderCards(); // 카드 렌더링
          this.updateProgress(); // 진행률 업데이트
        }

        // 카드 생성 메서드
        createCards() {
          const goalCards = [];
          this.goals.forEach((goal) => {
            goalCards.push(goal, goal); // 각 목표를 두 번 추가하여 쌍을 만듦
          });

          this.cards = [...goalCards]; // 목표 카드들을 복사
          this.shuffleCards(); // 카드 섞기
        }

        // 카드 섞기 메서드
        shuffleCards() {
          for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // Fisher-Yates 셔플 알고리즘
          }

          // 스페셜 카드를 4번째 인덱스에 삽입 (총 9개의 카드 중 5번째 위치)
          this.cards.splice(4, 0, this.specialCard);
        }

        // 카드 렌더링 메서드
        renderCards() {
          const gameBoard = document.getElementById("gameBoard");
          gameBoard.innerHTML = ""; // 기존 카드 모두 제거

          this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index); // 각 카드 요소 생성
            gameBoard.appendChild(cardElement); // 게임 보드에 추가
          });
        }

        // 개별 카드 요소 생성 메서드
        createCardElement(cardData, index) {
          const cardDiv = document.createElement("div");
          cardDiv.className = `card ${
            cardData.text === this.specialCard.text ? "special-card" : ""
          }`; // 스페셜 카드 클래스 추가
          cardDiv.dataset.index = index; // 데이터 인덱스 설정
          cardDiv.dataset.value = cardData.text; // 데이터 값 설정
          cardDiv.setAttribute(
            "tabindex",
            cardData.text === this.specialCard.text ? "-1" : "0"
          ); // 스페셜 카드는 탭 순서에서 제외
          cardDiv.setAttribute("role", "button"); // 접근성을 위한 역할 설정
          cardDiv.setAttribute("aria-label", `카드 ${index + 1}`); // 접근성을 위한 레이블 설정

          // 카드 뒷면의 배경색과 테두리 색상을 동적으로 설정
          const cardBackStyle = cardData.colorVar
            ? `background: ${
                cardData.colorVar
              }; border-color: ${cardData.colorVar
                .replace("var(", "")
                .replace(")", "")};`
            : "";

          // 카드 내부 HTML 구조
          cardDiv.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <svg class="card-front-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
                            </svg>
                            <div class="card-front-text">터치하세요</div>
                        </div>
                        <div class="card-back" style="${cardBackStyle}">
                            <svg class="card-back-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="${cardData.icon}"/>
                            </svg>
                            <div>${cardData.text}</div>
                        </div>
                    </div>
                `;

          // 스페셜 카드는 항상 뒤집히고 매칭된 상태로 표시
          if (cardData.text === this.specialCard.text) {
            cardDiv.classList.add("flipped", "matched");
          } else {
            // 일반 카드는 클릭 및 키보드 이벤트 리스너 추가
            cardDiv.addEventListener("click", () =>
              this.handleCardClick(cardDiv)
            );
            cardDiv.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.handleCardClick(cardDiv);
              }
            });
          }

          return cardDiv;
        }

        // 이벤트 리스너 설정 메서드
        setupEventListeners() {
          const startButton = document.getElementById("startButton");
          startButton.addEventListener("click", () => this.startGame()); // 시작 버튼 클릭 이벤트
        }

        // 진행률 업데이트 메서드
        updateProgress() {
          // 매칭된 쌍의 수에 따라 진행률 계산 (총 4쌍)
          const progress = (this.matchedPairs / 4) * 100;
          document.getElementById("progressFill").style.width = `${progress}%`;
        }

        // 게임 시작 메서드
        async startGame() {
          // 게임이 이미 시작되었으면 리셋
          if (this.gameStarted) {
            this.resetGame();
            return;
          }

          this.gameStarted = true; // 게임 시작 상태로 변경
          this.startTime = Date.now(); // 시작 시간 기록
          this.startTimer(); // 타이머 시작

          const startButton = document.getElementById("startButton");
          startButton.disabled = true; // 버튼 비활성화
          startButton.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                    </svg>
                    진행중...
                `;
          startButton.classList.add("pulsing"); // 맥박 애니메이션 추가

          this.showAllCards(); // 모든 카드 잠시 보여주기

          await this.delay(3000); // 3초 대기

          this.hideAllCards(); // 모든 카드 다시 숨기기
          // 버튼 텍스트 변경 및 활성화
          startButton.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,8L15,12H18A6,6 0 0,1 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20A8,8 0 0,0 20,12H23M6,12A6,6 0 0,1 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4A8,8 0 0,0 4,12H1L5,16L9,12"/>
                    </svg>
                    게임 재시작
                `;
          startButton.classList.remove("pulsing"); // 맥박 애니메이션 제거
          startButton.disabled = false; // 버튼 다시 활성화
        }

        // 게임 리셋 메서드
        resetGame() {
          this.flippedCards = [];
          this.matchedPairs = 0;
          this.isChecking = false;
          this.gameStarted = false;
          this.startTime = null;

          // 타이머 중지 및 초기화
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
          }

          document.getElementById("timer").textContent = "00:00";

          // 완료 메시지 숨기기
          const completionMessage =
            document.getElementById("completionMessage");
          completionMessage.classList.remove("show");

          // 시작 버튼 텍스트 초기화
          const startButton = document.getElementById("startButton");
          startButton.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                    </svg>
                    게임 시작
                `;

          this.createCards(); // 카드 재 생성
          this.renderCards(); // 카드 재 렌더링
          this.updateProgress(); // 진행률 초기화
        }

        // 타이머 시작 메서드
        startTimer() {
          this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000); // 경과 시간 (초)
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`; // 시간 문자열 포맷
            document.getElementById("timer").textContent = timeString;
          }, 1000);
        }

        // 타이머 중지 메서드
        stopTimer() {
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
          }

          const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
          const finalTime = `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;

          document.getElementById("finalTime").textContent = finalTime; // 최종 시간 표시
          return finalTime;
        }

        // 모든 카드 보여주기 (게임 시작 시)
        showAllCards() {
          const cards = document.querySelectorAll(".card:not(.special-card)"); // 스페셜 카드 제외
          cards.forEach((card) => card.classList.add("flipped"));
        }

        // 모든 카드 숨기기 (게임 시작 후)
        hideAllCards() {
          const cards = document.querySelectorAll(
            ".card:not(.special-card):not(.matched)"
          ); // 스페셜 카드 및 매칭된 카드 제외
          cards.forEach((card) => card.classList.remove("flipped"));
        }

        // 카드 클릭 핸들러
        handleCardClick(cardElement) {
          // 매칭 확인 중이거나 이미 뒤집혔거나 매칭된 카드면 무시
          if (
            this.isChecking ||
            cardElement.classList.contains("flipped") ||
            cardElement.classList.contains("matched")
          ) {
            return;
          }

          cardElement.classList.add("flipped"); // 카드 뒤집기
          this.flippedCards.push(cardElement); // 뒤집힌 카드 배열에 추가

          if (this.flippedCards.length === 2) {
            this.checkMatch(); // 두 장의 카드가 뒤집혔으면 매칭 확인
          }
        }

        // 카드 매칭 확인 메서드
        async checkMatch() {
          this.isChecking = true; // 매칭 확인 중 상태로 변경
          const [card1, card2] = this.flippedCards;

          await this.delay(1000); // 1초 대기

          if (card1.dataset.value === card2.dataset.value) {
            // 카드 값이 같으면 매칭 처리
            card1.classList.add("matched");
            card2.classList.add("matched");
            this.matchedPairs++; // 매칭된 쌍 수 증가
            this.updateProgress(); // 진행률 업데이트

            if (this.matchedPairs === 4) {
              this.showCompletionMessage(); // 모든 쌍을 찾았으면 완료 메시지 표시
            }
          } else {
            // 카드 값이 다르면 다시 뒤집기
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
          }

          this.flippedCards = []; // 뒤집힌 카드 배열 초기화
          this.isChecking = false; // 매칭 확인 완료
        }

        // 게임 완료 메시지 표시 메서드
        showCompletionMessage() {
          this.stopTimer(); // 타이머 중지
          const completionMessage =
            document.getElementById("completionMessage");
          completionMessage.classList.add("show"); // 완료 메시지 표시

          const startButton = document.getElementById("startButton");
          startButton.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,8L15,12H18A6,6 0 0,1 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20A8,8 0 0,0 20,12H23M6,12A6,6 0 0,1 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4A8,8 0 0,0 4,12H1L5,16L9,12"/>
                    </svg>
                    다시 플레이
                `;
          startButton.disabled = false; // 버튼 다시 활성화
        }

        // 딜레이 함수
        delay(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
      }

      // 다크모드 토글 기능
      function toggleDarkMode() {
        document.documentElement.classList.toggle("dark-mode"); // html 태그에 클래스 적용
        localStorage.setItem(
          "darkMode",
          document.documentElement.classList.contains("dark-mode")
        );
      }

      // 다크모드 상태 로드
      function loadDarkMode() {
        const isDarkMode = localStorage.getItem("darkMode") === "true";
        if (isDarkMode) {
          document.documentElement.classList.add("dark-mode"); // html 태그에 클래스 적용
        }
      }

      // DOMContentLoaded 이벤트 발생 시 게임 초기화 및 다크모드 로드
      document.addEventListener("DOMContentLoaded", () => {
        loadDarkMode();
        new MemoryGame();
      });

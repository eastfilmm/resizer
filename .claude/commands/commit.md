현재 git 변경사항을 분석하고 적절한 커밋 메시지를 생성하여 커밋해줘.

1. `git status`로 변경된 파일 확인
2. `git diff --staged`와 `git diff`로 변경 내용 분석
3. `git log --oneline -5`로 최근 커밋 메시지 스타일 확인
4. 변경 내용을 분석하여 conventional commit 형식의 한국어 커밋 메시지 작성
5. 관련 파일만 staging하고 커밋 실행

커밋 메시지 규칙:
- 타입: feat, fix, refactor, style, chore, docs, test
- 제목은 한국어로 간결하게
- 필요시 본문에 상세 설명 추가

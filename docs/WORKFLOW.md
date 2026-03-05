# 서브 에이전트 워크플로우 (Sub Agent Workflow)

이 문서는 새로운 기능 개발을 위한 4단계 서브 에이전트 워크플로우를 정의합니다.

## 개요

새로운 기능 개발 시 다음 4단계 서브 에이전트 워크플로우를 사용하세요. 각 단계는 명확한 역할과 책임을 가집니다.

---

## 📋 서브에이전트 1: Planning & Documentation

**역할**: 기능 계획 및 명세서 작성

**작업 내용**:
1. 기능 요구사항 분석
2. `docs/FeatureName.md` 파일 생성
3. 다음 구조로 문서 작성:
   - 개요
   - 기능 상세 (UI, 동작 방식)
   - 기술 상세 (구현 방식, 기술 스택)
   - 관련 파일 목록 (추가/수정할 파일 경로)
4. `@AGENTS.md`의 "새로운 효과 추가" 섹션 참조하여 누락된 파일 없이 계획

**출력물**: 완성된 `docs/FeatureName.md`

**사용 예시**:
```
서브에이전트 1로 "Border" 기능을 위한 docs/Border.md 파일을 만들어줘.
@AGENTS.md의 "Adding new effects" 섹션을 참조해서 필요한 파일들을 모두 포함해줘.
```

---

## 🔨 서브에이전트 2: Implementation

**역할**: 명세서 기반 기능 구현

**작업 내용**:
1. `docs/FeatureName.md` 파일을 참조하여 구현
2. **최신 아키텍처 패턴 준수**:
   - **State**: `imageAtoms.ts`의 `ImageSettings` 인터페이스에 속성을 추가하고 `focusAtom`을 생성하여 사용하세요.
   - **Canvas**: `src/utils/canvas/` 내 적절한 모듈(`effects.ts`, `frames.ts` 등)에 로직을 구현하세요.
   - **Components**: 모든 컴포넌트는 화살표 함수(`const Component = () => { ... }`)를 사용하세요.
3. **토큰 최적화**: 파일 디렉토리 구조 활용
   - `utils/canvas/` 디렉토리 내 필요한 파일만 선별적으로 읽기
   - 유사 기능의 기존 패턴 참조 (예: `ShadowPanel.tsx` → `NewEffectPanel.tsx`)
4. 기존 코드 패턴 준수 (styled-components, Jotai focusAtoms, hooks 등)

**최적화 가이드**:
- ✅ `imageSettingsAtom` 객체 전체를 구독하지 말고, `useAtom(derivedAtom)` 패턴을 사용하세요.
- ✅ 캔버스 엔진 수정 시 `src/utils/canvas/index.ts`에 Export를 잊지 마세요.
- ✅ 컴포넌트 로직이 복잡해지면 `src/hooks/`로 분리하세요.

**사용 예시**:
```
@docs/Border.md 를 기준으로 기능을 구현해줘. 
명세서에 있는 파일 디렉토리만 활용하고, 
유사한 기능(예: ShadowPanel)의 구조를 참조해서 최대한 토큰을 적게 사용해줘.
```

---

## ⚡ 서브에이전트 3: Quality Assurance & Testing

**역할**: 구현된 코드 검증 및 품질 개선

**작업 내용**:
1. **테스트 필수 수행**: 
   - `src/__tests__/utils/`에 신규 기능에 대한 단위 테스트를 추가하거나 기존 테스트를 업데이트하세요.
   - `pnpm test`를 실행하여 모든 테스트가 통과하는지 확인하세요.
2. 다음 항목 체크 및 최적화:
   - **성능**: 불필요한 리렌더링 방지 (Jotai Optics 활용 여부)
   - **코드 품질**: ESLint 규칙 준수, 타입 안정성 (`any` 사용 자제)
   - **브라우저 호환성**: Safari 최적화 (`SCALE_FACTOR` 적용 등)
3. `pnpm build`를 실행하여 Turbopack 빌드에 이상이 없는지 확인하세요.

**체크리스트**:
- [ ] `pnpm test` 모든 테스트 통과 (필수)
- [ ] `pnpm build` 성공
- [ ] ESLint 에러 없음
- [ ] Safari 최적화 패턴 적용 (`ImageCanvas.tsx` 내 분기)

**사용 예시**:
```
서브에이전트 2가 구현한 Border 기능의 코드를 최적화해줘.
ESLint 체크하고, Safari 최적화도 확인해줘.
```

---

## 📝 서브에이전트 4: Documentation & Summary

**역할**: 작업 결과 문서화

**작업 내용**:
1. 구현 완료된 기능을 `docs/FeatureName.md`에 반영
2. 다음 정보 업데이트:
   - 구현 완료 체크리스트
   - 실제 구현된 파일 목록 (계획과 다른 경우 수정)
   - 기술 구현 상세 (실제 사용된 기법, 최적화 내용)
   - 사용 예시 또는 주의사항
3. 필요시 `@AGENTS.md`의 "각 서브 에이전트 문서 개요" 섹션 업데이트

**문서 구조 업데이트**:
```markdown
## 구현 완료

- [x] 관련 atom 추가
- [x] Panel 컴포넌트 생성
- [x] Canvas 렌더링 로직 추가
- [x] Safari 최적화 적용

## 관련 파일

- `src/atoms/imageAtoms.ts` - borderEnabledAtom, borderWidthAtom
- `src/components/panels/BorderPanel.tsx` - UI 컴포넌트
- ...
```

**사용 예시**:
```
서브에이전트 1-3에서 완료한 Border 기능의 작업 내용을 
docs/Border.md에 정리하고 업데이트해줘.
```

---

## 워크플로우 전체 예시

```
1. 서브에이전트 1: "Border 기능을 위한 docs/Border.md 생성"
2. 서브에이전트 2: "@docs/Border.md 기준으로 구현"
3. 서브에이전트 3: "구현된 Border 코드 최적화"
4. 서브에이전트 4: "Border 기능 문서 최종 업데이트"
```

---

## 🎯 사용 방법

### 방법 1: 전체 워크플로우 한 번에 요청 (권장)

```
"Border" 기능을 추가해줘. @docs/WORKFLOW.md의 4단계 서브 에이전트 워크플로우를 따라서:
1. 서브에이전트 1: docs/Border.md 생성
2. 서브에이전트 2: 구현
3. 서브에이전트 3: 최적화
4. 서브에이전트 4: 문서 업데이트
순서대로 진행해줘.
```

또는 더 간단하게:

```
"Border" 기능을 추가해줘. @docs/WORKFLOW.md의 서브 에이전트 워크플로우를 따라 전체 4단계를 실행해줘.
```

### 방법 2: 단계별 수동 실행

각 단계를 개별적으로 요청:

```
1단계: 서브에이전트 1로 "Border" 기능을 위한 docs/Border.md 만들어줘
```

```
2단계: @docs/Border.md 기준으로 서브에이전트 2로 구현해줘
```

```
3단계: 서브에이전트 3로 최적화해줘
```

```
4단계: 서브에이전트 4로 문서 업데이트해줘
```

### 방법 3: 특정 단계만 실행

특정 단계만 필요할 때:

```
서브에이전트 2로 @docs/Border.md를 구현해줘
```

---

## ⚠️ 주의사항

1. **자동 실행 안 됨**: 문서를 읽어도 자동으로 워크플로우가 시작되지 않습니다.
2. **명시적 요청 필요**: "4단계 워크플로우 실행해줘" 또는 "서브에이전트 1로 시작해줘"처럼 명확히 요청해야 합니다.
3. **@docs/WORKFLOW.md 참조**: `@docs/WORKFLOW.md`를 명시하면 AI가 워크플로우를 참조합니다.
4. **단계별 확인**: 각 단계 완료 후 다음 단계로 넘어가도록 요청하거나, 한 번에 전체를 요청할 수 있습니다.

---

## 💡 권장 사용 패턴

**새 기능 추가 시**:
```
"FeatureName" 기능을 추가해줘. @docs/WORKFLOW.md의 서브 에이전트 워크플로우 4단계를 모두 실행해줘.
```

**기존 기능 수정 시**:
```
@docs/Shadow.md의 shadow offset 범위를 1-100px로 변경해줘
```

**최적화만 필요할 때**:
```
서브에이전트 3로 현재 코드를 최적화해줘
```

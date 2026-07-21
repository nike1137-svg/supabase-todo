# AIFFEL Campus Code Peer Review Template

- 코더 : risa02076-code
- 리뷰어 : 조경호 (nike1137-svg)

---

# PRT(Peer Review Template)

## [O] 1. 주어진 문제를 해결하는 완성된 코드가 제출되었나요?

- **완성도 판단**: 요구 기능(할 일 추가 / 목록 조회 / 키워드 검색)이 모두 정상 동작하며, Vercel에 배포되어 실제 접속이 가능함.
- **근거 1** — 배포 링크에서 실동작 확인: https://supabase-todo-woad-pi.vercel.app
- **근거 2** — 할 일 추가 로직 (`components/todos/todo-list.tsx` 43~60행)

```tsx
async function addTodo(e: FormEvent) {
  e.preventDefault();
  if (!newTask.trim()) return;

  const { data, error } = await supabase
    .from("todos")
    .insert({ task: newTask.trim() })
    .select()
    .single();

  if (error) {
    setError(error.message);
    return;
  }

  setTodos((current) => [data, ...current]); // 추가 직후 목록에 즉시 반영
  setNewTask("");
}
```

- **근거 3** — 검색 기능 (`components/todos/todo-list.tsx` 37~41행): 입력한 키워드로 실시간 필터링됨.

```tsx
const filteredTodos = useMemo(() => {
  const q = query.trim().toLowerCase();
  if (!q) return todos;
  return todos.filter((todo) => todo.task.toLowerCase().includes(q));
}, [todos, query]);
```

> 📸 라이브 리뷰 때: 배포 링크에서 "할 일 추가 → 검색" 동작 화면을 캡처해 이 아래에 첨부하세요.
> `![동작화면](./review_img.png)`

---

## [O] 2. 핵심적이거나 복잡한 부분에 설명(주석/마크다운)이 잘 작성되어 있나요?

- **확인 결과(레포 기준)**: 변수·함수 네이밍은 직관적이라 코드 자체는 읽기 쉬우나(`filteredTodos`, `addTodo` 등), **주석(comment)·docstring이 거의 없음**. README에도 기능 설명이 "개선 사항 한 줄"에 요약만 되어 있음(`README.md` 5행).
- **근거**: `components/todos/todo-list.tsx` 전체에 주석 1줄 정도. 검색을 `useMemo`로 처리한 이유, RLS로 사용자별 격리가 어떻게 보장되는지에 대한 설명이 코드/문서에 없음.
- **판단 가이드**: 라이브에서 코더가 "왜 이렇게 짰는지" 구두로 잘 설명하면 `[O]`, 코드/문서만으로 이해가 어려웠다면 `[X]`로 표기하세요.
- **개선 제안**: 검색 필터·RLS 동작 방식에 대한 짧은 주석 또는 README 설명 추가 권장.

---

## [O] 3. 에러가 난 부분을 디버깅하여 "문제를 해결한 기록"을 남겼나요? (또는 새로운 시도/실험 기록)

- **확인 결과(레포 기준)**: README에 에러/디버깅 과정이나 추가 실험 기록이 없음(`README.md`는 제출 정보 3줄 + 스타터킷 기본 문서).
- **참고**: 코드 안에 사용자에게 오류를 보여주는 에러 처리 자체는 존재함 — `error` state로 실패 메시지 노출 (`todo-list.tsx` 30, 53, 79행).
- **판단 가이드**: 라이브에서 코더가 "이 부분에서 막혔고 이렇게 해결했다"는 과정을 설명하면 `[O]`, 없으면 `[X]`.

---

## [x] 4. 회고를 잘 작성했나요?

- **확인 결과(레포 기준)**: README에 회고(배운 점 / 아쉬운 점 / 느낀 점 / 어려웠던 점) 섹션이 없음.
- **판단 가이드**: 별도 회고 문서가 있거나 라이브에서 상세히 공유하면 `[O]`, 없으면 `[X]`.
- **개선 제안**: README 하단에 회고 섹션 추가 권장.

---

## [O] 5. 코드가 간결하고 효율적인가요?

- **모듈화**: 화면(`app/protected/todos/page.tsx`)과 로직(`components/todos/todo-list.tsx`)을 컴포넌트로 분리해 관심사가 잘 나뉘어 있음.
- **효율성**: 검색 필터를 매 렌더마다 재계산하지 않도록 `useMemo`로 최적화 (`todo-list.tsx` 37행).
- **일관성**: Supabase 클라이언트 생성을 `lib/supabase/`로 분리해 재사용 (`client.ts`, `server.ts`).

```tsx
// components/todos/todo-list.tsx 37행 - 불필요한 재연산 방지
const filteredTodos = useMemo(() => { ... }, [todos, query]);
```

---

# 참고 링크 및 코드 개선

```
# 리뷰하며 생각한 개선 아이디어 (참고용, 코더가 반드시 반영할 필요는 없음)

1. 검색 방식
   - 현재는 이미 불러온 목록을 클라이언트에서 필터링(useMemo).
   - 데이터가 많아지면 Supabase의 .ilike("task", `%${q}%`) 로 서버 검색 전환 고려.

2. 문서화
   - todo-list.tsx 핵심 로직(검색/RLS)에 짧은 주석 추가.
   - README에 회고 + 에러 해결 기록 섹션 추가.

3. RLS 검증
   - insert 시 user_id를 명시하지 않고 있어, 사용자별 격리는 전적으로
     Supabase RLS 정책에 의존함. RLS 정책 SQL을 README에 첨부하면 검증이 쉬움.
```

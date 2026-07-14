# JLT Integrated Dashboard

여러 HTML 대시보드를 하나의 정적 프로젝트로 통합한 버전입니다.

## Structure

```text
integrated-dashboard-project/
  index.html
  css/
    style.css
  js/
    app.js
  assets/
    *.png
    *.jpg
```

## Page Routes

- `#command`: 통합 관제
- `#mes`: MES 생산 관리
- `#quality`: 품질 관리
- `#wms`: WMS 물류 관제
- `#robot`: 로봇 관제

## Migration Notes

- `index.html`의 `.app-shell`, `.app-sidebar`, `.app-header`는 공통 레이아웃입니다.
- `js/app.js`의 `routes` 배열은 이후 React Router 또는 Next.js route config로 옮기기 쉽도록 구성했습니다.
- 각 기존 HTML 화면은 `.legacy-page[data-page="..."]` 단위로 분리되어 있어 React/Next 이전 시 페이지 컴포넌트로 나누기 쉽습니다.
- 기존 스타일은 `css/style.css` 안에서 페이지별 스코프를 적용해 충돌을 줄였습니다.

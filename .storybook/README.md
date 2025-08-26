# Storybook Configuration

Thư mục này chứa cấu hình Storybook cho dự án HOCMAI EMS Admin.

## Cấu trúc

- `main.ts` - Cấu hình chính của Storybook
- `preview.ts` - Cấu hình preview và global styles
- `README.md` - Hướng dẫn sử dụng

## Cách sử dụng

### Chạy Storybook

```bash
npm run storybook
```

Storybook sẽ chạy tại `http://localhost:6006`

### Build Storybook

```bash
npm run build-storybook
```

### Tạo Story mới

Để tạo story cho component mới, tạo file `ComponentName.stories.tsx` trong thư mục component:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Định nghĩa các props có thể control
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Props mặc định
  },
};
```

## Các tính năng đã cấu hình

- **TypeScript support** - Hỗ trợ đầy đủ TypeScript
- **Next.js integration** - Tích hợp với Next.js framework
- **Tailwind CSS** - Import global styles từ `src/app/globals.css`
- **Responsive viewports** - Hỗ trợ mobile, tablet, desktop
- **Background controls** - Thay đổi background cho component
- **Auto-documentation** - Tự động tạo documentation từ code

## Best Practices

1. **Đặt tên story rõ ràng** - Sử dụng tên mô tả chức năng
2. **Sử dụng tags** - Thêm `['autodocs']` để tự động tạo docs
3. **Tổ chức theo nhóm** - Sử dụng `title: 'Components/ComponentName'`
4. **Responsive design** - Test component ở các viewport khác nhau
5. **Interactive controls** - Sử dụng `argTypes` để tạo controls

## Troubleshooting

### Lỗi import path

Nếu gặp lỗi import `@/*`, đảm bảo đã cấu hình đúng trong `tsconfig.json`

### Lỗi CSS

Đảm bảo file `src/app/globals.css` tồn tại và được import trong `preview.ts`

### Lỗi TypeScript

Kiểm tra `tsconfig.json` và đảm bảo các type definitions đã được cài đặt

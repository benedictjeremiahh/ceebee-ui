import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider, Form, Input } from 'antd';
import { describe, expect, it } from 'vitest';
import { ThemeBridge } from './theme-bridge.js';

function InvalidForm({ formProps }: { formProps?: { scrollToFirstError?: boolean | { focus?: boolean } } }) {
  return (
    <ThemeBridge mode="light">
      <Form {...formProps}>
        <Form.Item name="name" rules={[{ required: true }]}>
          <Input aria-label="Name" />
        </Form.Item>
        <button type="submit">Save</button>
      </Form>
    </ThemeBridge>
  );
}

describe('ThemeBridge form defaults', () => {
  it('focuses the first invalid field after a failed submit', async () => {
    render(<InvalidForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());
  });

  it('preserves a Form-level opt-out', async () => {
    render(<InvalidForm formProps={{ scrollToFirstError: false }} />);
    const save = screen.getByRole('button', { name: 'Save' });

    fireEvent.click(save);

    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true'));
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveFocus();
    expect(save).not.toHaveFocus();
  });

  it('preserves explicit inherited ConfigProvider form settings', async () => {
    const { container } = render(
      <ConfigProvider form={{ scrollToFirstError: false, requiredMark: false }}>
        <ThemeBridge mode="light">
          <Form>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
            <button type="submit">Save</button>
          </Form>
        </ThemeBridge>
      </ConfigProvider>,
    );

    expect(container.querySelector('.ant-form-item-required-mark-hidden')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    const name = screen.getByRole('textbox', { name: 'Name' });
    await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'true'));
    expect(name).not.toHaveFocus();
  });

});

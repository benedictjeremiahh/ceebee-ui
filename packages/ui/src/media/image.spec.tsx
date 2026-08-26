import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Image } from "./image.js";

const ITEMS = [
  {
    id: "one",
    src: "/one.jpg",
    previewSrc: "/one-large.jpg",
    alt: "First view",
    aspectRatio: 4 / 3,
  },
  {
    id: "two",
    src: "/two.jpg",
    alt: "Second view",
    aspectRatio: 4 / 3,
    caption: "Another angle",
  },
];

const imageCss = readFileSync(
  join(process.cwd(), "packages/ui/src/media/image.css"),
  "utf8"
);

describe("Image", () => {
  it("keeps the base image non-interactive", () => {
    render(<Image src="/photo.jpg" alt="A quiet lake" aspectRatio={4 / 3} />);

    expect(
      screen.getByRole("img", { name: "A quiet lake" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens a dialog from the selected thumbnail and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Image.PreviewGroup items={ITEMS} label="Project photos" motion={false} />
    );
    const secondTrigger = screen.getByRole("button", {
      name: "Preview Second view",
    });

    await user.click(secondTrigger);

    const dialog = await screen.findByRole("dialog", { name: "Image 2 of 2" });
    expect(dialog).toHaveAttribute("data-motion", "off");
    expect(screen.getByRole("img", { name: "Second view" })).toHaveAttribute(
      "src",
      "/two.jpg"
    );

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(secondTrigger).toHaveFocus();
  });

  it("navigates the group with buttons and keyboard while reporting controlled changes", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(
      <Image.PreviewGroup
        items={ITEMS}
        label="Project photos"
        defaultOpen
        onIndexChange={onIndexChange}
      />
    );

    expect(
      screen.getByRole("button", { name: "Previous image" })
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(
      screen.getByRole("dialog", { name: "Image 2 of 2" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Second view" })
    ).toBeInTheDocument();
    expect(onIndexChange).toHaveBeenLastCalledWith(1);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Home" });
    expect(
      screen.getByRole("dialog", { name: "Image 1 of 2" })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "First view" })).toHaveAttribute(
      "src",
      "/one-large.jpg"
    );
  });

  it("reports controlled open and index changes without mutating controlled state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onIndexChange = vi.fn();
    const { rerender } = render(
      <Image.PreviewGroup
        items={ITEMS}
        label="Project photos"
        open={false}
        index={0}
        onOpenChange={onOpenChange}
        onIndexChange={onIndexChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Preview Second view" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Image.PreviewGroup
        items={ITEMS}
        label="Project photos"
        open
        index={0}
        onOpenChange={onOpenChange}
        onIndexChange={onIndexChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole("dialog", { name: "Image 1 of 2" })).toBeInTheDocument();
  });

  it("wraps group navigation, localizes labels, and resets zoom on navigation", async () => {
    const user = userEvent.setup();
    render(
      <Image.PreviewGroup
        items={ITEMS}
        label="Project photos"
        defaultOpen
        loop
        labels={{
          close: "Tutup pratinjau",
          position: (current, total) => `Foto ${current} dari ${total}`,
        }}
      />
    );

    expect(screen.getByRole("button", { name: "Tutup pratinjau" })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowLeft" });
    const secondPreview = screen.getByRole("img", { name: "Second view" });
    expect(screen.getByRole("dialog", { name: "Foto 2 dari 2" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(secondPreview.style.getPropertyValue("--cb-image-preview-scale")).toBe("1.5");
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByRole("img", { name: "First view" }).style.getPropertyValue("--cb-image-preview-scale")).toBe("1");
  });

  it("supports bounded button, keyboard, and double-click zoom gestures", async () => {
    const user = userEvent.setup();
    render(
      <Image.PreviewGroup
        items={ITEMS.slice(0, 1)}
        label="Project photo"
        defaultOpen
      />
    );
    const preview = screen.getByRole("img", { name: "First view" });

    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(preview.style.getPropertyValue("--cb-image-preview-scale")).toBe(
      "1.5"
    );

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "0" });
    expect(preview.style.getPropertyValue("--cb-image-preview-scale")).toBe(
      "1"
    );

    fireEvent.doubleClick(preview);
    expect(preview.style.getPropertyValue("--cb-image-preview-scale")).toBe(
      "2"
    );
    expect(screen.getByRole("button", { name: "Reset zoom" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(preview.style.getPropertyValue("--cb-image-preview-scale")).toBe("3");
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
  });

  it("gives the skeleton the image geometry and hides it from assistive technology", () => {
    const { container } = render(
      <Image.Skeleton aspectRatio={16 / 9} radius="lg" />
    );
    const skeleton = container.querySelector(".cb-image--skeleton");

    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("cb-radius--lg");
    expect(skeleton).toHaveStyle({ aspectRatio: String(16 / 9) });
  });

  it("matches PreviewGroup thumbnail geometry with its compound skeleton", () => {
    const { container } = render(
      <Image.PreviewGroup.Skeleton items={2} aspectRatio={4 / 3} radius="none" />
    );

    expect(container.firstElementChild).toHaveClass(
      "cb-image-preview-group",
      "cb-image-preview-group--skeleton"
    );
    expect(container.querySelectorAll(".cb-image--skeleton")).toHaveLength(2);
    expect(container.querySelectorAll(".cb-radius--none")).toHaveLength(2);
  });

  it("drops preview transforms but preserves opacity feedback under reduced motion", () => {
    const reducedMotionRules = imageCss.slice(
      imageCss.indexOf("@media (prefers-reduced-motion: reduce)")
    );

    expect(reducedMotionRules).toContain(".cb-image-preview__image");
    expect(reducedMotionRules).toContain("transition: none");
    expect(reducedMotionRules).toContain(
      "transition: opacity var(--cb-duration-fast) var(--cb-ease-standard)"
    );
    expect(reducedMotionRules).toContain("transform: none");
  });
});

import { expect, test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
] as const;

test('compact docs navigation starts closed and returns to content after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/data-entry/slider');
  await page.evaluate(() => window.localStorage.removeItem('docs-nav'));
  await page.reload();

  const sidebar = page.locator('.docs__sidebar');
  const mainHeading = page.getByRole('heading', { level: 1, name: /Slider/ });
  await expect(sidebar).toBeHidden();
  await expect(mainHeading).toBeInViewport();

  const openNavigation = page.getByRole('button', { name: 'Show navigation' });
  const openBox = await openNavigation.boundingBox();
  expect(openBox?.width).toBeGreaterThanOrEqual(44);
  expect(openBox?.height).toBeGreaterThanOrEqual(44);
  await openNavigation.click();
  await expect(sidebar).toBeVisible();
  await sidebar.getByRole('link', { name: /DatePicker/ }).click();

  await expect(page).toHaveURL(/\/data-entry\/date-picker$/);
  await expect(sidebar).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: /DatePicker/ })).toBeInViewport();
});

test('desktop docs navigation keeps an icon rail and preserves its flyout pointer corridor', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1000 });
  await page.goto('/data-entry/slider');
  await page.evaluate(() => window.localStorage.removeItem('docs-nav'));
  await page.reload();

  const sidebar = page.locator('.docs__sidebar');
  const expandedWidth = (await sidebar.boundingBox())!.width;
  await page.getByRole('button', { name: 'Collapse navigation' }).click();
  await page.waitForTimeout(70);
  const intermediateWidth = (await sidebar.boundingBox())!.width;
  await expect(sidebar).toBeVisible();
  await expect(page.getByRole('button', { name: 'Expand navigation' })).toBeVisible();
  await expect.poll(async () => (await sidebar.boundingBox())!.width).toBeLessThan(intermediateWidth);
  expect(intermediateWidth).toBeLessThan(expandedWidth);
  expect(intermediateWidth).toBeGreaterThan((await sidebar.boundingBox())!.width);

  // Data Entry mirrors the catalog section and is complete, so it is the stable group to drive the
  // rail's flyout through.
  const groupTrigger = page.getByRole('button', { name: 'Data Entry components' });
  await groupTrigger.click();
  const flyout = page.getByRole('navigation', { name: 'Data Entry components' });
  await expect(flyout).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(flyout).toBeHidden();
  await expect(groupTrigger).toBeFocused();

  await page.mouse.move(800, 500);
  await groupTrigger.hover();
  await expect(flyout).toBeVisible();

  const [triggerBox, flyoutBox] = await Promise.all([groupTrigger.boundingBox(), flyout.boundingBox()]);
  expect(triggerBox).not.toBeNull();
  expect(flyoutBox).not.toBeNull();
  await page.mouse.move(triggerBox!.x + triggerBox!.width, triggerBox!.y + triggerBox!.height / 2);
  await page.mouse.move(flyoutBox!.x, flyoutBox!.y + flyoutBox!.height / 2, { steps: 4 });
  await page.waitForTimeout(300);
  await expect(flyout).toBeVisible();

  await flyout.getByRole('link', { name: /Upload/ }).click();
  await expect(page).toHaveURL(/\/data-entry\/upload$/);
  await expect(sidebar).toBeVisible();
});

test('wide docs pages use the right rail for an on-page outline', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1000 });
  await page.goto('/data-entry/slider');

  const toc = page.locator('.docs__toc');
  const content = page.locator('.docs__content');
  await expect(toc).toBeVisible();
  const [tocBox, contentBox] = await Promise.all([toc.boundingBox(), content.boundingBox()]);
  expect(tocBox!.x).toBeGreaterThanOrEqual(contentBox!.x + contentBox!.width);
  await expect(toc.locator('a').first()).toBeVisible();
});

test('docs chrome keeps opaque sticky regions separated at deep scroll positions', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1000 });
  await page.goto('/data-display/table');

  const sidebar = page.locator('.docs__sidebar');
  const brand = page.locator('.docs__brand');
  const toolbar = page.locator('.docs__toolbar');
  const toc = page.getByRole('complementary', { name: 'On this page' });

  await page.evaluate(() => window.scrollTo(0, 2400));
  await sidebar.evaluate((element) => { element.scrollTop = 900; });

  const [sidebarBox, brandBox, toolbarBox, tocBox] = await Promise.all([
    sidebar.boundingBox(),
    brand.boundingBox(),
    toolbar.boundingBox(),
    toc.boundingBox(),
  ]);
  expect(Math.abs(brandBox!.y - sidebarBox!.y)).toBeLessThanOrEqual(1);
  // The brand sticks inside the sidebar's scroll container, so it spans the content box: the
  // sidebar's own width less the scrollbar gutter.
  const sidebarContentWidth = await sidebar.evaluate((element) => element.clientWidth);
  expect(Math.abs(brandBox!.width - sidebarContentWidth)).toBeLessThanOrEqual(1);
  expect(await brand.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  expect(toolbarBox!.y).toBe(0);
  expect(toolbarBox!.x).toBe(sidebarBox!.width);
  expect(toolbarBox!.x + toolbarBox!.width).toBe(1680);
  expect(await toolbar.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  expect(tocBox!.y - (toolbarBox!.y + toolbarBox!.height)).toBeGreaterThanOrEqual(12);
});

test('demo source panes show the vendored file, not a pointer at it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  // These demos are copied into this repository rather than imported from `antd`, so the source
  // pane has to show the vendored file itself — import seam included — not a caption naming it.
  const cards = [
    { path: '/navigation/dropdown', title: 'Basic', contains: ['import { Dropdown, Space }', 'const App: React.FC'] },
    { path: '/data-entry/checkbox', title: 'Basic', contains: ['import { Checkbox }', 'const onChange'] },
    { path: '/layout/divider', title: 'Vertical', contains: ['import { Divider }'] },
    { path: '/form/button', title: 'Syntactic sugar', contains: ['import { Button', 'const App'] },
  ] as const;

  for (const card of cards) {
    await page.goto(card.path);
    const demo = page.getByRole('heading', { level: 3, name: card.title, exact: true })
      .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
    await demo.getByRole('button', { name: 'Show source code' }).click();
    const source = demo.locator('.code');
    await expect(source).toBeVisible();
    const text = await source.innerText();
    for (const fragment of card.contains) {
      expect(text, `${card.path} shows ${fragment}`).toContain(fragment);
    }
    expect(text, `${card.path} imports through the Ceebee entry`).toContain('@ceebee/ui/client');
    expect(text, `${card.path} is no longer a source-code caption`).not.toContain('Live demo uses the pinned source');
  }
});

test('docs pages mount the App wrapper so its reset reaches bare demo anchors', async ({ page }) => {
  // This walks every documented component route in the library, which is most of the docs.
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 1000 });

  // The runtime scopes its link reset to the theme hash carried by <App>. A demo route without that wrapper
  // silently drops the link colour and pointer cursor on any anchor the demo writes itself — the
  // Dropdown trigger being the most visible one.
  const routes = [
    '/form/button', '/form/float-button', '/general/icon', '/foundation/text',
    '/layout/divider', '/layout/flex', '/layout/grid', '/layout/layout',
    '/layout/masonry', '/layout/space', '/layout/splitter',
    '/navigation/anchor', '/navigation/breadcrumb', '/navigation/dropdown',
    '/navigation/menu', '/navigation/pagination', '/navigation/steps', '/navigation/tabs',
    '/data-entry/auto-complete', '/data-entry/cascader', '/data-entry/checkbox',
    '/data-entry/color-picker', '/data-entry/date-picker', '/data-entry/form',
    '/data-entry/input', '/data-entry/input-number', '/data-entry/mentions',
    '/data-entry/radio', '/data-entry/rate', '/data-entry/select', '/data-entry/slider',
    '/data-entry/switch', '/data-entry/time-picker', '/data-entry/transfer',
    '/data-entry/tree-select', '/data-entry/upload',
    '/data-display/avatar', '/data-display/badge', '/data-display/calendar', '/data-display/card',
    '/data-display/carousel', '/data-display/collapse', '/data-display/descriptions', '/data-display/empty',
    '/data-display/image', '/data-display/list', '/data-display/listy', '/data-display/popover',
    '/data-display/qr-code', '/data-display/segmented', '/data-display/statistic', '/data-display/table',
    '/data-display/tag', '/data-display/timeline', '/data-display/tooltip', '/data-display/tour', '/data-display/tree',
    '/feedback/alert', '/feedback/drawer', '/feedback/message', '/feedback/modal',
    '/feedback/notification', '/feedback/popconfirm', '/feedback/progress',
    '/feedback/result', '/feedback/skeleton', '/feedback/spin', '/feedback/watermark',
    '/other/affix', '/other/app', '/other/border-beam', '/other/config-provider',
    '/internal/demo/anchor/basic',
  ];

  for (const route of routes) {
    await page.goto(route);
    // Key off the docs wrapper rather than `.ant-app`: the App page's own demos each mount an App,
    // which is the thing they are demonstrating.
    await expect(page.locator('.docs__app-frame'), `${route} mounts the runtime's App wrapper exactly once`).toHaveCount(1);
    const unreset = await page.locator('.demo__stage a, .ant-app a').evaluateAll((anchors) => anchors
      .filter((anchor) => !['pointer', 'not-allowed'].includes(getComputedStyle(anchor).cursor))
      .map((anchor) => anchor.textContent?.trim().slice(0, 40) ?? ''));
    expect(unreset, `${route} keeps the runtime cursor on every demo anchor`).toEqual([]);
  }
});

test('General docs run every official demo through the Ceebee theme bridge', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.goto('/form/button');
  await expect(page.locator('.docs__general-examples .docs__demo')).toHaveCount(15);
  await expect(page.locator('.docs__general-examples .ant-btn').first()).toBeVisible();
  const tocLabels = await page.locator('.docs__toc-anchor a').evaluateAll((links) => links.slice(0, 7).map((link) => link.textContent?.trim()));
  expect(tocLabels).toEqual([
    'When to use',
    'Examples',
    'Syntactic sugar',
    'Color & Variant',
    'Icon',
    'Icon Placement',
    'Size',
  ]);
  const primary = page.locator('.ant-btn-primary').first();
  const defaultSkinColor = await primary.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Default skin' }).click();
  await expect(page.getByRole('button', { name: 'Astra skin' })).toBeVisible();
  await expect.poll(() => primary.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(defaultSkinColor);

  await page.goto('/form/float-button');
  await expect(page.locator('.docs__general-examples .docs__demo')).toHaveCount(14);
  // Upstream renders every public FloatButton demo in an iframe, because each one anchors to the viewport.
  const floatFrames = page.locator('.docs__general-examples .demo__browser-viewport');
  await expect(floatFrames).toHaveCount(14);
  expect((await floatFrames.first().boundingBox())!.height).toBe(360);

  await page.goto('/foundation/text');
  await expect(page.locator('.docs__general-examples .docs__demo')).toHaveCount(10);
  await expect(page.locator('.docs__general-examples .ant-typography').first()).toBeVisible();
  const [typographyRootBox, typographyCardBox] = await Promise.all([
    page.locator('.docs__general-examples').boundingBox(),
    page.locator('.docs__general-examples .docs__demo').first().boundingBox(),
  ]);
  expect(Math.abs(typographyRootBox!.width - typographyCardBox!.width)).toBeLessThanOrEqual(1);

  await page.goto('/general/icon');
  await expect(page.locator('.docs__general-examples .docs__demo')).toHaveCount(5);
  await expect(page.locator('.docs__general-examples .anticon')).toHaveCount(21);
  const [iconRootBox, iconCardBox] = await Promise.all([
    page.locator('.docs__general-examples').boundingBox(),
    page.locator('.docs__general-examples .docs__demo').first().boundingBox(),
  ]);
  expect(Math.abs(iconRootBox!.width - iconCardBox!.width)).toBeLessThanOrEqual(1);
});

test('Layout docs match the documented per-component card geometry and coverage', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.goto('/layout/divider');
  const dividerRoot = page.locator('.docs__layout-divider');
  await expect(dividerRoot.locator('.docs__demo')).toHaveCount(7);
  const [dividerRootBox, dividerCardBox] = await Promise.all([
    dividerRoot.boundingBox(),
    dividerRoot.locator('.docs__demo').first().boundingBox(),
  ]);
  expect(dividerCardBox!.width).toBeLessThan(dividerRootBox!.width * 0.55);
  await expect(page.locator('.docs__api-reference tbody tr')).toHaveCount(12);

  const fullWidthPages = [
    { path: '/layout/flex', component: 'flex', cards: 5, selector: '.ant-flex', api: 8 },
    { path: '/layout/grid', component: 'grid', cards: 13, selector: '.ant-row', api: 17 },
    { path: '/layout/layout', component: 'layout', cards: 10, selector: '.ant-layout', api: 15 },
    { path: '/layout/masonry', component: 'masonry', cards: 5, selector: '.ant-masonry', api: 13 },
    { path: '/layout/space', component: 'space', cards: 10, selector: '.ant-space', api: 16 },
    { path: '/layout/splitter', component: 'splitter', cards: 11, selector: '.ant-splitter', api: 22 },
  ];

  for (const entry of fullWidthPages) {
    await page.goto(entry.path);
    const root = page.locator(`.docs__layout-${entry.component}`);
    await expect(root.locator('.docs__demo')).toHaveCount(entry.cards);
    await expect(root.locator(entry.selector).first()).toBeVisible();
    const [rootBox, cardBox] = await Promise.all([root.boundingBox(), root.locator('.docs__demo').first().boundingBox()]);
    expect(Math.abs(rootBox!.width - cardBox!.width), `${entry.component} uses the full-width card flow`).toBeLessThanOrEqual(1);
    await expect(page.locator('.docs__api-reference tbody tr')).toHaveCount(entry.api);
  }

  await page.goto('/layout/grid');
  const basicGridColumn = page.locator('.docs__layout-grid .docs__demo').first().locator('.ant-col').first();
  await expect(basicGridColumn).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect((await basicGridColumn.boundingBox())!.height).toBeGreaterThan(40);

  await page.goto('/layout/layout');
  // Upstream renders Layout's Sider, Fixed Header and Fixed Sider demos in an iframe, and puts six more
  // on its grey stage so a white Layout has a readable edge.
  await expect(page.locator('.docs__layout-layout .demo__browser-viewport')).toHaveCount(3);
  await expect(page.locator('.docs__layout-layout .demo__stage[data-background="grey"]')).toHaveCount(6);
  await expect(page.locator('.docs__layout-layout .demo__stage[data-compact]')).toHaveCount(6);
  await page.goto('/layout/flex');
  const themedAction = page.locator('.docs__layout-flex .ant-btn-primary').first();
  const defaultSkinColor = await themedAction.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Default skin' }).click();
  await expect(page.getByRole('button', { name: 'Astra skin' })).toBeVisible();
  await expect.poll(() => themedAction.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(defaultSkinColor);
});

/** Rough perceived lightness of a computed colour, for asserting that a surface is dark or light. */
function luminance(color: string): number {
  const [red = 0, green = 0, blue = 0] = color.match(/[\d.]+/g)?.map(Number) ?? [];
  if (color.startsWith('lab')) return red / 100;
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}

/** Contrast between two computed colours, for asserting that one reads against the other. */
function contrast(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The runtime derives the Slider's filled track, handle, and active dot from one palette step off
 * the primary seed. That step lands close to white for a seed as light as Ceebee's brand, which
 * leaves a filled track indistinguishable from its rail — the control reads as disabled. The bridge
 * overrides those tokens from Ceebee's own ramp, and this holds that override in place.
 */
for (const mode of ['light', 'dark'] as const) {
  test(`Slider's filled track separates from its rail in ${mode}`, async ({ page }) => {
    await page.addInitScript((choice) => window.localStorage.setItem('cb-theme', choice), mode);
    await page.goto('/data-entry/slider');
    await page.evaluate((choice) => document.documentElement.setAttribute('data-theme', choice), mode);

    const slider = page.locator('.ant-slider').first();
    await expect(slider).toBeVisible();

    const read = (selector: string) =>
      slider.locator(selector).first().evaluate((element) => getComputedStyle(element).backgroundColor);
    await expect.poll(async () => contrast(await read('.ant-slider-track'), await read('.ant-slider-rail')))
      .toBeGreaterThan(1.35);
  });
}

/**
 * A ghost button is transparent with inverted content, so it is invisible on a light stage. Upstream
 * gives those demos a fixed mid-tone backdrop through `site-button-ghost-wrapper`; the demos were
 * vendored but that rule was not, and the buttons vanished until hover.
 */
test('ghost button demos sit on a backdrop their content reads against', async ({ page }) => {
  await page.goto('/form/button');

  const wrappers = page.locator('.demo__stage .site-button-ghost-wrapper');
  await expect(wrappers.first()).toBeVisible();
  expect(await wrappers.count()).toBeGreaterThanOrEqual(2);

  const backdrop = await wrappers.first().evaluate((element) => getComputedStyle(element).backgroundColor);
  const stage = await wrappers.first().evaluate((element) =>
    getComputedStyle(element.closest('.demo__stage')!).backgroundColor);

  // The regression is the missing rule, which leaves the wrapper transparent against its stage.
  // How much contrast any single ghost button then has is the runtime's own styling — the Disabled
  // demo uses this same wrapper and its buttons are deliberately faint.
  expect(backdrop).not.toBe(stage);
  expect(luminance(backdrop)).toBeGreaterThan(0.25);
  expect(luminance(backdrop)).toBeLessThan(0.9);
  expect(luminance(backdrop)).toBeLessThan(luminance(stage));
});

/**
 * Upstream marks a demo `iframe` when it measures the viewport. Marking one that is not sends the
 * card at an isolated route that was never generated, and it renders an empty frame. Button has no
 * such demo; FloatButton's are all of them.
 */
test('demos render inline unless upstream isolates them', async ({ page }) => {
  await page.goto('/form/button');
  const buttonCards = page.locator('.docs__general-examples .docs__demo');
  await expect(buttonCards.first()).toBeVisible();
  expect(await buttonCards.count()).toBe(15);
  expect(await buttonCards.locator('iframe').count()).toBe(0);
  for (let index = 0; index < 15; index += 1) {
    await expect(buttonCards.nth(index).locator('.demo__stage .ant-btn').first()).toBeVisible();
  }

  await page.goto('/form/float-button');
  const floatCards = page.locator('.docs__general-float-button .docs__demo');
  await expect(floatCards.first()).toBeVisible();
  expect(await floatCards.locator('iframe').count()).toBe(14);
});

test('Other docs match the documented card geometry, coverage, and primary interactions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  const pages = [
    { path: '/other/affix', component: 'affix', cards: 3, api: 4, flow: 'columns' },
    { path: '/other/app', component: 'app', cards: 2, api: 3, flow: 'columns' },
    { path: '/other/border-beam', component: 'border-beam', cards: 8, api: 7, flow: 'columns' },
    { path: '/other/config-provider', component: 'config-provider', cards: 6, api: 23, flow: 'full' },
  ] as const;

  for (const entry of pages) {
    await page.goto(entry.path);
    const root = page.locator(`.docs__other-${entry.component}`);
    await expect(root.locator('.docs__demo')).toHaveCount(entry.cards);
    await expect(page.locator('.docs__api-reference tbody tr')).toHaveCount(entry.api);
    const [rootBox, cardBox] = await Promise.all([root.boundingBox(), root.locator('.docs__demo').first().boundingBox()]);
    if (entry.flow === 'full') {
      expect(Math.abs(rootBox!.width - cardBox!.width), `${entry.component} uses the full-width card flow`).toBeLessThanOrEqual(1);
    } else {
      expect(cardBox!.width, `${entry.component} uses the two-column waterfall`).toBeLessThan(rootBox!.width * 0.55);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  // There are no demos for Util, so its page is prose and API only and carries no cards.
  await page.goto('/other/util');
  await expect(page.getByRole('heading', { level: 1, name: /Util/ })).toBeVisible();
  await expect(page.locator('.docs__demo')).toHaveCount(0);

  await page.goto('/other/border-beam');
  await expect(page.locator('.ant-border-beam').first()).toBeVisible();

  await page.goto('/other/affix');
  const affixCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await expect(affixCard.locator('.ant-affix, .ant-btn').first()).toBeVisible();
});

test('Feedback docs match the documented card geometry, coverage, and primary interactions', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 1000 });

  const pages = [
    { path: '/feedback/alert', component: 'alert', cards: 13, api: 27, flow: 'columns' },
    { path: '/feedback/drawer', component: 'drawer', cards: 13, api: 40, flow: 'columns' },
    { path: '/feedback/message', component: 'message', cards: 9, api: 14, flow: 'columns' },
    { path: '/feedback/modal', component: 'modal', cards: 17, api: 38, flow: 'columns' },
    { path: '/feedback/notification', component: 'notification', cards: 12, api: 43, flow: 'columns' },
    { path: '/feedback/popconfirm', component: 'popconfirm', cards: 9, api: 13, flow: 'columns' },
    { path: '/feedback/progress', component: 'progress', cards: 16, api: 25, flow: 'columns' },
    { path: '/feedback/result', component: 'result', cards: 9, api: 7, flow: 'full' },
    { path: '/feedback/skeleton', component: 'skeleton', cards: 7, api: 18, flow: 'full' },
    { path: '/feedback/spin', component: 'spin', cards: 9, api: 11, flow: 'columns' },
    { path: '/feedback/watermark', component: 'watermark', cards: 5, api: 19, flow: 'full' },
  ] as const;

  for (const entry of pages) {
    await page.goto(entry.path);
    const root = page.locator(`.docs__feedback-${entry.component}`);
    await expect(root.locator('.docs__demo')).toHaveCount(entry.cards);
    await expect(page.locator('.docs__api-reference tbody tr')).toHaveCount(entry.api);
    const [rootBox, cardBox] = await Promise.all([root.boundingBox(), root.locator('.docs__demo').first().boundingBox()]);
    if (entry.flow === 'full') {
      expect(Math.abs(rootBox!.width - cardBox!.width), `${entry.component} uses the full-width card flow`).toBeLessThanOrEqual(1);
    } else {
      expect(cardBox!.width, `${entry.component} uses the two-column waterfall`).toBeLessThan(rootBox!.width * 0.55);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  await page.goto('/feedback/modal');
  const basicModalCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await basicModalCard.getByRole('button', { name: 'Open Modal' }).click();
  const modal = page.locator('.ant-modal-wrap:visible .ant-modal');
  await expect(modal).toBeVisible();
  await page.locator('.ant-modal-wrap:visible .ant-modal-close').click();
  await expect(modal).toBeHidden();

  await page.goto('/feedback/drawer');
  const basicDrawerCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await basicDrawerCard.getByRole('button', { name: 'Open' }).first().click();
  // The runtime names the drawer's panel .ant-drawer-section rather than .ant-drawer-content.
  await expect(page.locator('.ant-drawer-open .ant-drawer-section').first()).toBeVisible();

  await page.goto('/feedback/alert');
  // Upstream marks Alert's banner demo and Popconfirm's shift demo iframe; both measure the viewport.
  await expect(page.locator('.docs__feedback-alert .demo__browser-viewport')).toHaveCount(1);
  await page.goto('/feedback/popconfirm');
  await expect(page.locator('.docs__feedback-popconfirm .demo__browser-viewport')).toHaveCount(1);

  // The runtime's static methods render into their own root, outside the provider, so without the bridge's
  // holderRender seam a Modal.confirm comes up in the runtime's default light theme on a dark page.
  await page.goto('/feedback/modal');
  await page.getByRole('button', { name: 'Light' }).click();
  await expect(page.getByRole('button', { name: 'Dark' })).toBeVisible();
  const staticConfirmCard = page.getByRole('heading', { level: 3, name: 'Static confirmation', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await staticConfirmCard.getByRole('button', { name: 'Confirm' }).click();
  const confirmPanel = page.locator('.ant-modal-confirm .ant-modal-container').first();
  await expect(confirmPanel).toBeVisible();
  const [panelBackground, pageBackground] = await Promise.all([
    confirmPanel.evaluate((element) => getComputedStyle(element).backgroundColor),
    page.evaluate(() => getComputedStyle(document.body).backgroundColor),
  ]);
  expect(luminance(panelBackground), 'a static confirm follows the page theme').toBeLessThan(0.5);
  expect(luminance(pageBackground)).toBeLessThan(0.5);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.getByRole('button', { name: 'Light' })).toBeVisible();

  await page.goto('/feedback/modal');
  // A Progress bar follows colorInfo, which the Astra Skin shares with the default one, so the Skin
  // check keys off a primary button instead.
  const themedButton = page.locator('.docs__feedback-modal .ant-btn-primary').first();
  const defaultSkinColor = await themedButton.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Default skin' }).click();
  await expect(page.getByRole('button', { name: 'Astra skin' })).toBeVisible();
  await expect.poll(() => themedButton.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(defaultSkinColor);
});

test('Data Display docs match the documented card geometry, coverage, and primary interactions', async ({ page }) => {
  // The second-largest section: twenty-one routes and 233 demo cards in one pass.
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 1000 });

  const pages = [
    { path: '/data-display/avatar', component: 'avatar', cards: 7, api: 17, flow: 'columns' },
    { path: '/data-display/badge', component: 'badge', cards: 12, api: 17, flow: 'columns' },
    { path: '/data-display/calendar', component: 'calendar', cards: 9, api: 17, flow: 'full' },
    { path: '/data-display/card', component: 'card', cards: 11, api: 24, flow: 'full' },
    { path: '/data-display/carousel', component: 'carousel', cards: 6, api: 19, flow: 'columns' },
    { path: '/data-display/collapse', component: 'collapse', cards: 12, api: 31, flow: 'full' },
    { path: '/data-display/descriptions', component: 'descriptions', cards: 8, api: 16, flow: 'full' },
    { path: '/data-display/empty', component: 'empty', cards: 6, api: 5, flow: 'full' },
    { path: '/data-display/image', component: 'image', cards: 12, api: 65, flow: 'columns' },
    { path: '/data-display/list', component: 'list', cards: 13, api: 32, flow: 'full' },
    { path: '/data-display/listy', component: 'listy', cards: 7, api: 18, flow: 'full' },
    { path: '/data-display/popover', component: 'popover', cards: 8, api: 4, flow: 'columns' },
    { path: '/data-display/qr-code', component: 'qr-code', cards: 11, api: 15, flow: 'columns' },
    { path: '/data-display/segmented', component: 'segmented', cards: 13, api: 19, flow: 'columns' },
    { path: '/data-display/statistic', component: 'statistic', cards: 6, api: 29, flow: 'columns' },
    { path: '/data-display/table', component: 'table', cards: 42, api: 113, flow: 'full' },
    { path: '/data-display/tag', component: 'tag', cards: 9, api: 22, flow: 'columns' },
    { path: '/data-display/timeline', component: 'timeline', cards: 11, api: 20, flow: 'columns' },
    { path: '/data-display/tooltip', component: 'tooltip', cards: 9, api: 4, flow: 'columns' },
    { path: '/data-display/tour', component: 'tour', cards: 8, api: 33, flow: 'columns' },
    { path: '/data-display/tree', component: 'tree', cards: 13, api: 55, flow: 'columns' },
  ] as const;

  for (const entry of pages) {
    await page.goto(entry.path);
    const root = page.locator(`.docs__data-display-${entry.component}`);
    await expect(root.locator('.docs__demo')).toHaveCount(entry.cards);
    await expect(page.locator('.docs__api-reference tbody tr')).toHaveCount(entry.api);
    const [rootBox, cardBox] = await Promise.all([root.boundingBox(), root.locator('.docs__demo').first().boundingBox()]);
    if (entry.flow === 'full') {
      expect(Math.abs(rootBox!.width - cardBox!.width), `${entry.component} uses the full-width card flow`).toBeLessThanOrEqual(1);
    } else {
      expect(cardBox!.width, `${entry.component} uses the two-column waterfall`).toBeLessThan(rootBox!.width * 0.55);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  await page.goto('/data-display/collapse');
  const collapseCard = page.getByRole('heading', { level: 3, name: 'Collapse', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  const firstPanel = collapseCard.locator('.ant-collapse-item').first();
  await expect(firstPanel).toHaveClass(/ant-collapse-item-active/);
  await firstPanel.locator('.ant-collapse-header').click();
  await expect(firstPanel).not.toHaveClass(/ant-collapse-item-active/);

  await page.goto('/data-display/segmented');
  const segmentedCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await segmentedCard.locator('.ant-segmented-item').nth(1).click();
  await expect(segmentedCard.locator('.ant-segmented-item-selected')).toHaveCount(1);

  await page.goto('/data-display/tooltip');
  // Upstream marks Tooltip's and Popover's shift demos iframe, because they measure the viewport edge.
  await expect(page.locator('.docs__data-display-tooltip .demo__browser-viewport')).toHaveCount(1);
  await page.goto('/data-display/popover');
  await expect(page.locator('.docs__data-display-popover .demo__browser-viewport')).toHaveCount(1);

  await page.goto('/data-display/calendar');
  await expect(page.locator('.ant-picker-calendar table').first()).toHaveCSS('display', 'table');

  await page.goto('/data-display/card');
  await expect(page.locator('.docs__data-display-card .demo__stage[data-background="grey"]')).toHaveCount(2);
  await page.goto('/data-display/statistic');
  await expect(page.locator('.docs__data-display-statistic .demo__stage[data-background="grey"]')).toHaveCount(1);

  await page.goto('/data-display/table');
  // The docs prose table rule used to reach into live demos: it forced the runtime's table to `display: block`,
  // uppercased its headers and flattened every column to left, losing per-column alignment.
  const antTable = page.locator('.docs__data-display-table .ant-table table').first();
  await expect(antTable).toHaveCSS('display', 'table');
  await expect(page.locator('.docs__data-display-table .ant-table th').first()).toHaveCSS('text-transform', 'none');
  const alignments = await page.locator('.docs__data-display-table .ant-table th, .docs__data-display-table .ant-table td')
    .evaluateAll((cells) => [...new Set(cells.map((cell) => getComputedStyle(cell).textAlign))]);
  expect(alignments.length, 'columns keep the alignment their demo asked for').toBeGreaterThan(1);

  const basicTableCard = page.getByRole('heading', { level: 3, name: 'Basic Usage', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await expect(basicTableCard.locator('tbody tr')).toHaveCount(3);

  const themedTag = page.locator('.ant-tag').first();
  await page.goto('/data-display/tag');
  const defaultSkinColor = await themedTag.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Default skin' }).click();
  await expect(page.getByRole('button', { name: 'Astra skin' })).toBeVisible();
  await expect.poll(() => themedTag.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(defaultSkinColor);
});

test('Data Entry docs match the documented card geometry, coverage, and primary interactions', async ({ page }) => {
  // Data Entry is the runtime's largest section: eighteen routes and 273 demo cards in one pass.
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 1000 });

  const pages = [
    { path: '/data-entry/auto-complete', component: 'auto-complete', cards: 10, api: 43, flow: 'columns' },
    { path: '/data-entry/cascader', component: 'cascader', cards: 20, api: 62, flow: 'columns' },
    { path: '/data-entry/checkbox', component: 'checkbox', cards: 7, api: 18, flow: 'columns' },
    { path: '/data-entry/color-picker', component: 'color-picker', cards: 14, api: 34, flow: 'columns' },
    { path: '/data-entry/date-picker', component: 'date-picker', cards: 25, api: 112, flow: 'columns' },
    { path: '/data-entry/form', component: 'form', cards: 37, api: 106, flow: 'full' },
    { path: '/data-entry/radio', component: 'radio', cards: 11, api: 31, flow: 'columns' },
    { path: '/data-entry/rate', component: 'rate', cards: 8, api: 17, flow: 'columns' },
    { path: '/data-entry/input', component: 'input', cards: 18, api: 57, flow: 'columns' },
    { path: '/data-entry/input-number', component: 'input-number', cards: 14, api: 34, flow: 'columns' },
    { path: '/data-entry/mentions', component: 'mentions', cards: 13, api: 32, flow: 'columns' },
    { path: '/data-entry/select', component: 'select', cards: 27, api: 79, flow: 'columns' },
    { path: '/data-entry/slider', component: 'slider', cards: 14, api: 34, flow: 'columns' },
    { path: '/data-entry/time-picker', component: 'time-picker', cards: 15, api: 40, flow: 'columns' },
    { path: '/data-entry/transfer', component: 'transfer', cards: 11, api: 32, flow: 'full' },
    { path: '/data-entry/tree-select', component: 'tree-select', cards: 12, api: 78, flow: 'columns' },
    { path: '/data-entry/upload', component: 'upload', cards: 21, api: 52, flow: 'columns' },
    { path: '/data-entry/switch', component: 'switch', cards: 6, api: 15, flow: 'columns' },
  ] as const;

  for (const entry of pages) {
    await page.goto(entry.path);
    const root = page.locator(`.docs__data-entry-${entry.component}`);
    await expect(root.locator('.docs__demo')).toHaveCount(entry.cards);
    await expect(page.locator('.docs__api-reference tbody tr')).toHaveCount(entry.api);
    const [rootBox, cardBox] = await Promise.all([root.boundingBox(), root.locator('.docs__demo').first().boundingBox()]);
    if (entry.flow === 'full') {
      expect(Math.abs(rootBox!.width - cardBox!.width), `${entry.component} uses the full-width card flow`).toBeLessThanOrEqual(1);
    } else {
      expect(cardBox!.width, `${entry.component} uses the two-column waterfall`).toBeLessThan(rootBox!.width * 0.55);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  await page.goto('/data-entry/auto-complete');
  const basicAutoCompleteCard = page.getByRole('heading', { level: 3, name: 'Basic Usage', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  const autoCompleteInput = basicAutoCompleteCard.getByRole('combobox').first();
  await autoCompleteInput.fill('a');
  const autoCompleteOptions = page.locator('.ant-select-dropdown:visible .ant-select-item-option');
  await expect(autoCompleteOptions).toHaveCount(3);
  // Typing "a" offers a, aa, aaa; picking the second one makes the selection observable in the input.
  await autoCompleteOptions.nth(1).click();
  await expect(autoCompleteInput).toHaveValue('aa');

  await page.goto('/data-entry/cascader');
  const basicCascaderCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await basicCascaderCard.getByRole('combobox').first().click();
  const cascaderMenus = page.locator('.ant-cascader-dropdown:visible .ant-cascader-menu');
  await expect(cascaderMenus).toHaveCount(1);
  await page.locator('.ant-cascader-dropdown:visible .ant-cascader-menu-item').filter({ hasText: 'Zhejiang' }).click();
  // Choosing a parent opens its child column, which is the whole point of a cascade.
  await expect(cascaderMenus).toHaveCount(2);

  await page.goto('/data-entry/checkbox');
  const checkAllCard = page.getByRole('heading', { level: 3, name: 'Check all', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  const checkAll = checkAllCard.getByRole('checkbox').first();
  await expect(checkAllCard.locator('.ant-checkbox-indeterminate')).toHaveCount(1);
  await checkAll.click();
  await expect(checkAllCard.locator('.ant-checkbox-indeterminate')).toHaveCount(0);
  await expect(checkAllCard.getByRole('checkbox', { checked: true })).toHaveCount(4);

  await page.goto('/data-entry/radio');
  const radioGroupCard = page.getByRole('heading', { level: 3, name: 'Radio Group', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await radioGroupCard.getByRole('radio').nth(1).check();
  await expect(radioGroupCard.getByRole('radio').nth(1)).toBeChecked();

  await page.goto('/data-entry/rate');
  const rateCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await rateCard.locator('.ant-rate-star').nth(2).click();
  await expect(rateCard.locator('.ant-rate-star-full')).toHaveCount(3);

  await page.goto('/data-entry/form');
  // Upstream marks this demo iframe="360" because it scrolls the viewport to the first invalid field.
  const scrollToFieldFrame = page.locator('.docs__data-entry-form .demo__browser-viewport');
  await expect(scrollToFieldFrame).toHaveCount(1);
  expect((await scrollToFieldFrame.boundingBox())!.height).toBe(360);

  await page.goto('/data-entry/select');
  const basicSelectCard = page.getByRole('heading', { level: 3, name: 'Basic Usage', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  const firstSelect = basicSelectCard.locator('.ant-select').first();
  // The demo's first Select already defaults to Lucy, so pick Jack to prove the selection changed.
  await expect(firstSelect.locator('.ant-select-content')).toHaveText('Lucy');
  await firstSelect.click();
  await page.locator('.ant-select-dropdown:visible .ant-select-item-option').filter({ hasText: 'Jack' }).click();
  await expect(firstSelect.locator('.ant-select-content')).toHaveText('Jack');

  await page.goto('/data-entry/transfer');
  const basicTransferCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  // Transfer is the one Data Entry component the runtime does not lay out in two columns.
  await expect(basicTransferCard.locator('.ant-transfer-section')).toHaveCount(2);

  await page.goto('/data-entry/switch');
  const basicSwitchCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  const basicSwitch = basicSwitchCard.getByRole('switch').first();
  await expect(basicSwitch).toHaveAttribute('aria-checked', 'true');
  await basicSwitch.click();
  await expect(basicSwitch).toHaveAttribute('aria-checked', 'false');

  // The Disabled demo owns a button that flips the switch's disabled state, so the switch itself
  // proves the runtime's disabled contract rather than a static screenshot of it.
  const disabledCard = page.getByRole('heading', { level: 3, name: 'Disabled', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  const disabledSwitch = disabledCard.getByRole('switch').first();
  await expect(disabledSwitch).toBeDisabled();
  await disabledCard.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(disabledSwitch).toBeEnabled();

  const themedSwitch = basicSwitchCard.locator('.ant-switch-checked').first();
  await basicSwitch.click();
  const defaultSkinColor = await themedSwitch.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Default skin' }).click();
  await expect(page.getByRole('button', { name: 'Astra skin' })).toBeVisible();
  await expect.poll(() => themedSwitch.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(defaultSkinColor);
});

test('Navigation docs match the documented card geometry, coverage, and primary interactions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  const pages = [
    { path: '/navigation/anchor', component: 'anchor', cards: 9, api: 25, flow: 'full' },
    { path: '/navigation/breadcrumb', component: 'breadcrumb', cards: 8, api: 16, flow: 'columns' },
    { path: '/navigation/dropdown', component: 'dropdown', cards: 17, api: 17, flow: 'columns' },
    { path: '/navigation/menu', component: 'menu', cards: 11, api: 45, flow: 'full' },
    { path: '/navigation/pagination', component: 'pagination', cards: 13, api: 24, flow: 'full' },
    { path: '/navigation/steps', component: 'steps', cards: 13, api: 26, flow: 'full' },
    { path: '/navigation/tabs', component: 'tabs', cards: 16, api: 40, flow: 'full' },
  ] as const;

  for (const entry of pages) {
    await page.goto(entry.path);
    const root = page.locator(`.docs__navigation-${entry.component}`);
    await expect(root.locator('.docs__demo')).toHaveCount(entry.cards);
    await expect(page.locator('.docs__api-reference tbody tr')).toHaveCount(entry.api);
    const [rootBox, cardBox] = await Promise.all([root.boundingBox(), root.locator('.docs__demo').first().boundingBox()]);
    if (entry.flow === 'full') {
      expect(Math.abs(rootBox!.width - cardBox!.width), `${entry.component} uses the full-width card flow`).toBeLessThanOrEqual(1);
    } else {
      expect(cardBox!.width, `${entry.component} uses the two-column waterfall`).toBeLessThan(rootBox!.width * 0.55);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  await page.goto('/navigation/anchor');
  const anchorFrames = page.locator('.docs__navigation-anchor .demo__browser-viewport');
  await expect(anchorFrames).toHaveCount(5);
  expect((await anchorFrames.first().boundingBox())!.height).toBe(200);
  const basicAnchorFrame = page.frameLocator('.docs__navigation-anchor .demo__browser-viewport').first();
  await basicAnchorFrame.getByText('Part 3', { exact: true }).click();
  await expect(basicAnchorFrame.locator('.ant-anchor-link-active')).toContainText('Part 3');

  await page.goto('/navigation/dropdown');
  // the runtime's link reset only reaches a demo's bare anchor through the theme hash its <App> wrapper
  // carries. Without it the Dropdown trigger loses the runtime's pointer cursor and link colour.
  const basicTrigger = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]')
    .locator('a.ant-dropdown-trigger');
  await expect(basicTrigger).toHaveCSS('cursor', 'pointer');

  const cascadingCard = page.getByRole('heading', { level: 3, name: 'Cascading menu', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await cascadingCard.locator('.demo__stage a').filter({ hasText: 'Cascading menu' }).hover();
  const submenu = page.locator('.ant-dropdown-menu-submenu').filter({ hasText: 'sub menu' }).first();
  await expect(submenu).toBeVisible();
  await submenu.hover();
  await expect(page.locator('.ant-dropdown-menu-item').filter({ hasText: '3rd menu item' })).toBeVisible();

  await page.goto('/navigation/menu');
  const inlineCard = page.getByRole('heading', { level: 3, name: 'Inline menu', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await inlineCard.getByText('Navigation Two', { exact: true }).click();
  await expect(inlineCard.getByText('Option 5', { exact: true })).toBeVisible();

  await page.goto('/navigation/pagination');
  const paginationCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await paginationCard.getByTitle('2').click();
  await expect(paginationCard.locator('.ant-pagination-item-2')).toHaveClass(/ant-pagination-item-active/);

  await page.goto('/navigation/steps');
  const clickableCard = page.getByRole('heading', { level: 3, name: 'Clickable', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await clickableCard.locator('.ant-steps').first().locator('.ant-steps-item').nth(1).click();
  await expect(clickableCard.locator('.ant-steps').first().locator('.ant-steps-item').nth(1)).toHaveClass(/ant-steps-item-process/);

  await page.goto('/navigation/tabs');
  const basicTabsCard = page.getByRole('heading', { level: 3, name: 'Basic', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await basicTabsCard.getByRole('tab', { name: 'Tab 2' }).click();
  await expect(basicTabsCard.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
  await expect(basicTabsCard.getByText('Content of Tab Pane 2')).toBeVisible();

  // Only the editable-card type carries add and close affordances, and closing one must move the
  // active tab rather than leave the panel empty.
  const editableCard = page.getByRole('heading', { level: 3, name: 'Add & close tab', exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]');
  await expect(editableCard.getByRole('tab')).toHaveCount(3);
  // rc-tabs keeps a hidden duplicate of the operations node for measurement, so target the visible add button.
  await editableCard.locator('.ant-tabs-nav-add:visible').click();
  await expect(editableCard.getByRole('tab')).toHaveCount(4);
  // The tab role sits on .ant-tabs-tab-btn; the remove button is its sibling inside .ant-tabs-tab.
  await editableCard.locator('.ant-tabs-tab').filter({ hasText: 'New Tab' }).locator('.ant-tabs-tab-remove').click();
  await expect(editableCard.getByRole('tab')).toHaveCount(3);

  await page.goto('/navigation/steps');
  const themedStep = clickableCard.locator('.ant-steps-item-process .ant-steps-item-icon').first();
  const defaultSkinColor = await themedStep.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Default skin' }).click();
  await expect(page.getByRole('button', { name: 'Astra skin' })).toBeVisible();
  await expect.poll(() => themedStep.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(defaultSkinColor);
});


/**
 * Text contrast, with the transfer curve WCAG actually specifies.
 *
 * The `contrast` helper above answers "is this surface darker than that one", which is all its
 * callers ask, and its straight-line luminance is fine for that. A ratio compared against 4.5 is a
 * different question and needs the real curve, plus compositing: disabled text is delivered as an
 * alpha, and an alpha measured as if it were opaque reads far better than what reaches the eye.
 */
function channelToLinear(value: number): number {
  const unit = value / 255;
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
}

function parseRgba(color: string): [number, number, number, number] {
  const [red = 0, green = 0, blue = 0, alpha = 1] = color.match(/[\d.]+/g)?.map(Number) ?? [];
  return [red, green, blue, alpha];
}

function textContrast(foreground: string, background: string): number {
  const [fgRed, fgGreen, fgBlue, alpha] = parseRgba(foreground);
  const [bgRed, bgGreen, bgBlue] = parseRgba(background);
  const composited = [
    fgRed * alpha + bgRed * (1 - alpha),
    fgGreen * alpha + bgGreen * (1 - alpha),
    fgBlue * alpha + bgBlue * (1 - alpha),
  ].map(channelToLinear);
  const back = [bgRed, bgGreen, bgBlue].map(channelToLinear);
  const relative = (channels: number[]) =>
    0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
  const [lighter, darker] = [relative(composited), relative(back)].sort((a, b) => b - a) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * A disabled control still has to say what it is.
 *
 * The runtime derives its disabled foreground from its own algorithm rather than from any token the
 * bridge sends, and lands on a 25%-alpha grey — about 2.1:1 on a dark surface, which is a word you
 * can see the shape of and not read. WCAG exempts inactive controls from 1.4.3, and that exemption
 * is the wrong thing to lean on here: the label on a disabled control is precisely what tells you
 * why it is disabled and what would enable it, so it is the one piece of text on the control that
 * has to survive. This is the same defect, and the same fix, as `colorTextPlaceholder`.
 *
 * The bar is 4.5:1 because this is body-sized text. Disabled still reads as disabled: the control
 * loses its border and its ground, which is the cue that does not depend on colour at all.
 */
for (const mode of ['light', 'dark'] as const) {
  test(`a disabled button's label stays readable in ${mode}`, async ({ page }) => {
    await page.addInitScript((choice) => window.localStorage.setItem('cb-theme', choice), mode);
    await page.goto('/form/button');
    await page.evaluate((choice) => document.documentElement.setAttribute('data-theme', choice), mode);

    /* Not a ghost button: those sit on the fixed mid-tone backdrop the test above pins, and the
       demo makes them deliberately faint. The claim here is about an ordinary disabled control on
       an ordinary surface, which is what a product actually renders. */
    const disabled = page
      .locator('.ant-btn:disabled:not(.ant-btn-background-ghost)')
      .filter({ has: page.locator(':scope:not(.site-button-ghost-wrapper *)') })
      .first();
    await expect(disabled).toBeVisible();

    await expect.poll(async () => {
      const { color, background } = await disabled.evaluate((element) => {
        /* Normalised through a canvas rather than read off `getComputedStyle` as-is. Tokens resolve
           to whatever colour space they were authored in — the stage here computes to `lab(...)` —
           and a regex that assumes three 0-255 channels turns that into a number that means
           nothing. Painting each colour and reading the pixel back gives sRGB for all of them. */
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d', { willReadFrequently: true })!;
        const toRgba = (value: string) => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = value;
          context.fillRect(0, 0, 1, 1);
          const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
          return `rgba(${red}, ${green}, ${blue}, ${alpha! / 255})`;
        };

        /* The nearest ancestor that actually paints. A disabled control's own ground is usually a
           translucent wash, so the colour the label is read against comes from underneath it. */
        let ground = 'rgb(255, 255, 255)';
        for (let node: Element | null = element; node; node = node.parentElement) {
          const painted = toRgba(getComputedStyle(node).backgroundColor);
          if (painted.endsWith(', 1)')) { ground = painted; break; }
        }
        return { color: toRgba(getComputedStyle(element).color), background: ground };
      });
      return Number(textContrast(color, background).toFixed(2));
    }, { timeout: 10_000 }).toBeGreaterThanOrEqual(4.5);
  });
}

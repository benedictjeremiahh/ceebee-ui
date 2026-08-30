import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:ceebee_ui_example/date_time_pickers_gallery.dart';
import 'package:ceebee_ui_example/content_display_gallery.dart';
import 'package:ceebee_ui_example/form_entries_gallery.dart';
import 'package:ceebee_ui_example/feedback_status_gallery.dart';
import 'package:ceebee_ui_example/main.dart';
import 'package:ceebee_ui_example/native_data_display_gallery.dart';
import 'package:ceebee_ui_example/native_layout_gallery.dart';
import 'package:ceebee_ui_example/app_scroll_gallery.dart';
import 'package:ceebee_ui_example/native_overlay_gallery.dart';
import 'package:ceebee_ui_example/navigation_gallery.dart';
import 'package:ceebee_ui_example/selection_controls_gallery.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('gallery switches Skin and transparency preference', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_testApp());

    expect(find.text('Surface materials'), findsOneWidget);
    expect(tester.widgetList<CbSurface>(find.byType(CbSurface)), isNotEmpty);

    await tester.tap(find.text('Astra'));
    await tester.pumpAndSettle();
    expect(
      tester.element(find.text('Surface materials')).cbTheme.skin,
      CbSkin.astra,
    );

    await tester.tap(find.text('Reduce transparency'));
    await tester.pumpAndSettle();
    expect(
      tester.element(find.text('Surface materials')).cbTheme.reduceTransparency,
      isTrue,
    );
  });

  testWidgets('save action exposes a visible progress state', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_testApp());
    await tester.scrollUntilVisible(
      find.text('Save changes'),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );

    await tester.tap(find.text('Save changes'));
    await tester.pump();
    expect(find.text('Saving'), findsOneWidget);
    expect(
      find.descendant(
        of: find.ancestor(
          of: find.text('Saving'),
          matching: find.byType(FilledButton),
        ),
        matching: find.byType(CircularProgressIndicator),
      ),
      findsOneWidget,
    );

    await tester.pump(CbMotionTokens.deliberate);
    await tester.pump();
    expect(find.text('Save changes'), findsOneWidget);
  });

  testWidgets('selection gallery exposes state changes and disabled reasons', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_testApp());
    await tester.scrollUntilVisible(
      find.byKey(automaticUpdatesKey),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );

    expect(find.text('Enabled'), findsOneWidget);
    await tester.tap(find.byKey(automaticUpdatesKey));
    await tester.pumpAndSettle();
    expect(find.text('Disabled'), findsWidgets);
    expect(find.text('Managed by your administrator'), findsOneWidget);

    await tester.scrollUntilVisible(
      find.byKey(monthPeriodKey),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.drag(
      find.byType(Scrollable).first,
      const Offset(0, CbStructure.space8),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Month'));
    await tester.pumpAndSettle();
    expect(find.text('Selected period: month'), findsOneWidget);
  });

  testWidgets(
    'profile form validates, focuses, and saves without losing input',
    (WidgetTester tester) async {
      await tester.pumpWidget(_testApp());
      await tester.scrollUntilVisible(
        find.byKey(profileSubmitKey),
        CbStructure.space8,
        scrollable: find.byType(Scrollable).first,
      );

      await tester.tap(find.byKey(profileSubmitKey));
      await tester.pump();
      expect(find.text('Enter your name'), findsOneWidget);
      expect(find.text('Enter a valid email address'), findsOneWidget);
      expect(
        tester
            .widget<EditableText>(
              find.descendant(
                of: find.byKey(profileNameKey),
                matching: find.byType(EditableText),
              ),
            )
            .focusNode
            .hasFocus,
        isTrue,
      );

      await tester.enterText(find.byKey(profileNameKey), 'Ada Lovelace');
      await tester.enterText(find.byKey(profileEmailKey), 'ada@example.com');
      FocusManager.instance.primaryFocus?.unfocus();
      await tester.pump();
      await tester.scrollUntilVisible(
        find.byKey(profileSubmitKey),
        CbStructure.space8,
        scrollable: find.byType(Scrollable).first,
      );
      await tester.drag(
        find.byType(Scrollable).first,
        const Offset(0, CbStructure.space8 * 2),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(profileSubmitKey));
      await tester.pumpAndSettle();
      expect(find.text('Profile saved for Ada Lovelace'), findsOneWidget);
    },
  );

  testWidgets('date picker returns a selected workday to the gallery', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_testApp());
    await tester.scrollUntilVisible(
      find.byKey(galleryDatePickerKey),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.drag(
      find.byType(Scrollable).first,
      const Offset(0, CbStructure.space8 * 2),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(galleryDatePickerKey));
    await tester.pumpAndSettle();
    expect(find.byType(DatePickerDialog), findsOneWidget);
    await tester.tap(
      find.descendant(
        of: find.byType(DatePickerDialog),
        matching: find.text('31'),
      ),
    );
    await tester.tap(find.text('OK'));
    await tester.pumpAndSettle();
    expect(
      tester.widget<Text>(find.byKey(gallerySelectedDateKey)).data,
      contains('31'),
    );
  });

  testWidgets('content display gallery exposes list and chip state', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_testApp());
    await tester.scrollUntilVisible(
      find.byKey(galleryContentListTileKey),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.drag(
      find.byType(Scrollable).first,
      const Offset(0, CbStructure.space8 * 2),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(galleryContentListTileKey));
    await tester.pumpAndSettle();
    expect(
      tester.widget<ListTile>(find.byKey(galleryContentListTileKey)).selected,
      isTrue,
    );

    await tester.scrollUntilVisible(
      find.byKey(galleryContentFilterChipKey),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.drag(
      find.byType(Scrollable).first,
      const Offset(0, CbStructure.space8 * 2),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(galleryContentFilterChipKey));
    await Scrollable.ensureVisible(
      tester.element(find.byKey(galleryContentInputChipKey)),
      alignment: 0.5,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Delete'));
    await tester.pumpAndSettle();

    expect(find.text('Filter: all · Choice: Recent'), findsOneWidget);
    expect(find.byKey(galleryContentInputChipKey), findsNothing);
  });

  testWidgets(
    'navigation gallery switches tabs, menus, and drawer destination',
    (WidgetTester tester) async {
      await tester.pumpWidget(_testApp());
      await tester.scrollUntilVisible(
        find.byKey(galleryReportsTabKey),
        CbStructure.space8,
        scrollable: find.byType(Scrollable).first,
      );
      await tester.tap(find.byKey(galleryReportsTabKey));
      await tester.pumpAndSettle();
      expect(
        find.text('Reports are visible only while this tab is active.'),
        findsOneWidget,
      );

      await Scrollable.ensureVisible(
        tester.element(find.byKey(galleryMenuAnchorKey)),
        alignment: 0.5,
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(galleryMenuAnchorKey));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Save view'));
      await tester.pumpAndSettle();
      expect(
        tester.widget<Text>(find.byKey(galleryMenuSelectionKey)).data,
        'Saved view',
      );

      await Scrollable.ensureVisible(
        tester.element(find.byKey(galleryOpenDrawerKey)),
        alignment: 0.5,
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(galleryOpenDrawerKey));
      await tester.pumpAndSettle();
      expect(find.byKey(galleryNavigationDrawerKey), findsOneWidget);

      await tester.tap(
        find.descendant(
          of: find.byKey(galleryNavigationDrawerKey),
          matching: find.text('Tokens'),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.byKey(galleryNavigationDrawerKey), findsNothing);
      expect(
        tester
            .widget<NavigationGallery>(find.byType(NavigationGallery))
            .drawerDestination,
        'Tokens',
      );
    },
  );

  testWidgets('feedback gallery opens and dismisses a native dialog', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_testApp());
    await tester.scrollUntilVisible(
      find.byKey(galleryDialogTriggerKey),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );
    await Scrollable.ensureVisible(
      tester.element(find.byKey(galleryDialogTriggerKey)),
      alignment: 0.5,
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(galleryDialogTriggerKey));
    await tester.pumpAndSettle();
    expect(find.text('Delete local draft?'), findsOneWidget);

    await tester.tap(find.byTooltip('Close dialog'));
    await tester.pumpAndSettle();
    expect(find.text('Delete local draft?'), findsNothing);
  });

  testWidgets('data display gallery advances, discloses, and selects', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_testApp());
    final Finder page = find.byType(Scrollable).first;

    await tester.scrollUntilVisible(
      find.byKey(galleryCarouselNextKey),
      CbStructure.space8,
      scrollable: page,
    );
    await tester.tap(find.byKey(galleryCarouselNextKey));
    await tester.pumpAndSettle();
    expect(find.text('2 of 4'), findsOneWidget);

    await tester.scrollUntilVisible(
      find.text('Blocked work'),
      CbStructure.space8,
      scrollable: page,
    );
    await tester.tap(find.text('Blocked work'));
    await tester.pumpAndSettle();
    expect(
      find.text(
        'A blocked item needs an owner, a reason, and a next review date.',
      ),
      findsOneWidget,
    );

    await tester.scrollUntilVisible(
      find.byKey(gallerySortableTableKey),
      CbStructure.space8,
      scrollable: page,
    );
    await Scrollable.ensureVisible(
      tester.element(find.byKey(gallerySortableTableKey)),
      alignment: 0.5,
    );
    await tester.pumpAndSettle();
    final Finder rowCheckboxes = find.descendant(
      of: find.byKey(gallerySortableTableKey),
      matching: find.byType(Checkbox),
    );
    await tester.tap(rowCheckboxes.at(1));
    await tester.pumpAndSettle();
    expect(find.text('Selected: Atlas'), findsOneWidget);
  });

  testWidgets('carousel controls honor disabled OS animations', (
    WidgetTester tester,
  ) async {
    tester.binding.platformDispatcher.accessibilityFeaturesTestValue =
        const FakeAccessibilityFeatures(disableAnimations: true);
    addTearDown(
      tester.binding.platformDispatcher.clearAccessibilityFeaturesTestValue,
    );
    await tester.pumpWidget(_testApp());
    await tester.scrollUntilVisible(
      find.byKey(galleryCarouselNextKey),
      CbStructure.space8,
      scrollable: find.byType(Scrollable).first,
    );

    await tester.tap(find.byKey(galleryCarouselNextKey));
    await tester.pump();

    expect(find.text('2 of 4'), findsOneWidget);
  });

  testWidgets('layout gallery preserves navigation across adaptive shells', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(900, 1400);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(child: NativeLayoutGallery()),
        ),
      ),
    );

    expect(find.byKey(galleryLayoutRailKey), findsOneWidget);
    await Scrollable.ensureVisible(
      tester.element(find.byKey(galleryLayoutRailKey)),
      alignment: 0.5,
    );
    await tester.pumpAndSettle();
    await tester.tap(
      find.descendant(
        of: find.byKey(galleryLayoutRailKey),
        matching: find.text('Reviews'),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.widget<Text>(find.byKey(galleryLayoutDestinationKey)).data,
      'Reviews',
    );

    tester.view.physicalSize = const Size(420, 1400);
    await tester.pumpAndSettle();
    expect(find.byKey(galleryLayoutRailKey), findsNothing);
    expect(find.byKey(galleryLayoutBottomBarKey), findsOneWidget);
    await Scrollable.ensureVisible(
      tester.element(find.byKey(galleryLayoutBottomBarKey)),
      alignment: 0.5,
    );
    await tester.pumpAndSettle();
    expect(
      tester.widget<Text>(find.byKey(galleryLayoutDestinationKey)).data,
      'Reviews',
    );

    await tester.tap(
      find.descendant(
        of: find.byKey(galleryLayoutBottomBarKey),
        matching: find.text('Owners'),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      tester.widget<Text>(find.byKey(galleryLayoutDestinationKey)).data,
      'Owners',
    );
  });

  testWidgets('app composition anchors sections and keeps navigation pinned', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(900, 900);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(child: AppScrollGallery()),
        ),
      ),
    );

    expect(
      tester.getTopLeft(find.byKey(galleryPinnedAnchorKey)).dy,
      tester.getTopLeft(find.byKey(galleryAnchoredScrollKey)).dy,
    );
    await tester.tap(find.byKey(const ValueKey<String>('gallery-anchor-2')));
    await tester.pumpAndSettle();

    expect(
      tester.widget<Text>(find.byKey(galleryActiveAnchorKey)).data,
      'On this page · List',
    );
    expect(find.byKey(galleryListViewKey), findsOneWidget);
    expect(
      tester.getTopLeft(find.byKey(galleryPinnedAnchorKey)).dy,
      tester.getTopLeft(find.byKey(galleryAnchoredScrollKey)).dy,
    );
  });

  testWidgets('native popovers select actions and restore trigger focus', (
    WidgetTester tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    tester.view.physicalSize = const Size(900, 900);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(
      MaterialApp(
        theme: cbThemeData(),
        home: const Scaffold(
          body: SingleChildScrollView(child: NativeOverlayGallery()),
        ),
      ),
    );

    await tester.tap(find.byKey(galleryPopoverPortalTriggerKey));
    await tester.pump();
    expect(find.byKey(galleryPopoverPortalKey), findsOneWidget);
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pump();
    expect(find.byKey(galleryPopoverPortalKey), findsNothing);
    expect(
      tester
          .widget<FilledButton>(find.byKey(galleryPopoverPortalTriggerKey))
          .focusNode
          ?.hasFocus,
      isTrue,
    );

    await tester.tap(find.byKey(galleryPopoverMenuTriggerKey));
    await tester.pumpAndSettle();
    await tester.tap(find.text('View history'));
    await tester.pumpAndSettle();
    expect(
      tester.widget<Text>(find.byKey(galleryPopoverSelectionKey)).data,
      'View history',
    );
  });
}

Widget _testApp() => const CeebeeDocsApp(animateStatus: false);
